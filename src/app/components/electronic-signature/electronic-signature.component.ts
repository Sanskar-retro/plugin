// Core Modules
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { UserRoles } from 'src/app/user.role';

// Classes
import { EBasicData } from '../../classes/employee-transform';

// Services
import { EmployeeService } from '../../services/employee.service';
import { LocalStorageService } from '../../services/local-storage.service';
// import { LoginService } from 'src/app/modules/auth/services/login.service';
// Components
import { SuccessPopUpComponent } from '../success-pop-up/success-pop-up.component';
import { UltimateSoftwatePopUpComponent } from '../ultimate-softwate-pop-up/ultimate-softwate-pop-up.component';

@Component({
  selector: 'app-electronic-signature',
  templateUrl: './electronic-signature.component.html',
  styleUrls: ['./electronic-signature.component.scss']
})
export class ElectronicSignatureComponent {

  employeeSubscription!: Subscription
  employee: any
  eSignForm!: FormGroup;
  empRedirected!: boolean;
  // empId!: string;
  loading!: boolean;
  authorizationError!: boolean;
  currentUser!: any
  PluginFormError = false
  // @Input() isPlugin = false;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private ToastrService: ToastrService,
    private localStorageService: LocalStorageService,
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    
    this.currentUser = this.localStorageService.userInfo();

    this.employeeSubscription = this.employeeService.employeeData.subscribe((data: any) => {
      this.employee = data
      if (this.employee?.reset) {
        this.employee = _.omit(this.employee, 'reset')
        this.eSignForm.reset();
      }
    })

    this.eSignForm = this.formBuilder.group({
      eSignature: [_.get(this.employee, 'data.e_signatures.hm_signature.esign', '' || _.get(this.employee, 'data.employee_info.id')), Validators.required],
    });
    if (_.get(this.employee, 'data.employee_info.id'))
      _.set(this.employee, 'data.e_signatures.hm_signature.esign', true);
    !this.empRedirected ? this.eSignForm.valueChanges.subscribe(() => {
      _.set(this.employee, 'data.e_signatures.hm_signature.esign', this.eSignForm.get('eSignature')?.value);
    }) : '';

    // this.employeeService.Pluginsubmit$.subscribe((data: any) => {
    //   this.employee.data.e_signatures.hm_signature = {
    //     authorization: this.eSignForm.get('eSignature')?.value,
    //     esign: this.eSignForm.get('eSignature')?.value,
    //     name: this.currentUser?.username,
    //     title: this.currentUser?.username
    //   }
    //   this.checkValidations();
    // })
  }

  checkValidations() {
    if (this.eSignForm.get('eSignature')?.value) {
      if (this.empRedirected) {
        this.authorizationError = false;
      } else {
        this.employee.data.e_signatures.hm_signature = {
          authorization: this.eSignForm.get('eSignature')?.value,
          esign: this.eSignForm.get('eSignature')?.value,
          name: this.currentUser?.username,
          title: this.currentUser?.username
        }
        this.employee.data.e_signatures.hm_signature.hasErrors = false;
        this.employee.focussedTab = "preview_information";
        // this.employeeService.setEmployee(this.employee)
      }
    } else {
      this.empRedirected ? this.authorizationError = true : _.set(this.employee, 'data.e_signatures.hm_signature.hasErrors', true);
      this.ToastrService.error("Please fix validation issues", "Employee Information");
    }
  }

  openSuccessMessage(): void {
    const dialogRe = this.dialog.open(SuccessPopUpComponent, {
      data: { title: 'Employee Information', message: 'You have successfully submitted your tax credit screening application. We do not require any other information from you. You may leave this page. Thank you!' }
    });
    dialogRe.afterClosed().subscribe((result: any) => {
      if (result) {
        let data = EBasicData.employeeData();
        this.employeeService.resetEmployeeData(data);
        this.logout()
      }
    });
  }

  ultimateConfirmationCheck(): void {
    const dialogRe = this.dialog.open(UltimateSoftwatePopUpComponent, {
      width: '45%',
      data: { title: 'Confirmation', message: this.currentUser.client_help_text ? this.currentUser.client_help_text : 'Thank you for completing the WOTC Questionnaire. Please copy the following ID number and paste this into your onboarding website to finish the WOTC process' }
    });
    dialogRe.afterClosed().subscribe((result: any) => {
      if (result) {
        let data = EBasicData.employeeData();
        this.employeeService.resetEmployeeData(data);
        this.logout()
      }
    });
  }

  logout(url: string = '/') {
    if (this.currentUser?.auto_logout && this.currentUser?.role === UserRoles.Employee) {
      this.loginService.logout().subscribe((result: any) => {
        this.router.navigate([url]);
      })
    } else {
      this.router.navigate([`/emp/employees/new`]);
    }
  }

}
