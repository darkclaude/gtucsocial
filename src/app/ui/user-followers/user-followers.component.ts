import { UserFollowersService } from './user-followers.service';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'fio-user-followers',
  templateUrl: './user-followers.component.html',
  styleUrls: ['./user-followers.component.scss'],
  providers: [UserFollowersService]
})
export class UserFollowersComponent implements OnChanges {
  @Input() uid:string;
  @Input() limit:number;
  @Input() url:string;
  @Input() onlyAvatar:boolean = false;
  followers = [];
  constructor(private srv:UserFollowersService) { }
  ngOnChanges() {
    if (this.uid) {
      this.followers = [];
      this.srv.getFollowers(this.uid, this.limit, this.url).then(snapshot=>{
        snapshot.forEach(doc=>{
          this.followers.push(doc.data());
        })
      });
    }
  }

}
