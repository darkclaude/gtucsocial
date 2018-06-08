import { AuthService } from './../../services/auth.service';
import { MainService } from './../../services/main.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, kebabCase } from 'lodash';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as moment from 'moment';
@Injectable()
export class FeedFormService {
  uid;
  selectedImages$: Subject<any> = new Subject();
  uploadedImages$: Subject<any> = new Subject();
  uploadedImagesProgress$: Subject<any> = new Subject();
  topicCreating$: Subject<any> = new Subject();
  constructor(
    private auth:AuthService,
    private mainService: MainService,
    private afs: AngularFirestore
  ){
    // Get user uid from local stroage
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) { 
      this.uid = user.uid;
    }
    auth.authenticated$.subscribe((authenticated:any)=>{
      if (authenticated){
        this.uid = authenticated.uid;
      }
    });
  }
  renderImages(ev){
    let that = this;
    let files = ev.target.files;
    function readAndPreview(file) {
      if ( /\.(jpe?g|png)$/i.test(file.name) ) {
        let reader = new FileReader();
        reader.addEventListener("load", function () {
          that.selectedImages$.next({
            fileName: kebabCase(file.name),
            src: this.result,
            progress: 0
          });
        }, false);
        reader.readAsDataURL(file);
      }
    }
    if (files) {
      [].forEach.call(files, readAndPreview);
    }
  }
  topicId;
  uploadImages(images){
    this.topicId = this.afs.createId();
    map(images,(file)=>{
      let update_url = `users/${this.uid}/${this.afs.createId()}`;
      let ref = firebase.storage().ref().child(update_url);
      let uploadTask = ref.putString(file.src, 'data_url');
      const id = this.afs.createId();
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot:any) =>  {
          // upload in progress
          let progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          this.uploadedImagesProgress$.next({
            fileName: file.fileName,
            progress,
          });
        },
        (error) => {
          console.log(error)
        },
        () => {
          this.afs.doc(`media/${id}`).set({
            uid: this.uid,
            id: this.topicId,
            date: moment().format(),
            url: uploadTask.snapshot.downloadURL
          });
          this.uploadedImages$.next(id);
        }
      );
    });
  }

  createTopic(newTopic, replyingTopicId?, withMedia?){
    const date = moment().format();
    newTopic.date = date;
    newTopic.created_by = this.uid;
    newTopic.replyingTopicId = replyingTopicId;
    const id = this.topicId?this.topicId:this.afs.createId();
    this.afs.doc(`posts/${id}`).set(Object.assign({}, newTopic)).then(()=>{
      const unixDate = moment().valueOf().toString();
      const postData = {id, date:unixDate, uid: this.uid, withMedia:!!withMedia};
      if (replyingTopicId) {
        // Make comments
        const url = `replies/${replyingTopicId}/data/${id}`;
        this.afs.doc(url).set(postData);
        const urlReplies = `user/${this.uid}/replies/${id}`;
        this.afs.doc(urlReplies).set(postData);
      }else{
        // Make topic
        const url = `user/${this.uid}/posts/${id}`;
        this.afs.doc(url).set(postData).then(res=>{
          this.afs.doc(`user/${this.uid}/feeds/${id}`).set(postData);
        });
      }
      if (withMedia) {
        this.afs.doc(`user/${this.uid}/media/${id}`).set(postData);
      }
      this.topicCreating$.next(false);
    });
    this.topicId = null;
  }

}
