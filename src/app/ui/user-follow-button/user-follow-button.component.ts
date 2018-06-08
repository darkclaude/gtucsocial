import { AngularFirestore } from 'angularfire2/firestore';
import { Component, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'fio-user-follow-button',
  templateUrl: './user-follow-button.component.html',
  styleUrls: ['./user-follow-button.component.scss']
})
export class UserFollowButtonComponent implements OnChanges {
  @Input() followingTo:string;
  @Input() uid:string;
  userLocal = JSON.parse(localStorage.getItem("user"));
  constructor(
    private afs:AngularFirestore
  ){
    if (this.userLocal) {
      this.uid = this.userLocal.uid;
    }
  }
  user_followed:boolean=false;
  ngOnChanges() {
    if (this.followingTo) {
      this
      .afs
      .doc(`followers/data/${this.followingTo}/${this.uid}`)
      .valueChanges()
      .subscribe(e=>{
        this.user_followed=e !== null;
      })
    }
  }
  followToUser(){
    this
      .afs
      .doc(`followers/data/${this.followingTo}/${this.uid}`)
      .set({uid:this.uid});
    this
      .afs
      .doc(`following/data/${this.uid}/${this.followingTo}`)
      .set({uid:this.followingTo});
  }
  unFollowToUser(){
    this
      .afs
      .doc(`followers/data/${this.followingTo}/${this.uid}`)
      .delete();
    this
      .afs
      .doc(`following/data/${this.uid}/${this.followingTo}`)
      .delete();
  }
}

