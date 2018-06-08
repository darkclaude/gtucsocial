import { Router } from '@angular/router';
import { MainService } from './../../services/main.service';
import { UserService } from './user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService]
})
export class UserComponent{
  userInfo$;
  user;
  uid;
  childRoute;
  constructor(
    private userService: UserService,
    private route: Router,
    private mainService:MainService
  ){
    this.userInfo$ = mainService.userInfo$.subscribe(user=>{
      this.childRoute = this.route.url.split("/")[2];
      if (user) {
        this.user = user;
        this.uid = user.uid;
      }else{
        this.route.navigate(["/"]);
      }
    });
  }
}
