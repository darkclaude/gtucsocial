import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
// Services
import { UserRegisterFormService } from './user-register-form.service';
// RXJS
import { Subject } from 'rxjs/Subject';
// Observable operators
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
@Component({
  selector: 'fio-user-register-form',
  templateUrl: './user-register-form.component.html',
  styleUrls: ['./user-register-form.component.scss'],
  providers: [UserRegisterFormService]
})
export class UserRegisterFormComponent {
  error;
  @Input() url_path:string = "user_name";
  @Output() userValues = new EventEmitter();

  isPasswordMatchesCheck:Subject<any> = new Subject();

  registerForm = this.fb.group({
    // email validation
    email: new FormControl("", [
      Validators.email
    ]),
    // password validation
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
    // retyping password validation
    repassword: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ], this.isPasswordMatches.bind(this))
  });
  isPasswordMatches(control: FormControl){
    const q = new Promise((resolve, reject) => {
      this.isPasswordMatchesCheck.subscribe((res) => {
        res?resolve({ 'isPasswordMatches': true }):resolve(null);
      });
    });
    return q;
  }
  constructor(
    private route: Router,
    public fb: FormBuilder,
    private registerSrv: UserRegisterFormService
  ){
    registerSrv.createdNewUser$.subscribe((res)=>{
      this.userValues.emit(res);
      if (res) {
        this.registerForm.reset();
        this.usernameReseted = true;
        this.route.navigate([`/${res.username}/edit`])
      }
      setTimeout(()=>{ 
        this.usernameReseted = false;
      });
    });
    this.registerForm.get("password")
      .valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(()=>{
        this.registerForm.get("repassword").setValue("")
        this.isPasswordMatchesCheck.next(false);
      });
    this.registerForm.get("repassword")
      .valueChanges
      .distinctUntilChanged()
      .subscribe(password=>{
        if (password) {
          const isEqual = this.registerForm.get("password").value !== password
          this.isPasswordMatchesCheck.next(isEqual)
        }
      });
  }
  register(event){
    this.registerSrv.register(this.url_path, this.registerForm.value, this.username.displayname)
      .catch(reason=>this.error=reason);
  }
  username;
  usernameReseted:boolean=false;
  userValue(value){
    this.username = value;
  }
}
