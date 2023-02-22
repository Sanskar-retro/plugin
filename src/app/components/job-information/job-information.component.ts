import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
// Classes
import { ValidateInput } from '../../classes/validateInput';
import { dohCheck, dojoCheck, dswCheck, validDateCheck } from '../../Validators/validators';
// Services
import { EmployeeService } from '../../services/employee.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { UtilService } from '../../services/util.service';
@Component({
  selector: 'app-job-information',
  templateUrl: './job-information.component.html',
  styleUrls: ['./job-information.component.scss']
})
export class JobInformationComponent extends ValidateInput implements OnInit, OnDestroy {
  occupations: any;
  @Input() showActionButton: boolean = true;
  @Input() role!: string;
  @Input() title!: string;
  @Output() nextStep = new EventEmitter();
  // @Input() PluginJobInfo: any;

  currentUser: any
  employee: any
  userInfo: any
  submitting: boolean = false;
  employeeSubscription!: Subscription
  jobInformationForm!: FormGroup;
  showValidations: boolean = false;
  missingHmInfo: boolean = true;
  occupation_id!: number
  dateStartedWork!: Date;
  today!: Date;
  style = {};
  PluginFormError = false;
  constructor(
    private formBuilder: FormBuilder,
    private ToastrService: ToastrService,
    private employeeService: EmployeeService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilService
  ) {
    super();
  }

