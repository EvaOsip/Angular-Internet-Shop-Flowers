import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, Subject, tap, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessTokenKey: string = 'accessToken';
  refreshTokenKey: string = 'refreshToken';
  userIdKey: string = 'userId';
  private isLogged = false;
  public isLogged$: Subject<boolean> = new Subject<boolean>()

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  public getLoggedIn(): boolean {
    return this.isLogged;
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.apiHost + '/refresh', {
        refreshToken: tokens.refreshToken
      })
    }
   throw throwError(() => 'Can not use token');
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.apiHost + '/login', {
      email,
      password,
      rememberMe
    })
    // .pipe(
    //   tap((data: LoginResponseType) => {
    //     if (data.fullName && data.userId && data.accessToken && data.refreshToken) {
    //       this.setUserInfo({
    //         fullName: data.fullName,
    //         userId: data.userId
    //       });
    //       this.setTokens(data.accessToken, data.refreshToken)
    //     }
    //   })
    //)
  }


  signup (email: string, password: string, passwordRepeat: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.apiHost + '/signup', {
      email,
      password,
      passwordRepeat
    })
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.apiHost + '/logout', {
        refreshToken: tokens.refreshToken
      })
    }

    throw throwError(() => 'Can not find tokens');

  }


  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken)
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey)
    this.isLogged = false;
    this.isLogged$.next(false);
  }

   get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  // removeUserInfo(): void {
  //   localStorage.removeItem(this.userInfoKey)
  // }
  //
  // public setUserInfo(info: UserInfoType | null): void {
  //   localStorage.setItem(this.userInfoKey, JSON.stringify(info))
  // }
  //
  // public getUserInfo(): UserInfoType | null {
  //   const userInfo: string | null = localStorage.getItem(this.userInfoKey);
  //   if (userInfo) {
  //     return JSON.parse(userInfo)
  //   }
  //   return null
  // }


}
