import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {AuthService} from './auth.service';
import {Location} from "@angular/common";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthForwardGuard implements CanActivate {
  constructor(private authService: AuthService,
              private location: Location) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | UrlTree | Promise<boolean> | UrlTree | boolean | UrlTree {
    if (this.authService.getLoggedIn()) {
      this.location.back();
      return false;
    }
    return true;
  }

}
