import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from './../../services/main.service';
@Component({
  selector: 'fio-feed-replies',
  templateUrl: './feed-replies.component.html',
  styleUrls: ['./feed-replies.component.scss']
})
export class FeedRepliesComponent implements OnChanges, OnDestroy {
  @Input() _id;
  @Input() innerReply:boolean;
  @Input() loadReplies:boolean;
  URL: string;
  user = JSON.parse(localStorage.getItem("user"));
  uid;
  posts = [];
  newPosts = [];
  lastVisible;
  finished:boolean;
  unWatchCollection$;
  constructor(
    private mainService: MainService
  ){}
  ngOnChanges(){
    if (this.user) {
      this.uid = this.user.uid;
    }
    if (this._id) {
      if (this.posts[0]&&!this.unWatchCollection$) {
        this.watchForNewPostsUnSub();
      }else{
        this.unWatchCollection$?this.unWatchCollection$():'';
      }
      this.posts = []; this.newPosts = [];
      this.lastVisible = null;
      
      this.URL = `replies/${this._id}/data`;
      let postLimit = this.innerReply?1:4;
      this.mainService.getUserPosts(this.URL, postLimit)
      .then((documentSnapshots:any)=>{
        
        documentSnapshots.forEach(doc => {
          this.posts.push(doc.data())
        });

        this.lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];

        if (this.posts[0]){
          this.watchForNewPosts();
        }else{
          this.unWatchCollection$ = this.mainService.watchUserFreshTopic(this.URL)
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
  
  watchForNewPostsUnSub;
  watchForNewPosts(){
    this.watchForNewPostsUnSub = this.mainService
    .watchForNewPosts(this.URL, this.posts[0].date)
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

  onScroll () {
    !this.finished?this.getScrolledPosts():'';
  }

  getScrolledPosts(){
    this.mainService.getScrolledPosts(this.URL, this.lastVisible)
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
    if (this.unWatchCollection$) {
      this.unWatchCollection$();
    }
  }

}
