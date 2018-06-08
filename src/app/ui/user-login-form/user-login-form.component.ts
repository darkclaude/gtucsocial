import { UserLoginFormService } from './user-login-form.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'fio-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
  providers: [UserLoginFormService]
})
export class UserLoginFormComponent {
  email:string;
  password:string;
  @Input() error;
  constructor(
    private signService:UserLoginFormService,
  ){
    signService.userLoginError$.subscribe(error=>this.error=error);
  }
  signInWithUsernameOrEmail(){
    this.signService.signInWithUsernameOrEmail(this.email,this.password);
  }
  socialLogin(providerType){
    this.signService.socialLogin(providerType);
  }
}
