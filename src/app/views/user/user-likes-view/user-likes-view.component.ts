import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from './../../../services/main.service';

@Component({
  selector: 'fio-user-likes-view',
  templateUrl: './user-likes-view.component.html',
  styleUrls: ['./user-likes-view.component.scss']
})
export class UserLikesViewComponent implements OnDestroy {
  userInfo$;
  getUserNameFromUrl$;
  URL:string;
  uid;
  constructor(
    private route: Router,
    private mainService: MainService,
  ){
    this.userInfo$ = mainService.userInfo$.subscribe(user=>{
      if (!user){
        this.route.navigate(["/"]);
      } else {
        if(this.uid!==user.uid){
          this.uid = user.uid;
          this.URL = `user/${this.uid}/likes`;
        }
      }
    });
    this.getUserNameFromUrl$ = mainService
      .getUserNameFromUrl()
      .subscribe((val:any)=>{
        this.mainService.getIdByUsername(this.route.url.split("/")[1]);
      });
  }

  ngOnDestroy(){
    this.getUserNameFromUrl$.unsubscribe();
    this.userInfo$.unsubscribe();
  }

}
