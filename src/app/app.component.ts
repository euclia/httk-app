import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription,Observable } from 'rxjs';
import { element } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'httk-app';
  loggedIn:boolean = false;
  subscription:Subscription;
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;
  isAuthenticated$: Observable<boolean>;

  

  constructor(public oidcSecurityService: OidcSecurityService){
  }
  ngOnInit( ) {

    this.isAuthorizedSubscription = this.oidcSecurityService.isAuthenticated$.subscribe(
      (isAuthorized: boolean) => {
        if(isAuthorized === true){
          this.loggedIn = true;
        }else{
          this.loggedIn = false;
        }
      });
      this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
      this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));

  }
  login(){
    this.oidcSecurityService.authorize();
  }
  logout() {
    this.oidcSecurityService.logoff();
}
}