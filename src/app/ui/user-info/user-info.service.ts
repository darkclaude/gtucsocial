import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
@Injectable()
export class UserInfoService {
    private url = "user"
    constructor(
        private afs:AngularFirestore
    ){}
    getUserInfo(uid){
        return this.afs.firestore.doc(`${this.url}/${uid}`).get()
    }
}