import { AuthService } from './../../services/auth.service';
import { UserAvatarChangeComponent } from './../../modals/user-avatar-change/user-avatar-change.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from './../../services/main.service';
import { PROFILE_EDIT } from './user-profile-edit';
import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'fio-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit {
  @Input() uid;
  userUID;
  profileEdit:PROFILE_EDIT = new PROFILE_EDIT();
  
  constructor(
    private modalService: NgbModal,
    private mainService: MainService,
    private auth: AuthService
  ){
    let user = JSON.parse(localStorage.getItem('user'));
    user?this.userUID = user.uid:'';
    auth.getUserInfo(user.uid).subscribe((res:any)=>{
      if (res) {    
        this.profileEdit=res;
      }
    });
  }

  ngOnInit() {}

  updateProfile(){
    this.auth.updateUserInfo(this.userUID, this.profileEdit);
  }
  privateMessageSecure(value){
    this.profileEdit.privateMessageSecure = value; 
    this.updateProfile();
  }
  reSendVerificationEmailMsg:string;
  reSendVerificationEmail(){
    this.auth.reSendVerificationEmail().then(()=>{
      this.reSendVerificationEmailMsg = "Verification has been sent to your email. Please check your email.";
      setTimeout(()=>{
        this.reSendVerificationEmailMsg = "";
      }, 3000);
    }).catch(error=>this.reSendVerificationEmailMsg = error);
  }
  changeAvatar(){
    const modalRef = this.modalService.open(UserAvatarChangeComponent);
    modalRef.componentInstance.name = 'World';
  }
}
