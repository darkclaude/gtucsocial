import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable, Input } from '@angular/core';
import 'rxjs/add/operator/take';

@Injectable()
export class UserFollowersService {
    constructor(private afs: AngularFirestore){ }
    getFollowers(uid, limit, url){
        return this.afs.firestore.collection(`${url}/data/${uid}`).limit(limit).get();
    }
}