  ngOnInit(): void {

    this.utilsService.occupations().subscribe(data => {
      this.occupations = data;
    })
    
    this.today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))
    this.employeeSubscription = this.employeeService.employeeData.subscribe((data: any) => {
      this.employee = data
      this.jobInformationReset();

      this.showActionButton = !this.employee?.recordsFound
      this.missingHmInfo = !this.employee?.data?.application_status?.has_hm_info
      this.dateStartedWork = _.get(this.employee, 'data.employee_info.dateStartedWork', '')
      this.occupation_id = this.role === 'processor' ? _.get(this.employee, 'data.employee_info.location.default_position.code') : (_.get(this.employee, 'data.hiring_manager_info.occupation_id', '')?.code || _.get(this.employee, 'data.hiring_manager_info.occupation_id', ''))

    })

      this.currentUser = this.localStorageService.userInfo();
    

    // this.employeeService.Pluginsubmit$.subscribe((data: any) => {
    //   this.checkValidations()
    // })
  }

  jobInformationReset() {
    let rpDefaultdate
    if (_.get(this.employee, 'data.employee_info.client.id') === 117 && this.dateStartedWork) {
      rpDefaultdate = new Date(this.dateStartedWork)
    }
    let disableForm = this.employee.data?.application_status?.has_hm_info || this.employee.data?.application_status?.code
    this.jobInformationForm = this.formBuilder.group({
      occupation_id: [{ value: _.find(this.occupations, { code: this.occupation_id }), disabled: disableForm }, Validators.required],
      starting_wage: [{ value: this.role === 'processor' ? _.get(this.employee, 'data.employee_info.location.default_wage') : _.get(this.employee, 'data.hiring_manager_info.starting_wage', ''), disabled: disableForm }, Validators.required],
      dgi: [{ value: _.get(this.employee, 'data.hiring_manager_info.dgi', !!this.employee.data?.application_status ? '' : (this.role === 'processor' ? rpDefaultdate : this.today)), disabled: disableForm }, [Validators.required, validDateCheck]],
      dojo: [{ value: _.get(this.employee, 'data.hiring_manager_info.dojo', !!this.employee.data?.application_status ? '' : (this.role === 'processor' ? rpDefaultdate : this.today)), disabled: disableForm }, [Validators.required, validDateCheck]],
      doh: [{ value: _.get(this.employee, 'data.hiring_manager_info.doh', !!this.employee.data?.application_status ? '' : (this.role === 'processor' ? rpDefaultdate : this.today)), disabled: disableForm }, [Validators.required, validDateCheck]],
      dsw: [{ value: this.role === 'processor' ? _.get(this.employee, 'data.employee_info.dateStartedWork') : _.get(this.employee, 'data.hiring_manager_info.dsw', !!this.employee.data?.application_status ? '' : this.today), disabled: disableForm }, [Validators.required, validDateCheck]]
    }, { validators: [dswCheck, dojoCheck, dohCheck] });
    this.employee.data.hiring_manager_info = { ...this.jobInformationForm.value, ...this.employee.data.hiring_manager_info }
    this.jobInformationForm.valueChanges.subscribe(() => {
      _.set(this.employee, 'data.hiring_manager_info.dgi', this.jobInformationForm.controls['dgi'].value);
      _.set(this.employee, 'data.hiring_manager_info.dojo', this.jobInformationForm.controls['dojo'].value);
      _.set(this.employee, 'data.hiring_manager_info.doh', this.jobInformationForm.controls['doh'].value);
      _.set(this.employee, 'data.hiring_manager_info.dsw', this.jobInformationForm.controls['dsw'].value);
      _.set(this.employee, 'data.hiring_manager_info.starting_wage', this.jobInformationForm.controls['starting_wage'].value);
      _.set(this.employee, 'data.hiring_manager_info.occupation_id', this.jobInformationForm.controls['occupation_id'].value);
    })
  }

  back() {
    if (!this.showActionButton) {
      return this.nextStep.emit('Preview')
    }
    this.employee.focussedTab = _.get(this.employee, 'data.employee_info.rehire') === true ? 'employee_info' : 'questionnaire'
    this.employeeService.setEmployee(this.employee)
  }

  next() {
    let step = this.employee?.data?.application_status?.code === 'SS' ? 'Documents' : 'Status'
    this.nextStep.emit('Documents')
  }

  saveAsDraft(event: any) {
    if (event.checked) {
      _.set(this.employee, 'persistent', true);
    } else {
      _.set(this.employee, 'persistent', false);
      if (_.get(this.employee, 'data.employee_info.location.location_name') === 'Unknown') {
        _.set(this.employee, 'data.employee_info.location', {});
      }
    }
  }

  checkValidations() {
    let hm_name = _.get(this.employee, 'data.hiring_manager_info.hm_name','');
    let hm_title = _.get(this.employee, 'data.hiring_manager_info.hm_title','');

    this.employee.data.hiring_manager_info = this.jobInformationForm.value;
    _.set(this.employee, 'data.hiring_manager_info.hm_name', hm_name);
    _.set(this.employee, 'data.hiring_manager_info.hm_title', hm_title);

    if (this.jobInformationForm.valid || this.employee?.persistent) {
      _.set(this.employee, "data.hiring_manager_info.hasErrors", false);
      this.employee.focussedTab = this.role === 'processor' ? "documents" : "preview_information";
      // this.employeeService.setEmployee(this.employee)

      if (_.isBoolean(this.employee?.data?.application_status?.has_hm_info)) {
        this.employee.data.hiring_manager_info = {
          'starting_wage': _.get(this.employee.data, "hiring_manager_info.starting_wage"),
          'occupation_id': _.get(this.employee, "data.hiring_manager_info.occupation_id.code"), // may be causing problems --may be not necessary
          'dgi': moment(this.employee.data.hiring_manager_info.dgi).format('YYYY-MM-DD'),
          'doh': moment(this.employee.data.hiring_manager_info.doh).format('YYYY-MM-DD'),
          'dojo': moment(this.employee.data.hiring_manager_info.dojo).format('YYYY-MM-DD'),
          'dsw': moment(this.employee.data.hiring_manager_info.dsw).format('YYYY-MM-DD'),
        }
        this.submitting = true;
        let message = 'Successfully Saved Employee Hiring Information.'
        this.employeeService.update(this.employee.data.employee_info.id, this.employee.data, message).subscribe((response: any) => {
          _.set(this.employee, "data", response)
          _.set(this.employee, "data.refresh", true)
          this.employeeService.setEmployee(this.employee)
        })
      }
    } else {
      _.set(this.employee, "data.hiring_manager_info.hasErrors", true);
      _.set(this.employee, "focussedTab", 'hiring_manager_info');
      this.employeeService.setEmployee(this.employee)
      this.ToastrService.error("Please fix validation issues", "Job Information")
    }
  }

  ngOnDestroy() {
    if (this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
  }
}
