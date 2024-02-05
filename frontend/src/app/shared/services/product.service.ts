import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {CategoryType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProductType} from "../../../types/product.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getBestProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.apiHost + 'products/best')
  }

  getProducts(params: ActiveParamsType): Observable<{totalCount: number, pages: number, items: ProductType[]}> {
    return this.http.get<{totalCount: number, pages: number, items: ProductType[]}>(environment.apiHost + 'products',{
      params: params
    })
  }

  getProduct(url: string): Observable<ProductType> {
    return this.http.get<ProductType>(environment.apiHost + 'products/' + url)
  }

  searchProduct(query: string): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.apiHost + 'products/search?query=' + query)
  }


}
