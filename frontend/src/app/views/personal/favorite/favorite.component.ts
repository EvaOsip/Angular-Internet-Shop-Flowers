import {Component, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  products: FavoriteType[] = [];
  favorite: ProductType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private _snackBar: MatSnackBar,) {
  }

  ngOnInit() {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.products = data as FavoriteType[];
      })
  }

  removeFromFavorites(id: string) {
    this.favoriteService.deleteFavorite(id)
      .subscribe((data: DefaultResponseType) => {

        console.log(data)
        if (data.error) {
          //???
          this._snackBar.open(data.message);
          throw new Error(data.message);
        }

        this.products = this.products.filter(item => item.id !== id);
      })
  }

}
