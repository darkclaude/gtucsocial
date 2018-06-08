import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fio-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  @Input() dismissible:boolean = true;
  @Input() type: string = 'info';
  @Input() uid: string;
  constructor(
    private auth: AuthService
  ){}

  ngOnInit() {
  }
  toggleAlert:boolean=true;
  closeAlert(){
    this.toggleAlert = false;
    if (this.uid) {
      this.auth.updateUserInfo(this.uid, {
        introMessage: false
      })
    }
  }

}
