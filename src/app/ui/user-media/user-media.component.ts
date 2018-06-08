import { MainService } from './../../services/main.service';
import { ModalFeedComponent } from './../../modals/modal-feed/modal-feed.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnChanges, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'fio-user-media',
  templateUrl: './user-media.component.html',
  styleUrls: ['./user-media.component.scss']
})
export class UserMediaComponent implements OnChanges {
  @Input() uid;
  media = []
  constructor(
    private mainService: MainService, 
    private modalService: NgbModal,
    private afs:AngularFirestore
  ){}
  ngOnChanges() {
    if (this.uid) {
      this.media = [];
      this.afs.firestore.collection(`media`)
      .where("uid", "==", this.uid)
      .limit(6)
      .get()
      .then((documentSnapshots:any)=>{
        documentSnapshots.forEach(doc => {
          let data = doc.data();
          data.key = doc.id;
          this.media.push(data);
        });
      });
    }
  }
  openTopic(id){
    this.mainService.openTopicModal(id);
  }
}
