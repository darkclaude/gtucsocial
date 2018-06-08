import { UserService } from './../user.service';
import { MainService } from './../../../services/main.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'fio-user-posts-media',
  templateUrl: './user-posts-media.component.html',
  styleUrls: ['./user-posts-media.component.scss']
})
export class UserPostsMediaComponent implements OnDestroy {
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
          this.URL = `user/${this.uid}/media`;
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
