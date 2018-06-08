import { AngularFirestore } from 'angularfire2/firestore';
import { Component, Input, OnChanges, ElementRef } from '@angular/core';
import { MainService } from './../../services/main.service';
@Component({
  selector: 'fio-feed-modal',
  templateUrl: './feed-modal.component.html',
  styleUrls: ['./feed-modal.component.scss']
})
export class FeedModalComponent implements OnChanges {
  @Input() _id;
  @Input() noReplies:boolean;
  topic;
  constructor(
    private elementRef: ElementRef,
    private afs: AngularFirestore,
    private mainService: MainService
  ){}
  ngOnChanges() {
    if (this._id) {
      this.afs
        .doc(`posts/${this._id}`)
        .valueChanges()
        .take(1)
        .subscribe((res:any)=>{
          this.topic = res;
        })
    }
  }
  changeTopic(_id){
    this.mainService.openingModal.next(_id);
  }
}
