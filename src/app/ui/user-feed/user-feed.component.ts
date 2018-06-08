import { remove } from 'lodash';
import { MainService } from './../../services/main.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';

@Component({
  selector: 'fio-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.scss']
})
export class UserFeedComponent implements OnInit, OnChanges, OnDestroy{
  @Input() url;
  @Input() uid;
  // URL:string;
  userInfo$;
  getUserNameFromUrl$;
  // uid;
  user;
  posts = [];
  newPosts = [];
  lastVisible;
  finished:boolean;
  unWatchCollection$;
  constructor(
    private mainService: MainService,
  ){
    mainService.$deletedTopic.subscribe(res=>{
      remove(this.posts, function(o) { return o.id==res; });
    });
  }
  watchForNewPosts$;
  watchForNewPosts(){
    this.watchForNewPosts$ = this.mainService.watchForNewPosts(this.url, this.posts[0].date)
    .onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        if (doc.data().uid == this.uid) {
          this.posts.unshift(doc.data())
        } else {
          this.newPosts.push(doc.data())
        }
      });
    });
  }
  loadingData:boolean;
  ngOnChanges(){
    if (this.uid&&this.url) {
      this.loadingData = true;
      this.posts = [];
      this.newPosts = [];
      this.mainService.getUserPosts(this.url, 15)
        .then((documentSnapshots:any)=>{
          this.loadingData = false;
          documentSnapshots.forEach(doc => {
            this.posts.push(doc.data())
          });
          this.lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
          if (this.posts[0]){
            this.watchForNewPosts();
          }else{
            this.unWatchCollection$ = this.mainService
            .watchUserFreshTopic(this.url)
            .onSnapshot((snapshot)=>{
              snapshot.docChanges.forEach((change)=>{
                if (change.type === "added") {
                  const docVal = change.doc.data();
                  if (docVal.uid == this.uid) {
                    this.posts.unshift(docVal)
                  } else {
                    this.newPosts.push(docVal)
                  }
                }
              });
            });
          }
        });
    }
  }
  ngOnInit(){}
  scrollPrestine:boolean=true;
  onScroll(){
    if (this.posts.length>14) {  
      this.scrollPrestine = false;
      !this.finished?this.getScrolledPosts():''
    }
  }
  getScrolledPosts(){
    this.mainService.getScrolledPosts(this.url, this.lastVisible)
    .then((documentSnapshots:any)=>{
      this.lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
      if (!this.lastVisible) {
        this.finished = true
      } else {
        documentSnapshots.forEach(doc => {
          this.posts.push(doc.data())
        });
      }
    })
  }
  mergeNewAddedTopic(){
    this.newPosts.forEach(val=>{
      this.posts.unshift(val);
    });
    this.newPosts=[];
  }

  ngOnDestroy(){
    if (this.unWatchCollection$){
      this.unWatchCollection$();
    }
    if(this.watchForNewPosts$){
      this.watchForNewPosts$();
    }
  }
}