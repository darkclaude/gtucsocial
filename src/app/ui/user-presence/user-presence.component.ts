import { AuthService } from './../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import {Component,  OnInit,  Input} from '@angular/core';
import * as firebase from 'firebase/app';
@Component({
  selector: 'fio-user-presence',
  templateUrl: './user-presence.component.html',
  styleUrls: ['./user-presence.component.scss']
})
export class UserPresenceComponent implements OnInit {
  @Input() dotted:boolean=false;
  @Input() uid;
  online;
  constructor(
    private db:AngularFireDatabase,
    private afs: AngularFirestore,
    private auth: AuthService,
  ){}

  ngOnInit() {
    if (this.uid) {
      this.db.object(`/status/${this.uid}`).valueChanges().subscribe((res:any)=>{
        this.online=res;
      });
    }
  }
}

