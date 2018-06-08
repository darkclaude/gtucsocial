const functions = require('firebase-functions');
const firestore = functions.firestore;
const db = functions.database;
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const afs = admin.firestore();
const moment = require('moment');
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
emitter.setMaxListeners(20);
// or 0 to turn off the limit
emitter.setMaxListeners(0);

const counter = function(url, objectName, count){
    return afs.doc(url).get().then(doc=>{
        if (doc.data()[objectName]) {
            doc.ref.update({
                [objectName]: doc.data()[objectName] + count
            });
        } else {
            doc.ref.update({
                [objectName]: count
            });
        }
    });
}

const newNotification = function(url, type, dataID){
    return afs.collection(`${url}/data`).add({
        type: type,
        data: {
            uid: dataID
        }
    }).then(function(){
        afs.doc(url).set({notifications: 1});
    });
}


// User Follower and Unfollwer counting
exports.newFollowing = firestore.document('following/data/{uid}/{followerUID}').onCreate(event => {
    const url = `user/${event.params.uid}`;
    return counter(url, 'following_count', 1);
});
exports.unFollowing = firestore.document('following/data/{uid}/{followerUID}').onDelete(event => {
    const url = `user/${event.params.uid}`;
    return counter(url, 'following_count', -1);
});

exports.newFollower = firestore.document('followers/data/{uid}/{followerUID}').onCreate(event => {
    const url = `user/${event.params.uid}`;
    counter(url, 'followers_count', 1);
    newNotification(`notifications/${event.params.uid}`, 'new_follower', event.params.followerUID);
    return afs.collection(`${url}/posts`).orderBy("date", "desc").limit(5).get().then(snapshot => {
        snapshot.forEach(doc => {
            return afs.doc(`user/${event.params.followerUID}/feeds/${doc.data().id}`)
            .set(doc.data());
        });
    });
});

exports.newUnFollower = firestore.document('followers/data/{uid}/{unFollowerUID}').onDelete(event => {
    const url = `user/${event.params.unFollowerUID}`;
    counter(`user/${event.params.uid}`, 'followers_count', -1);
    newNotification(`notifications/${event.params.uid}`, 'new_unfollower', event.params.unFollowerUID);
    return afs.collection(`${url}/feeds`)
        .where('uid', '==', event.params.uid)
        .get().then(snapshot => {
            snapshot.forEach(doc => {
                doc.ref.delete();
            });
        });
});

exports.userPresence = db.ref('/status/{uid}').onUpdate(event => {
    const eventStatus = event.data.val();
    const userStatusFirestoreRef = afs.doc(`status/${event.params.uid}`);
    return event.data.ref.once('value').then(statusSnapshot => {
        const status = statusSnapshot.val();
        if (status.last_changed > eventStatus.last_changed) return;
        eventStatus.last_changed = new Date(eventStatus.last_changed);
        return userStatusFirestoreRef.set(eventStatus);
    });
});

exports.newPost = firestore.document('user/{uid}/posts/{id}').onCreate(event => {
    const val = event.data.data();
    const url = `user/${event.params.uid}`;
    counter(url, 'posts_count', 1);
    return afs.collection(`followers/data/${event.params.uid}`).get().then(snapshot => {
        snapshot.forEach(doc => {
            if (event.params.uid!==doc.data().uid) {
                afs.doc(`user/${doc.data().uid}/feeds/${event.params.id}`).set(val);
            }
        });
    });
});

exports.deletePost = firestore.document('user/{uid}/posts/{id}').onDelete(event => {
    var deletedValue = event.data.previous.data();
    counter(`user/${event.params.uid}/`, 'posts_count', -1);
    if (deletedValue.withMedia) {
        afs.doc(`user/${event.params.uid}/media/${event.params.id}`).delete();
        afs.collection(`media`)
        .where("id", "==", event.params.id).get().then(snapshot => {
            snapshot.forEach(doc => {
                doc.ref.delete();
            });
        });
    }
    afs.doc(`user/${event.params.uid}/posts/${event.params.id}`).delete();
    return afs.collection(`followers/data/${event.params.uid}`).get().then(snapshot => {
        snapshot.forEach(doc => {
            if (event.params.uid!==doc.data().uid) {
                afs.doc(`user/${doc.data().uid}/feeds/${event.params.id}`).delete();
            }
        });
    });
});

exports.countPostLikes = firestore.document(`posts/{id}/liked/{uid}`).onCreate(event => {
    const url = `user/${event.params.uid}`;
    counter(`posts/${event.params.id}`, 'likes_count', 1);
    return counter(url, 'likes_count', 1);
});
  
exports.countPostUnLikes = firestore.document(`posts/{id}/liked/{uid}`).onDelete(event => {
    const url = `user/${event.params.uid}`;
    counter(`posts/${event.params.id}`, 'likes_count', -1);
    return counter(url, 'likes_count', -1);
});

exports.notificationRepliesTopic = firestore.document(`user/{uid}/replies/{id}`).onCreate(event => {
    return newNotification(`notifications/${event.params.uid}`, 'new_replies', event.params.id);
});
exports.repliesTopic = firestore.document(`replies/{replyingTopicId}/data/{id}`).onCreate(event => {
    const val = event.data.data();
    const url = `user/${val.uid}`;
    counter(`posts/${event.params.replyingTopicId}`, 'replies_count', 1);
    return counter(url, 'replies_count', 1);
});

exports.repliesTopicDeleted = firestore.document(`replies/{replyingTopicId}/data/{id}`).onDelete(event => {
    const val = event.data.previous.data();
    const url = `user/${val.uid}`;
    counter(`posts/${event.params.replyingTopicId}`, 'replies_count', -1);
    return counter(url, 'replies_count', -1);
});

exports.countUserMediaTopics = firestore.document(`user/{uid}/media/{id}`).onCreate(event => {
    const url = `user/${event.params.uid}`;
    return counter(url, 'media_count', 1);
});

exports.countUserMediaTopicsDelete = firestore.document(`user/{uid}/media/{id}`).onDelete(event => {
    const url = `user/${event.params.uid}`;
    return counter(url, 'media_count', -1);
});