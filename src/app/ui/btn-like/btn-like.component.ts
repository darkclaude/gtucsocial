import { AuthService } from './../../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'fio-btn-like',
  templateUrl: './btn-like.component.html',
  styleUrls: ['./btn-like.component.scss']
})
export class BtnLikeComponent implements OnChanges {
  uid;
  @Input() _id;
  userLiked;
  likeThrottle:boolean=false;
  userLocal = JSON.parse(localStorage.getItem("user"));
  disabledAction:boolean=this.userLocal==null;
  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
  ){
    auth.authenticated$.subscribe((authenticated:any)=>{
      if (authenticated){
        this.userLocal
        ?this.userLocal.uid = authenticated.uid
        :this.userLocal = {
          uid: authenticated.uid,
          username: authenticated.displayName
        }
      } else {
        this.disabledAction = null;
      }
    });
  }
  ngOnChanges(){
    if (this._id&&this.userLocal) {
      this.likeThrottle = true;
      this.afs.doc(`posts/${this._id}/liked/${this.userLocal.uid}`)
      .valueChanges().subscribe(res=>{
        this.userLiked = res !== null;
        this.likeThrottle = false;
      })
    }
  }
  like(){
    if (this.userLocal) {
      this.likeThrottle = true;
      const urlReplies = `user/${this.userLocal.uid}/likes/${this._id}`;
      if (!this.userLiked) {
        const postData = {id: this._id, date: new Date().toString(), uid: this.userLocal.uid};
        this.afs.doc(urlReplies).set(postData);
        this.afs.doc(`posts/${this._id}/liked/${this.userLocal.uid}`).set({
          uid: this.userLocal.uid
        }).then(()=>{this.likeThrottle = false;this.userLiked = true});
      } else {
        this.afs.doc(urlReplies).delete();
        this.afs.doc(`posts/${this._id}/liked/${this.userLocal.uid}`).delete()
        .then(()=>{this.likeThrottle = false;this.userLiked = false}); 
      } 
    } else {
      alert("Please login! If you want to like.")
    }
  }

}
