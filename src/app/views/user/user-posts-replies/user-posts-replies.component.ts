import { MainService } from './../../../services/main.service';
import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'fio-user-posts-replies',
  templateUrl: './user-posts-replies.component.html',
  styleUrls: ['./user-posts-replies.component.scss']
})
export class UserPostsRepliesComponent implements OnDestroy {
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
          this.URL = `user/${this.uid}/replies`;
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
