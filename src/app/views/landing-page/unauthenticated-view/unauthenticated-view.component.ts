import { Component, OnInit } from '@angular/core';
import { UnAuthenticatedViewService } from './unauthenticated-view.service';

@Component({
  selector: 'fio-unauthenticated-view',
  templateUrl: './unauthenticated-view.component.html',
  styleUrls: ['./unauthenticated-view.component.scss'],
  providers: [UnAuthenticatedViewService]
})
export class UnauthenticatedViewComponent implements OnInit {
  recentActiveUsers=[];
  registerForm:boolean;
  constructor(
    private auth:UnAuthenticatedViewService
  ){
    auth.getLastActiveUsers().then((snapshot)=>{
      snapshot.forEach((doc:any)=>{
        this.recentActiveUsers.unshift({
          uid: doc.id
        });
      })
    });
  }
  ngOnInit(){}
}
