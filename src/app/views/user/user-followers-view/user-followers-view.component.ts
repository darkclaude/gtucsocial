import { MainService } from './../../../services/main.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'fio-user-followers-view',
  templateUrl: './user-followers-view.component.html',
  styleUrls: ['./user-followers-view.component.scss']
})
export class UserFollowersViewComponent implements OnInit, OnDestroy {
  userInfo$;
  getUserNameFromUrl$;
  uid:string;
  constructor(
    private route: Router,
    private mainService: MainService,
  ){
    this.userInfo$ = mainService.userInfo$.subscribe(user=>{
      if (user){
        this.uid = user.uid;
      }else{
        this.route.navigate(["/"]);
      }
    });
    this.getUserNameFromUrl$ = mainService
    .getUserNameFromUrl()
    .subscribe((val:any)=>{
      this.mainService.getIdByUsername(this.route.url.split("/")[1]);
    });
  }

  ngOnDestroy(){
    this.userInfo$.unsubscribe();
    this.getUserNameFromUrl$.unsubscribe();
  }

  ngOnInit() {
  }

}
