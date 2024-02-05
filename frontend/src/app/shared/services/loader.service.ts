import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {CartType} from "../../../types/cart.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isShowed$ = new Subject<boolean>();

  constructor() {
  }

  show() {
    this.isShowed$.next(true);
  }

  hide() {
    this.isShowed$.next(false);
  }


}
