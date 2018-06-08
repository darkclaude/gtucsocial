import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
// RXJS
import { Subject } from 'rxjs/Subject';
// LODASH
import { capitalize } from 'lodash';
// FIREBASE
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class UserLoginFormService { 
    userLoginError$:Subject<any> = new Subject;
    constructor(
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth
    ){}
    socialLogin(providerType){
        const providerName = capitalize(providerType) + 'AuthProvider';
        const provider = new firebase.auth[providerName]();
        this.afAuth.auth.signInWithPopup(provider)
            .then(res=>{
                this.afAuth.auth.currentUser.updateProfile({
                    displayName: (res.user.displayName).replace(/[\s+/=*,@|\\]/g, '-'),
                    photoURL: res.user.photoURL
                });
                this.saveNewUser(res.user);
            })
            .catch(error=>this.userLoginError$.next(error));
    }
    signInWithEmailAndPassword(email, password){
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(res=>{
            this.saveLocalStorage(res);
        })
        .catch(error=>this.userLoginError$.next(error));
    }
    signInWithUsernameOrEmail(email_username:string, password:string) {
        if (email_username.includes('@')) {
            this.signInWithEmailAndPassword(email_username, password);
        } else {
            let search_url = "users_uid";
            let search_from = "username";
            let seach_value = email_username;
            this.afs.collection(search_url, ref=>ref
                .where(search_from, "==", seach_value)
            )
            .valueChanges()
            .map(res=>res[0])
            .subscribe((res:any)=>{
                this.signInWithEmailAndPassword(res.email, password);
            });
        }
    }
    saveNewUser(user){
        // Store User Locally
        this.saveLocalStorage(user);
        // Store User Database
        let updateUser = () => {
            const _id = this.afs.createId();
            this.afs.doc(`users_uid/${user.uid}`).set({
                username: (user.displayName).replace(/[\s+/=*,@|\\]/g, '-'),
                uid: user.uid,
                email: user.email
            });
            this.afs.doc(`user/${user.uid}`).set({
                username: (user.displayName).replace(/[\s+/=*,@|\\]/g, '-'),
                uid: user.uid,
                email: user.email,
                verified: user.emailVerified,
                avatar: user.photoURL,
                privateMessageSecure: false,
                introMessage: false
            });
        }
        // check if user already exists
        this.afs.firestore.doc(`users_uid/${user.uid}`).get()
        .then(doc => {
            !doc.exists ? updateUser() : '';
        });
    }
    saveLocalStorage(res){
        localStorage.setItem('user', JSON.stringify({
            uid: res.uid,
            username: (res.displayName).replace(/[\s+/=*,@|\\]/g, '-'),
            verified: res.emailVerified
        }));
    }
}