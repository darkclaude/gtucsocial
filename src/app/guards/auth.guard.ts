import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthGuard implements CanActivate {
    authenticated:boolean=false;
    constructor(
        private auth:AuthService,
        private router: Router
    ){
        auth.authenticated$.subscribe((authenticated:any)=>{
            if (authenticated){
                this.authenticated = true;
            }else{
                this.authenticated = false;
            }
        });
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticated) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/']);
        return false;
    }
}