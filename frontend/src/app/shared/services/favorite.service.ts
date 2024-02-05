import {Injectable} from '@angular/core';
import {ActiveParamsType} from "../../../types/active-params.type";
import {Observable} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FavoriteType} from "../../../types/favorite.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) {
  }

  getFavorites(): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.apiHost + 'favorites')
  }


  deleteFavorite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.apiHost + 'favorites',
    {body: {productId}}
    )
  }

  addFavorite(productId: string): Observable<DefaultResponseType | FavoriteType> {
    return this.http.post<DefaultResponseType | FavoriteType>(environment.apiHost + 'favorites', {
      productId
      }
    )
  }
}
