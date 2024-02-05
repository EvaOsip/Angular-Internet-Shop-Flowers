import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {OrderType} from "../../../types/order.type";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(params: OrderType): Observable<OrderType | DefaultResponseType> {
    return this.http.post<OrderType | DefaultResponseType>(environment.apiHost + 'orders', params,
    {withCredentials: true})
  }

  getOrders(): Observable<OrderType[] | DefaultResponseType> {
    return this.http.get<OrderType[] | DefaultResponseType>(environment.apiHost + 'orders')
  }


}
