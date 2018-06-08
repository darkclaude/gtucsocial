import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class UnAuthenticatedViewService {
    constructor(
        private afs:AngularFirestore
    ){}
    getLastActiveUsers(){
        return this.afs.firestore.collection(`user`)
        .orderBy("followers_count", "asc")
        .limit(6)
        .get();
    }
}