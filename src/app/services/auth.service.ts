import { Router } from '@angular/router';
import { MainService } from './main.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase/app';
@Injectable()
export class AuthService {
  authenticated$: Observable <any> = new Observable();
  constructor(
    private route: Router,
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private mainService: MainService
  ) {
    this.authenticated$ = afAuth.authState;
    this.authenticated$.subscribe((authenticated) => {
      if (authenticated !== null) {
        localStorage.setItem('user', JSON.stringify({
          uid: authenticated.uid,
          username: (authenticated.displayName || '').replace(/[\s+/=*,@|\\]/g, '-'),
          verified: authenticated.emailVerified
        }));
        firebase.database().goOnline();
        this.userPresence(authenticated.uid);
      } else {
        localStorage.removeItem('user');
      }
    })
  }
  reSendVerificationEmail(){
    return firebase.auth().currentUser.sendEmailVerification();
  }
  deleteUser(uid){
    // soon...
  }
  signOutUser(){
    firebase.database().goOffline();
    const userStatusDatabaseRef = firebase.database().ref(`/status/${JSON.parse(localStorage.getItem("user")).uid}`);
    userStatusDatabaseRef.set({
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    });
    localStorage.clear();
    this.afAuth.auth.signOut();
    this.route.navigate(["/"]);
  }
  getUserInfo(uid) {
    return this.afs.doc(`user/${uid}`).valueChanges();
  }
  updateDisplayNameAndPhotoURL(displayName, photoURL){
    this.afAuth.auth.currentUser.updateProfile({
      displayName: displayName,
      photoURL: photoURL
    })
  }
  updateUserInfo(uid, userUpdateValues) {
    this.afs.doc(`user/${uid}`).update(userUpdateValues);
  }
  userPresence(uid){
    const userStatusDatabaseRef = firebase.database().ref(`/status/${uid}`);
    const isOfflineForDatabase = {
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    const isOnlineForDatabase = {
      state: "online",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    var connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function(snap) {
      if (snap.val() === true) {
        userStatusDatabaseRef.set(isOnlineForDatabase);
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase);
      }
    });
  }
}
