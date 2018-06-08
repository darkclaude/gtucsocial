import { LandingPageService } from './landing-page.service';
import { Component } from '@angular/core';
import { AuthService } from './../../services/auth.service';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [LandingPageService]
})
export class LandingPageComponent{
  authenticatedUID;
  userLocal = JSON.parse(localStorage.getItem("user"));
  trendingNews = [];
  constructor(
    private auth:AuthService,
    private landingPageService: LandingPageService
  ){
    this.authenticatedUID = this.userLocal?this.userLocal.uid:'';
    auth.authenticated$.subscribe((authenticated:any)=>{
      if (authenticated){
        this.getUserInfo(authenticated.uid);
      } else {
        this.userLocal = null;
      }
      this.authenticatedUID = !!authenticated;
    });
  }
  getUserInfo(uid){
    this.auth.getUserInfo(uid).subscribe(res=>this.userLocal = res);
  }
}
