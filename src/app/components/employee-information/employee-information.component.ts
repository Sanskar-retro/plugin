// Core Modules
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs'
import * as moment from 'moment';
// Services
import { EmployeeService } from '../../services/employee.service';
// import { ClientService } from '../../services/client.service';
// import { CompanyService } from '../../services/company.service';
// import { LocationService } from '../../services/location.service';
import { LocalStorageService } from '../../services/local-storage.service';
//validators

import { dobCheck, ssnConfirmationCheck } from '../../Validators/validators'; 
import { StateService } from '../../services/state.service';
import { ValidateInput } from '../../classes/validateInput';

@Component({
  selector: 'app-employee-information',
  templateUrl: './employee-information.component.html',
  styleUrls: ['./employee-information.component.scss']
})
export class EmployeeInformationComponent extends ValidateInput implements OnInit, OnDestroy {

  states: any;
  employee: any
  employeeSubscription!: Subscription
  employeeForm!: FormGroup;
  suffixes: string[] = ['', 'Jr', 'Sr', 'II', 'III', 'IV'];
  currentUser: any;
  dobStartDate!: Date;
  dobEndDate!: Date;
  canValidateSSn: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private ToastrService: ToastrService,
    private employeeService: EmployeeService,
    private stateService: StateService,
    private localStorageService: LocalStorageService,
  ) {
    super();
  }

  ngOnInit(): void {
    // this.employeeService.Pluginsubmit$.subscribe(data=>{
    //   this.checkValidations()      
    // })
    
    this.stateService.states().subscribe(data=>{
      this.states = data;
    })

    this.currentUser = this.localStorageService.userInfo();
    this.dobStartDate = moment('1/1/1910', "DD-MM-YYYY").toDate();
    this.dobEndDate = moment().subtract(15, 'years').toDate();
    
    this.employeeSubscription = this.employeeService.employeeData.subscribe((data: any) => {
      this.employee = data
      this.empFormReset();
      if (this.employee?.reset) {
        this.employee = _.omit(this.employee, 'reset')
        this.employeeService.setEmployee(this.employee);
       
      }
    })
  }

  empFormReset() {
    this.canValidateSSn = !this.currentUser.ssn_enabled || this.employee?.data?.hide_ssn
    this.employeeForm = this.formBuilder.group({
      client: [_.get(this.employee, 'data.employee_info.client',''),Validators.required],
      company: [_.get(this.employee, 'data.employee_info.company',''), Validators.required],
      location: [_.get(this.employee, 'data.employee_info.location',''), Validators.required],
      id: [_.get(this.employee, 'data.employee_info.id', '')],
      first_name: [_.get(this.employee, 'data.employee_info.first_name', ''), [Validators.required, Validators.minLength(2)]],
      last_name: [_.get(this.employee, 'data.employee_info.last_name', ''), [Validators.required, Validators.minLength(2)]],
      suffix: [_.get(this.employee, 'data.employee_info.suffix', '')],
      address_line_1: [_.get(this.employee, 'data.employee_info.address_line_1', ''), [Validators.required, Validators.minLength(2)]],
      address_line_2: [_.get(this.employee, 'data.employee_info.address_line_2', '')],
      city: [_.get(this.employee, 'data.employee_info.city', ''), [Validators.required, Validators.minLength(2)]],
      state: [_.get(this.employee, 'data.employee_info.state', ''), Validators.required],
      zip: [_.get(this.employee, 'data.employee_info.zip', ''), [Validators.required, Validators.minLength(5)]],
      ssn: [_.get(this.employee, 'data.employee_info.ssn', ''), this.canValidateSSn ? '' : [Validators.required, Validators.maxLength(9)]],
      ssn_confirmation: [_.get(this.employee, 'data.employee_info.ssn_confirmation', ''), this.canValidateSSn ? '' : [Validators.required, Validators.maxLength(9)]],
      dob: [_.get(this.employee, 'data.employee_info.dob', ''), [Validators.required, dobCheck]],
      rehire: [_.get(this.employee, 'data.employee_info.rehire', true), Validators.required]
    }, { validators: ssnConfirmationCheck })

    this.employeeForm.valueChanges.subscribe(() => {
      this.employee.data.employee_info = this.employeeForm.value;
    })
  }

  rehire() {
    this.employee.data.employee_info.rehire = this.employeeForm.get('rehire')?.value;
    this.employeeService.setEmployee(this.employee)
  }

  selectedState() {
    _.set(this.employee,"data.employee_info.state" , this.employeeForm.get('state')?.value);
  }

  checkValidations() {
    if (this.employeeForm.valid && (this.canValidateSSn ? true : this.employeeForm.get('ssn')?.value.toString().length == 9)) {
      this.employee.data.employee_info.hasErrors = false;
      this.employee.data.employee_info = this.employeeForm.value;
      // this.employeeService.setEmployee(this.employee)
    } else {
      this.employee.data.employee_info.hasErrors = true;
      this.employee.focussedTab = 'employee_info'
      this.ToastrService.error("Please fix validation issues", "Employee Information");
    }
  }

  ngOnDestroy() {
    if (this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
  }
}
