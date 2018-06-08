import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { UserNameUniqueService } from './username-unique.service';

@Component({
  selector: 'fio-username-unique-input',
  templateUrl: './username-unique.component.html',
  styleUrls: ['./username-unique.component.scss'],
  providers: [UserNameUniqueService]
})
export class UsernameUniqueComponent implements OnChanges{
  @Input() url_path:string = "users_uid";
  @Input() disabled:boolean;
  @Input() value:string;
  @Input() usernameReseted:boolean;
  @Output() userValue:EventEmitter<any> = new EventEmitter();
  searching: boolean;
  usernameUniqueForm = this.unqSrv.usernameUniqueForm;
  constructor(
    private unqSrv: UserNameUniqueService,
  ){
    this.usernameUniqueForm.statusChanges.subscribe((valid)=>{
      let displayname = this.usernameUniqueForm.get("displayName").value;
      const data = {valid, displayname}
      this.userValue.next(data);
    });
    unqSrv.setUrlPath(this.url_path);
    unqSrv.checking$.subscribe(res=>this.searching=res);
  }
  ngOnChanges(){
    if (this.usernameReseted) {
      this.usernameUniqueForm.reset();
    }
    if(this.value){
      this.usernameUniqueForm.get("displayName").setValue(this.value);
    }
  }
}