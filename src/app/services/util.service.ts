import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  cclData: any = {
    client: {}, company: {}, location: {}, state: {}
  }

  cclEnabled = new BehaviorSubject(false)
  selectedCCL = new BehaviorSubject(_.cloneDeep(this.cclData))

  constructor(
    private http: HttpClient,
    private ToastrService: ToastrService
  ) { }

  setCCL(ccl: any) {
    this.selectedCCL.next(ccl);
  }

  resetCCL() {
    this.selectedCCL.next({
      client: {}, company: {}, location: {}, state: {}
    })
  }

  enableCCL(enabled: boolean) {
    if (this.cclEnabled.getValue() != enabled) {
      this.cclEnabled.next(enabled);
    }
  }

  occupations(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/occupations`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  branches(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/branches`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  processorStats(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/processor_stats`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  processingAlerts(queryParams: HttpParams): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/processing_alerts`, { params: queryParams }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  geoQualify(queryString: string, showToastr?: boolean): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/employees/geo_qualify?${queryString}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        // this.ToastrService.error(_.join(error.error, ','), 'Error')
        showToastr ? this.ToastrService.error('Google cannot find this address - verify the address is correct', 'Address is Not Geo Qualified') : ''
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  targetGroups(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/target_groups`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  applicationStatuses(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/application_statuses`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  zoneStatuses(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/zone_statuses`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  supplementalStatuses(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/supplementary_program_statuses`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  users(): Observable<any> {
    return this.http.get<any>(`${environment.apiDomain}/users`).pipe(
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
