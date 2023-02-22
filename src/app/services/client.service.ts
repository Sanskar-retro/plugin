import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient,
    private ToastrService: ToastrService
  ) { }

  clients(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/clients`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  client(clientId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/clients/${clientId}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  clientsKey(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/clients?key=`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  locations(clientId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/clients/${clientId}/locations`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

}
