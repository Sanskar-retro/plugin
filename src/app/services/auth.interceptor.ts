// Core Modules
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpInterceptor
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Enviroment variables
import { environment } from 'src/environments/environment';
// Services
import { LocalStorageService } from './local-storage.service'
// import { PluginInputobj } from '../modules/plugin.input';
import { EmployeeService } from './employee.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  empData!:any;
  
  constructor(
    private LocalStorageService: LocalStorageService,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeService.employeeData.subscribe(data => {
      this.empData = data;
    })
   }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = request.clone({
      headers: new HttpHeaders({
        'X-API-KEY': environment.apiKey,
        'X-AUTH-TOKEN': this.LocalStorageService.authToken(),
        'content-type': 'application/json'
      })
    });

    return next.handle(request).pipe(
      catchError((err: any): Observable<any> => {
        if (err.status == 401) {
          this.LocalStorageService.removeData('userInfo');
          
          if(!_.get(this.empData,'isError',false)){
            this.router.navigateByUrl('/auth/login', { state: { error: err.error } });
          }
        }
        throw err
      })
    );
  }
}
