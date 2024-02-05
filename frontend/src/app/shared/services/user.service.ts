import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {OrderType} from "../../../types/order.type";
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  updateUserInfo(params: UserInfoType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.apiHost + 'user', params);
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.apiHost + 'user');
  }
}
