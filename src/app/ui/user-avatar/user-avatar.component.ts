import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'fio-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnChanges {
  @Input() modal:boolean;
  @Input() followHide:boolean=false;
  @Input() presence:boolean;
  @Input() src:string;
  @Input() username:string;
  @Input() uid:string;
  @Input() size:string = "lg";
  user;
  constructor(private afs: AngularFirestore){}

  ngOnChanges() {
    if (this.uid){
      this.afs.doc(`user/${this.uid}`).valueChanges().subscribe((res:any)=>{
        this.user = res;
        if (res) { 
          this.src = res.avatar;
        }
      });
    }
  }

}
