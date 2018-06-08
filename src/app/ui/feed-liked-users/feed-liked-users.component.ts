import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'fio-feed-liked-users',
  templateUrl: './feed-liked-users.component.html',
  styleUrls: ['./feed-liked-users.component.scss']
})
export class FeedLikedUsersComponent implements OnChanges {
  @Input() _id;
  likedUsers = [];
  constructor(private afs: AngularFirestore){}
  ngOnChanges(){
    if (this._id) {
      this.likedUsers = [];
      this.afs.firestore.collection(`posts/${this._id}/liked`).limit(10).get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.likedUsers.unshift(doc.data())
        });
      });
    }
  }

}
