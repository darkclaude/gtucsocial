import { Router } from '@angular/router';
import { MainService } from './../../services/main.service';
import { AuthService } from './../../services/auth.service';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class UserRegisterFormService {
    createdNewUser$: Subject<any> = new Subject();
    constructor(
        private route: Router,
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth,
        private auth: AuthService,
        private mainService: MainService
    ){}
    register(url, user, username){
        return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
            .then((newUser)=>{
                newUser.updateProfile({
                    displayName: username,
                    photoURL: "" 
                }).then(()=>{
                    this.saveUserUID(newUser, username);
                });
            });
    }
    saveUserUID(afAuthRes, username){
        this.afs.doc(`user/${afAuthRes.uid}`).set({
            email: afAuthRes.email,
            username,
            uid: afAuthRes.uid,
            verified: afAuthRes.emailVerified,
            privateMessageSecure: false,
            introMessage: true
        }).then(()=>{
            this.route.navigate([`${this.afAuth.auth.currentUser.displayName}/edit`])
        });
        this.afs.doc(`users_uid/${afAuthRes.uid}`).set({
            email: afAuthRes.email,
            username,
            uid: afAuthRes.uid
        })
    }
}