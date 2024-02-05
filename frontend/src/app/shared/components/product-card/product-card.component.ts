import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FavoriteService} from "../../services/favorite.service";
import {Router} from "@angular/router";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductType;
  @Input() isNotFullVersion: boolean = false;
  @Input() countInCart: number | undefined = 0;
  count: number = 1;
  serverStaticPath = environment.serverStaticPath

  constructor(private cartService: CartService,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.countInCart = this.count;
      })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }
          this.countInCart = this.count;
        })
    }
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.countInCart = 0;
        this.count = 1;
      })
  }

  updateFavorite() {
    if (!this.authService.getLoggedIn()) {
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться')
      return;
    }
    if (this.product.isInFavorite) {
      this.favoriteService.deleteFavorite(this.product.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            //???
            this._snackBar.open(data.message);
            throw new Error(data.message);
          }

          this.product.isInFavorite = false;
        })
    } else {
      this.favoriteService.addFavorite(this.product.id)
        .subscribe((data: FavoriteType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }
          this.product.isInFavorite = true;
        })
    }

  }

  navigate() {
    if (this.isNotFullVersion) {
      this.router.navigate(['/product/' + this.product.url])
    }
  }
}

