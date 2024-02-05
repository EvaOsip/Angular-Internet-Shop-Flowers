import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  @Input() categories: CategoryWithTypeType[] = [];
  count: number = 0;
  products: ProductType[] = [];
  serverStaticPath = environment.serverStaticPath;
  showedSearch: boolean = false;
  searchField = new FormControl;


  constructor(private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private cartService: CartService,
              private productService: ProductService) {
    this.isLogged = this.authService.getLoggedIn()
  }

  ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProduct(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showedSearch = true;
            })
        } else {
          this.products = [];
        }
      })

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        this.count = (data as { count: number }).count;
      })

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout()
        },
        error: (error: HttpErrorResponse) => {
          this.doLogout()
          //протестить если закончится рефреш
          if (error.error && error.error.message) {
            console.log(error.error.message)
          }
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  // changedSearchValue(newValue: string) {
  //   this.searchValue = newValue;
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProduct(this.searchValue)
  //       .subscribe((data: ProductType[]) => {
  //         this.products = data;
  //       })
  //   } else {
  //     this.products = [];
  //     this.showedSearch = true;
  //   }
  // }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue('');
    this.products = [];
  }

  // changeShowedSearch(value: boolean) {
  //   setTimeout(() => {
  //     this.showedSearch = value;
  //   }, 100)
  // }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }

}
