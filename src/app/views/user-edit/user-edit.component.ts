import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { MainService } from './../../services/main.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
  UID;
  userLocal = JSON.parse(localStorage.getItem("user"));
  constructor(
    private route: Router,
    private auth: AuthService,
    private mainService: MainService
  ){
    this.UID = this.userLocal?this.userLocal.uid:'';
    auth.authenticated$.subscribe((authenticated:any)=>{
      if (authenticated){
        this.getUserInfo(authenticated.uid);
      } else {
        this.userLocal = null;
      }
    })
  }

  getUserInfo(uid){
    this.auth.getUserInfo(uid).subscribe(res=>{
      if (res) {
        this.userLocal = res
      } else {
        this.route.navigate(["/"]);
      }
    });
  }

  ngOnInit() {
  }
  ngOnDestroy(){
  }
}
