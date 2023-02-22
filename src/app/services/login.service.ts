// Core Modules
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
// Enviroment Variables
import { environment } from 'src/environments/environment';
// Models
import { ILogin, IOtp, IRestPassword } from './login.model';
// Services
import { LocalStorageService } from './local-storage.service'
// import { PluginInputobj } from '../../plugin.input';
import { EmployeeService } from './employee.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  empData!:any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private employeeService: EmployeeService
  ) { 
    this,employeeService.employeeData.subscribe(data=>{
      this.empData = data;
    })
  }

  login(login: ILogin | IOtp,isPlugin=false): Observable<any> {
    return this.http.post<any>(`${environment.apiDomain}/authentication`, login, { observe: 'response' }).pipe(
      map((response: any) => {
        if (response.status == 202) {
          this.router.navigateByUrl('/auth/otp', { state: { login: login, response: response.body } })
        } else {
          this.localStorageService.saveData('userInfo', JSON.stringify(response.body))
          return response.body
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if(isPlugin){
          _.set(this.empData,'isError',true)
          _.set(this.empData,'loading',false)
          this.employeeService.setEmployee(this.empData);
          this.router.navigateByUrl('/plugin')
        }
        this.toastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error("Plugin Error: " + error))
      })
    )
  }

  logout() {
    return this.http.delete<any>(`${environment.apiDomain}/authentication`).pipe(
      map((response: any) => {
        this.localStorageService.removeData('userInfo');
        this.localStorageService.removeData('authToken');
        this.localStorageService.removeData('staticEmployeeData');
        return response
      }),
      catchError((error: HttpErrorResponse) => {
        this.toastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  userDetails() {
    return this.http.get(`${environment.apiDomain}/authentication/user_details`).pipe(
      map((response: any) => {
        _.set(response, 'auto_login', true)
        this.localStorageService.saveData('userInfo', JSON.stringify(response))
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.toastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  forgotPassword(username: string) {
    return this.http.post<any>(`${environment.apiDomain}/users/forgot_password`, { username }).pipe(
      map((response: any) => {
        this.toastrService.success(_.join(response, ','), 'Success')
        this.router.navigateByUrl('/auth/login')
      }),
      catchError((error: HttpErrorResponse) => {
        this.toastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  forgotUsername(email: string) {
    return this.http.post<any>(`${environment.apiDomain}/users/forgot_username`, { email }).pipe(
      map((response: any) => {
        this.toastrService.success(_.join(response, ','), 'Success')
        this.router.navigateByUrl('/auth/login')
      }),
      catchError((error: HttpErrorResponse) => {
        this.toastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  resetPassword(resetPassword: IRestPassword) {
    return this.http.post(`${environment.apiDomain}/users/forgot_password`, resetPassword).pipe(
      map((response: any) => {
        this.toastrService.success(_.join(response, ','), 'Success')
      }),
      catchError((error: HttpErrorResponse) => {
        this.toastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  googleAuthUrl() {
    return this.http.get(`${environment.apiDomain}/authentication/oauth_login_url`).pipe(
      map((response: any) => {
        return response
      }),
      catchError((error: HttpErrorResponse) => {
        this.toastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }
}
