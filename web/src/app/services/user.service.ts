import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map as rxMap } from 'rxjs/operators';

import { IActivateUserRequest } from '../models/users/IActivateUserRequest';
import { IUser } from '../models/users/IUser';

import { AuthService } from './auth.service';
import { ITokenRequest } from '../models/common/ITokenRequest';
import { SnackbarService } from './snackbar.service';
import { BaseService } from './base.service';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private snackBar: SnackbarService,
    private spinner: SpinnerService
  ) { 
    super();
  }

  RegisterUser(request: IUser) {
    this.spinner.show();
    this.http.post<{message: string, user: any}>(`${this.api_base_url}/users/register`, request)
        .pipe(
          rxMap((data) => {
            return <IUser> {
              ...data.user,
              id: data.user._id
            }
          })
        )
        .subscribe(res => {
          this.snackBar.show('Check your email for activation email');
          this.spinner.hide();
          this.router.navigate(["/login"]);
        }, error => {
          console.error('Failed to add user');
          this.spinner.hide();
        });
  }

  AuthenticateUser(request: IUser) {
    this.spinner.show();
    this.http.post<{message: string, token: string, user: any}>(`${this.api_base_url}/users/authenticate`, request)
        .subscribe(res => {
          const authenticatedUser = <IUser> {
            ...res.user,
            token: res.token
          }
          this.authService.user = authenticatedUser;
          this.router.navigate(["/post"]);
          this.spinner.hide();
        }, error => {
          // console.log(error);
          // console.error('Failed to authenticate');
          this.snackBar.show(error, 'Dismiss');
          this.spinner.hide();
        });
  }

  VerifyActivationToken(request: ITokenRequest) {
    return this.http.post<{message: string, result: boolean}>(`${this.api_base_url}/users/verifyactivationtoken`, request);
  }

  ActivateUser(request: IActivateUserRequest) {
    return this.http.post<{message: string, result: boolean}>(`${this.api_base_url}/users/activate`, request);
  }
}
