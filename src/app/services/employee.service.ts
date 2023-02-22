//Core Modules
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, throwError, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  Pluginsubmit$ = new Subject<boolean>();

  employeeData = new BehaviorSubject({ data: {}, recordsFound: true });

  constructor(
    private http: HttpClient,
    private router: Router,
    private ToastrService: ToastrService
  ) { }

  employees(data: any, role: String) {
    let applicantProId = localStorage.getItem('applicantProId')
    if (applicantProId) {
      data = _.set(data, 'applicantpro_id', applicantProId)
    }
    return this.http.post<any>(`${environment.apiDomain}/employees`, data, { observe: 'response' }).pipe(
      map((response: any) => {
        localStorage.removeItem('applicantProId');
        if (data.employee_info.is_applicant) {
          role === 'hiring_manager' ? this.ToastrService.success('Applicant Successfully Saved.', 'Applicant Information',) : '';
        } else if (role === 'processor') {
          const url = `${environment.apiDomain}/employees/${response.body.employee_info.id}`;
          this.ToastrService.success(`<a href="${url}" target="_blank">${url}</a>`, 'Successfully save employee', {
            enableHtml: true
          })
        } else {
          this.ToastrService.success('Employee Successfully Saved.', 'Employee Information',)
        }
        return response.body
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  update(id: number, data: any, message: string) {
    return this.http.put<any>(`${environment.apiDomain}/employees/${id}`, data, { observe: 'response' }).pipe(
      map((response: any) => {
        this.ToastrService.success(message, 'Employee Information',)
        return response.body
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  listEmployee(queryParams: HttpParams) {
    return this.http.get<any>(`${environment.apiDomain}/employees`, { params: queryParams }).pipe(
      map((response: any) => {
        return response
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  employeeDetails(empId: string) {
    return this.http.get<any>(`${environment.apiDomain}/employees/${empId}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  download(limit: number, get_count: boolean = false) {
    return this.http.get<any>(`${environment.apiDomain}/employees/download?get_count=${get_count}&limit=${limit}`).pipe(
      map((response: any) => {
        if (!get_count) {
          this.ToastrService.success(_.first(response), 'Employees Download')
        }
        return response
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  submitEsign(id: string, data: any) {
    return this.http.put<any>(`${environment.apiDomain}/employees/${id}/esign`, data, { observe: 'response' }).pipe(
      map((response: any) => {
        return response.body
      }),
      catchError((error: HttpErrorResponse) => {
        this.ToastrService.error(_.join(error.error, ','), 'Error')
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  ats(key: any) {
    return this.http.get<any>(`${environment.apiDomain}/employees/pre_qualified?key=${key}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(_.join(error.error, ',')))
      })
    )
  }

  setEmployee(employee: any) {
    this.employeeData.next(employee)
  }

  resetEmployeeData(EData: any) {
    let data: any = { ...EData, reset: true }
    this.employeeData.next(data)
  }
}
