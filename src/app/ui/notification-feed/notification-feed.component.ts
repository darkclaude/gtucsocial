import { MainService } from './../../services/main.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'fio-notification-feed',
  templateUrl: './notification-feed.component.html',
  styleUrls: ['./notification-feed.component.scss']
})
export class NotificationFeedComponent implements OnChanges {
  @Input() _id;
  topic;
  constructor(
    private mainService:MainService, 
    private afs:AngularFirestore
  ){}
  ngOnChanges() {
    if (this._id) {
      this.afs.firestore.doc(`posts/${this._id}`).get().then(doc=>{
        if (doc.exists) {
          this.topic = doc.data();
        }
      })
    }
  }
  openTopic(){
    this.mainService.openTopicModal(this._id);
  }
}
