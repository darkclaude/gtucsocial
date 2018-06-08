import { ModalFeedComponent } from './../modals/modal-feed/modal-feed.component';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore,fromDocRef} from 'angularfire2/firestore';
import {Injectable} from '@angular/core';
@Injectable()
export class MainService {
  userInfo$:Subject<any> = new Subject();
  openingModal: Subject<any> = new Subject();
  $deletedTopic: Subject<any> = new Subject();
  openedModal:boolean=false;
  modalOpened:boolean;
  modalRef;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private modalService: NgbModal,
  ){
    this.openingModal.subscribe(id=>{
      if (this.modalOpened) {
        this.modalRef.componentInstance._id = id;
      } else {
        this.modalRef = this.modalService.open(ModalFeedComponent);
        this.modalRef.result.then((result) => {
          this.modalOpened = false;
        }, (reason) => {
          this.modalOpened = false;
        });
        this.modalRef.componentInstance._id = id;
        this.modalOpened = true;
      }  
    });
    
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  getUsers() {
    return this.afs.collection(`user`).valueChanges();
  }
  getUserNameFromUrl() {
    return this.router.events
      .filter(e => e instanceof NavigationEnd)
      .map(() => {
        let route = this.route;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .map(data => {
        return data.params})
      .map(res => res["_value"]);
  }
  getIdByUsername(query: string) {
    this.afs.collection(`user`, ref => ref
        .where('username', "==", query)
      )
      .valueChanges()
      .map(res => res[0])
      .take(1)
      .subscribe((res: any) => this.userInfo$.next(res));
  }
  openTopicModal(id){
    this.openingModal.next(id);
  }
  getSinglePost(id){
    return this.afs
    .firestore
    .doc(`posts/${id}`)
    .get();
  }
  getUserPosts(url, limit?){
    return this.afs.firestore.collection(url)
    .orderBy("date", "desc")
    .limit(limit||12)
    .get();
  }
  watchUserFreshTopic(url){
    return this.afs.firestore
    .collection(url)
    .orderBy("date", "desc");
  }
  watchForNewPosts(url, startBefore){
    return this.afs.firestore.collection(url)
      .orderBy("date", "desc")
      .where('date', ">", startBefore)
      .limit(1);
  }
  getScrolledPosts(url, startAfter){
    return this.afs.firestore.collection(url)
      .orderBy("date", "desc")
      .startAfter(startAfter)
      .limit(4)
      .get();
  }

  getTrendingTopics(){
    return this.afs.firestore.collection(`posts`)
    .orderBy("likes_count", "desc")
    .limit(6)
    .get();
  }
}

