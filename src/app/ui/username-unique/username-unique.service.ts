import { Injectable } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
// FIREBASE
import { AngularFirestore } from 'angularfire2/firestore';
// RXJS
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// Observable operators
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';

@Injectable()
export class UserNameUniqueService {
    currentUser = JSON.parse(localStorage.getItem('user'));
    url_path:string;
    usernameExists$:Subject<boolean> = new Subject();
    checking$: Subject<boolean> = new Subject();
    usernameUniqueForm = this.fb.group({
        displayName: new FormControl("", [
          Validators.required,
          Validators.minLength(4),
        ], this.isUserNameUnique.bind(this))
    });
    setUrlPath(path){
        this.url_path = path;
    }
    constructor(
        public fb: FormBuilder,
        private afs: AngularFirestore
    ){
        let displayName = this.usernameUniqueForm.get("displayName");
        let dnSr = displayName
            .valueChanges
            .debounceTime(250)
            .distinctUntilChanged()
            .map(res=>{
                if (res) {   
                    const query = res.replace(/[\s+/=*,@|\\]/g, '-');
                    displayName.setValue(query);
                    return query;
                }
            })
            .switchMap(query=>
                query
                ?this.getUserInfoWithURL(this.url_path, "username", query)
                :Observable.of([])
            );
        dnSr.subscribe(res=>{
            if (this.currentUser) {
                res==this.currentUser.uid
                ?this.usernameExists$.next(false)
                :this.usernameExists$.next(!!res)
            }else{
                this.usernameExists$.next(!!res)
            }
        });
    }

    getUserInfoWithURL(search_url, search_from, seach_value){
        return this.afs
            .collection(search_url, ref=>ref
                .where(search_from, "==", seach_value)
            )
            .valueChanges()
            .take(1)
            .map(res=>{
                return res[0];
            })
    }
    isUserNameUnique(control: FormControl) {
        if(control.value.length>=4){
            this.checking$.next(true);
            const q = new Promise((resolve, reject) => {
                this.usernameExists$.subscribe((res) => {
                    this.checking$.next(false);
                    res?resolve({ 'isUserNameUnique': true }):resolve(null);
                });
            });
            return q;
        }
    }
}