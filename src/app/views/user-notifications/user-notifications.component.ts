import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
  $notifications;
  notifications;
  userLocal = JSON.parse(localStorage.getItem("user"));
  constructor(
    private afs: AngularFirestore
  ){
    this.$notifications = afs.collection(`notifications/${this.userLocal.uid}/data`).valueChanges().subscribe(res=>{
      this.notifications = res;
      afs.doc(`notifications/${this.userLocal.uid}`).set({
        notifications: 0
      });
    });
  }

  ngOnInit() {
  }

}
