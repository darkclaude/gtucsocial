import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { MainService } from './../../../services/main.service';

@Component({
  selector: 'fio-user-posts-view',
  templateUrl: './user-posts-view.component.html',
  styleUrls: ['./user-posts-view.component.scss']
})
export class UserPostsViewComponent implements OnDestroy {
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
        this.uid = user.uid;
        this.URL = `user/${this.uid}/posts`;
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
