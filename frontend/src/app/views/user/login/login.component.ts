import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }


  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password ) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message
            }

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации'
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            if (loginResponse.accessToken && loginResponse.refreshToken && loginResponse.userId) {
              this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
              this.authService.userId = loginResponse.userId;
              this._snackBar.open('Вы успешно авторизовались');
              this.router.navigate(['/']);
            }

          },
          error: (error: HttpErrorResponse) => {
            if (error.error && error.error.message) {
              this._snackBar.open(error.error.message)
            } else {
              this._snackBar.open('Ошибка при авторизации')
            }
          }
        })
    }
  }


}
