import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private http: HttpClient,
    private ToastrService: ToastrService
  ) { }

  locations(companyId: number): Observable<any>{
    return this.http.get<any>(`${environment.apiDomain}/companies/${companyId}/locations`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  location(companyId: number, locationId: number): Observable<any>{
    return this.http.get<any>(`${environment.apiDomain}/${companyId}/locations/${locationId}`).pipe(
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
