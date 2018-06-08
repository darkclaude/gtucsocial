import { MainService } from './../../services/main.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
    constructor(
        private afs:AngularFirestore,
        private mainService: MainService
    ){}
    getUserPosts(uid, url){
        return this.mainService.getUserPosts(`user/${uid}/${url}`, 12);
    }
    watchForNewPosts(uid, startBefore, url){
        return this.mainService.watchForNewPosts(`user/${uid}/${url}`, startBefore);
    }
    getScrolledPosts(uid, startAfter, url){
        return this.mainService.getScrolledPosts(`user/${uid}/${url}`, startAfter);
    }
}