import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnChanges, Input, ViewChild } from '@angular/core';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'fio-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnChanges {
  @Input() uid;
  user;
  constructor(private afs: AngularFirestore) { }
  ngOnChanges() {
    if (this.uid) {
      this.afs.firestore.doc(`users_uid/${this.uid}`).get().then((doc)=>{
        this.user = doc.data();
      });
    }
  }
  popoverView:boolean;
  popoverViewOver:boolean;
  @ViewChild('a') public popover: NgbPopover;
  popoverToggleVal;
  popoverToggle(value){
    this.popoverToggleVal = value;
    if (value) {
      setTimeout(()=>{
        if (this.popoverToggleVal) { 
          this.popover.open();
        }
      }, 1000)
    } else {
      setTimeout(()=>{
        if (!this.popoverViewOver) { 
          this.popover.close();
          this.popoverViewOver = false;
        }
      }, 450);
    }
  }
  popoverOpen(){
    this.popoverViewOver = true;
    this.popover.open();
  }
  popoverClose(){
    this.popover.close();
    this.popoverViewOver = false;
  }
}
