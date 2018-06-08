import { UserInfoService } from './user-info.service';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'fio-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  providers: [UserInfoService]
})
export class UserInfoComponent implements OnChanges {
  @Input() uid:string;
  @Input() noFollow:boolean;
  @Input() onlyAvatar:boolean;
  @Input() styleTwo:boolean;
  doc;
  constructor(private userInfoService:UserInfoService){}

  ngOnChanges(){
    if (this.uid) {
      this.userInfoService.getUserInfo(this.uid).then(doc=>{
        if (doc.exists) { 
          this.doc = doc.data();
        }
      });
    }
  }

}
