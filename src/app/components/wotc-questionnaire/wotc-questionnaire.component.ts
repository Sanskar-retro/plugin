// Core Modules
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs'
// Services
import { EmployeeService } from '../../services/employee.service';
import { StateService } from '../../services/state.service';
import { LocalStorageService } from '../../services/local-storage.service';
import * as moment from 'moment';
// Validators
import {
  compensationStartCheck,
  compensationStopCheck,
  compensationToCheck,
  releaseDateCheck,
  serviceDateCheck,
  serviceDateStopCheck,
  unemploymentStopCheck,
  validDateCheck,
  unemploymentToCheck
} from '../../Validators/validators';
import { ValidateInput } from '../../classes/validateInput';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-wotc-questionnaire',
  templateUrl: './wotc-questionnaire.component.html',
  styleUrls: ['./wotc-questionnaire.component.scss']
})
export class WotcQuestionnaireComponent extends ValidateInput implements OnInit, OnDestroy {
  currentUser: any
  employee: any;
  employeeSubscription!: Subscription;
  questionnaireForm!: FormGroup;
  tanfForm!: FormGroup;
  snapForm!: FormGroup;
  voacationalRehabilitationForm!: FormGroup;
  militaryVeteranDetailsForm!: FormGroup;
  unemploymentDetailsForm!: FormGroup;
  felonyDetailsForm!: FormGroup;
  showValidations: boolean = false;
  employee_dob!: Date;
  employee_dsw!: Date;
  showDefaultCompensation!: boolean;
  useAsUnemployment!: boolean;
  defaultCompensationDateValue: boolean = false;
  defaultUnemploymentDateValue: boolean = false;
  counties: any;
  afdcCounties: any;
  foodStampsCounties: any;
  vocCounties: any;
  felonyCounties: any;
  recipient_name!: string;
  tanf_invalid!: boolean;
  snap_invalid!: boolean;
  voc_rehab_invalid!: boolean;
  veteran_Invalid!: boolean;
  unemployment_invalid!: boolean;
  felony_invalid!: boolean;
  today!: Date;
  style = {};
  PluginFormError = false;
  @Input() role!: String;
  @Input() states: any;
  @Input() branches: any;
  @Input() isApplicant!: boolean;
  @Input() sub_role!: String;
  
  constructor(
    private formBuilder: FormBuilder,
    private ToastrService: ToastrService,
    private employeeService: EmployeeService,
    private stateService: StateService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService
  ) { super(); }

  ngOnInit(): void {
  

      this.stateService.states().subscribe(data=>{
        this.states = data;
      })

      this.utilService.branches().subscribe(data=>{
        this.branches = data;
      });
        
      
      this.today = moment().toDate();
      this.employeeSubscription = this.employeeService.employeeData.subscribe((data: any) => {
        this.employee = data;
        this.wotcForms();
        this.recipient_name = _.filter([this.employee.data.employee_info.first_name, this.employee.data.employee_info.last_name], undefined).join(" ");
        this.employee_dob = _.get(this.employee, 'data.employee_info.dob');
        this.employee_dsw = _.get(this.employee, 'data.employee_info.dateStartedWork');
        let state = _.get(this.employee, 'data.employee_info.state')
        if (_.isUndefined(this.counties) && !!state?.code) {
          this.stateService.counties(state.code).subscribe((counties: any) => {
            this.counties = counties;
            this.afdcCounties = counties;
            this.foodStampsCounties = counties;
            this.vocCounties = counties;
            this.felonyCounties = counties;
          })
        }
        if (this.employee?.reset) {
          this.showDefaultCompensation = false;
          this.useAsUnemployment = false;
        }
        
      })
 
  
      this.currentUser = this.localStorageService.userInfo();
      
      // this.employeeService.Pluginsubmit$.subscribe((data: any) => {
      //   this.checkValidations();
      // })
  }

  wotcForms() {
    this.questionnaireForm = this.formBuilder.group({
      afdc: [_.get(this.employee, 'data.questionnaire.afdc', this.role === 'processor' ? false : ''), Validators.required],
      food_stamps: [_.get(this.employee, 'data.questionnaire.food_stamps', this.role === 'processor' ? false : ''), Validators.required],
      ssi: [_.get(this.employee, 'data.questionnaire.ssi', this.role === 'processor' ? false : ''), Validators.required],
      voc_rehab: [_.get(this.employee, 'data.questionnaire.voc_rehab', this.role === 'processor' ? false : ''), Validators.required],
      veteran: [_.get(this.employee, 'data.questionnaire.veteran', this.role === 'processor' ? false : ''), Validators.required],
      unemployed: [_.get(this.employee, 'data.questionnaire.unemployed', this.role === 'processor' ? false : ''), Validators.required],
      felon: [_.get(this.employee, 'data.questionnaire.felon', this.role === 'processor' ? false : ''), Validators.required],
      cdib: [_.get(this.employee, 'data.questionnaire.cdib', this.role === 'processor' ? false : ''), Validators.required],
      conditional_cert: [_.get(this.employee, 'data.questionnaire.conditional_cert', this.role === 'processor' ? false : ''), Validators.required],
      ca_foster: [_.get(this.employee, 'data.questionnaire.ca_foster', this.role === 'processor' ? false : ''),  this.employee.data.employee_info.state?.code === 'CA' ? Validators.required : ''],
      ca_cal_works: [_.get(this.employee, 'data.questionnaire.ca_cal_works', this.role === 'processor' ? false : ''), this.employee.data.employee_info.state?.code === 'CA' ? Validators.required : ''],
      ca_wia: [_.get(this.employee, 'data.questionnaire.ca_wia', this.role === 'processor' ? false : ''), this.employee.data.employee_info.state?.code === 'CA' ? Validators.required : ''],
      ca_farmer: [_.get(this.employee, 'data.questionnaire.ca_farmer', this.role === 'processor' ? false : ''), this.employee.data.employee_info.state?.code === 'CA' ? Validators.required : ''],
      ca_misdemeanor: [_.get(this.employee, 'data.questionnaire.ca_misdemeanor', this.role === 'processor' ? false : ''), this.employee.data.employee_info.state?.code === 'CA' ? Validators.required : ''],
      sc_fib: [_.get(this.employee, 'data.questionnaire.sc_fib', this.role === 'processor' ? false : ''), this.employee.data.employee_info.state?.code === 'SC' ? Validators.required : ''],
    });

    this.tanfForm = this.formBuilder.group({
      name: [_.get(this.employee, 'data.afdc_recipient_info.name', this.role === 'employee' ? '' : this.recipient_name), this.role === 'employee' ? [Validators.required, Validators.minLength(2)] : Validators.minLength(2)],
      relationship: [_.get(this.employee, 'data.afdc_recipient_info.relationship', this.role === 'employee' ? '' : 'Self'), this.role === 'employee' ? [Validators.required, Validators.minLength(2)] : Validators.minLength(2)],
      city_received: [_.get(this.employee, 'data.afdc_recipient_info.city_received', this.role === 'employee' ? '' : _.get(this.employee, 'data.employee_info.city', '')), this.role === 'employee' ? [Validators.required, Validators.minLength(2)] : Validators.minLength(2)],
      state_received: [_.get(this.employee, 'data.afdc_recipient_info.state_received', this.role === 'employee' ? '' : _.get(this.employee, 'data.employee_info.state', '')), this.role === 'employee' ? Validators.required : ''],
      county_received: [_.get(this.employee, 'data.afdc_recipient_info.county_received'), this.role === 'employee' ? Validators.required : ''],
    });

    this.snapForm = this.formBuilder.group({
      name: [_.get(this.employee, 'data.foodstamps_recipient_info.name', this.role === 'employee' ? '' : this.recipient_name), this.role === 'employee' ? [Validators.required, Validators.minLength(2)] : Validators.minLength(2)],
      relationship: [_.get(this.employee, 'data.foodstamps_recipient_info.relationship', this.role === 'employee' ? '' : 'Self'), this.role === 'employee' ? [Validators.required, Validators.minLength(2)] : Validators.minLength(2)],
      city_received: [_.get(this.employee, 'data.foodstamps_recipient_info.city_received', this.role === 'employee' ? '' : _.get(this.employee, 'data.employee_info.city', '')), this.role === 'employee' ? [Validators.required, Validators.minLength(2)] : Validators.minLength(2)],
      state_received: [_.get(this.employee, 'data.foodstamps_recipient_info.state_received', this.role === 'employee' ? '' : _.get(this.employee, 'data.employee_info.state', '')), this.role === 'employee' ? Validators.required : ''],
      county_received: [_.get(this.employee, 'data.foodstamps_recipient_info.county_received', ''), this.role === 'employee' ? Validators.required : ''],
    });

    this.voacationalRehabilitationForm = this.formBuilder.group({
      is_agency: [_.get(this.employee, 'data.voc_rehab_info.is_agency', ''), Validators.required],
      dept_va: [_.get(this.employee, 'data.voc_rehab_info.dept_va', ''), Validators.required],
      ttw: [_.get(this.employee, 'data.voc_rehab_info.ttw', ''), Validators.required],
      agency_name: [_.get(this.employee, 'data.voc_rehab_info.agency_name', '')],
      phone: [_.get(this.employee, 'data.voc_rehab_info.phone', ''), [Validators.minLength(10)]],
      address_line_1: [_.get(this.employee, 'data.voc_rehab_info.address_line_1', '')],
      address_line_2: [_.get(this.employee, 'data.voc_rehab_info.address_line_2', '')],
      zip: [_.get(this.employee, 'data.voc_rehab_info.zip', ''), Validators.minLength(5)],
      city: [_.get(this.employee, 'data.voc_rehab_info.city', '')],
      state: [_.get(this.employee, 'data.voc_rehab_info.state', '')],
      county: [_.get(this.employee, 'data.voc_rehab_info.county', '')],
    });

    this.militaryVeteranDetailsForm = this.formBuilder.group({
      disabled: [_.get(this.employee, 'data.veteran_info.disabled', ''), Validators.required],
      service_start: [_.get(this.employee, 'data.veteran_info.service_start', ''), (this.role === 'employee' || this.role === 'processor') ? [Validators.required, serviceDateCheck, validDateCheck] : [serviceDateCheck, validDateCheck]],
      service_stop: [_.get(this.employee, 'data.veteran_info.service_stop', ''), (this.role === 'employee' || this.role === 'processor') ? [Validators.required, validDateCheck] : validDateCheck],
      branch: [_.get(this.employee, 'data.veteran_info.branch', ''), Validators.required]
    }, { validators: serviceDateStopCheck });

    this.unemploymentDetailsForm = this.formBuilder.group({
      unemployment_start_date: [_.get(this.employee, 'data.unemployment_info.unemployment_start_date', ''), [Validators.required, validDateCheck]],
      unemployment_stop_date: [_.get(this.employee, 'data.unemployment_info.unemployment_stop_date', ''), [Validators.required, validDateCheck]],
      compensated: [_.get(this.employee, 'data.unemployment_info.compensated', ''), Validators.required],
      compensation_start_date: [_.get(this.employee, 'data.unemployment_info.compensation_start_date', ''), validDateCheck],
      compensation_stop_date: [_.get(this.employee, 'data.unemployment_info.compensation_stop_date', ''), validDateCheck],
      unemployment_compensation_state: [_.get(this.employee, 'data.unemployment_info.unemployment_compensation_state', _.get(this.employee, 'data.employee_info.state', ''))]
    }, { validators: [unemploymentStopCheck, compensationStartCheck, compensationStopCheck, compensationToCheck, unemploymentToCheck] });

    this.felonyDetailsForm = this.formBuilder.group({
      conviction_date: [_.get(this.employee, 'data.felon_info.conviction_date', ''), this.role === 'employee' ? [Validators.required, validDateCheck] : validDateCheck],
      release_date: [_.get(this.employee, 'data.felon_info.release_date', ''), validDateCheck],
      is_federal_conviction: [_.get(this.employee, 'data.felon_info.is_federal_conviction', ''), Validators.required],
      is_state_conviction: [_.get(this.employee, 'data.felon_info.is_state_conviction', ''), Validators.required],
      parole_officer_name: [_.get(this.employee, 'data.felon_info.parole_officer_name', '')],
      parole_officer_phone: [_.get(this.employee, 'data.felon_info.parole_officer_phone', ''), [Validators.minLength(10)]],
      felony_state: [_.get(this.employee, 'data.felon_info.felony_state', _.get(this.employee, 'data.employee_info.state', '')), _.get(this.employee, 'data.felon_info.is_state_conviction', '') && (this.role === 'employee' || this.role === 'processor') ? Validators.required : ''],
      felony_county: [_.get(this.employee, 'data.felon_info.felony_county', ''), _.get(this.employee, 'data.felon_info.is_state_conviction') && (this.role === 'employee' || this.role === 'processor') ? Validators.required : '']
    }, { validators: releaseDateCheck });

    this.questionnaireForm.valueChanges.subscribe(() => {
      this.employee.data.questionnaire = this.questionnaireForm.value
    })
    this.tanfForm.valueChanges.subscribe(() => {
      this.employee.data.afdc_recipient_info = this.tanfForm.value
    })
    this.snapForm.valueChanges.subscribe(() => {
      this.employee.data.foodstamps_recipient_info = this.snapForm.value
    })
    this.voacationalRehabilitationForm.valueChanges.subscribe(() => {
      this.employee.data.voc_rehab_info = this.voacationalRehabilitationForm.value
    })
    this.militaryVeteranDetailsForm.valueChanges.subscribe(() => {
      this.employee.data.veteran_info = this.militaryVeteranDetailsForm.value
    })
    this.unemploymentDetailsForm.valueChanges.subscribe(() => {
      if (this.unemploymentDetailsForm?.get('unemployment_start_date')?.value && this.unemploymentDetailsForm?.get('unemployment_stop_date')?.value) {
        this.showDefaultCompensation = true
      }
      this.employee.data.unemployment_info = this.unemploymentDetailsForm.value
    })
    this.felonyDetailsForm.valueChanges.subscribe(() => {
      this.employee.data.felon_info = this.felonyDetailsForm.value
    })
  }

  resetWOTCForms() {
    this.questionnaireForm.reset();
    this.tanfForm.reset();
    this.snapForm.reset();
    this.voacationalRehabilitationForm.reset();
    this.militaryVeteranDetailsForm.reset();
    this.unemploymentDetailsForm.reset();
    this.felonyDetailsForm.reset();
  }

  receivedServicesFromVocationalRehabilitationAgencyUpdate(event: any) {
    if (event.value === true) {
      this.voacationalRehabilitationForm?.get('dept_va')?.setValue(false);
      this.voacationalRehabilitationForm?.get('ttw')?.setValue(false);
    }
  }

  receivedServicesFromVeteransAffairsUpdate(event: any) {
    if (event.value === true) {
      this.voacationalRehabilitationForm?.get('is_agency')?.setValue(false);
      this.voacationalRehabilitationForm?.get('ttw')?.setValue(false);
    }
  }

  receivedServicesFromEmployeeNTWUpdate(event: any) {
    if (event.value === true) {
      this.voacationalRehabilitationForm?.get('is_agency')?.setValue(false);
      this.voacationalRehabilitationForm?.get('dept_va')?.setValue(false);
    }
  }

  federalConvictionUpdate(event: any) {
    if (event.value === true) {
      this.felonyDetailsForm?.get('is_state_conviction')?.setValue(false);
      event.value = false;
    } else {
      this.felonyDetailsForm?.get('is_state_conviction')?.setValue(true);
      event.value = true;
    }
    this.stateConvictionChange(event);
    if (!this.felonyDetailsForm.get('felony_county')?.value) {
      this.checkGeoQualify(true, 'felon')
    }
  }

  stateConvictionUpdate(event: any) {
    if (event.value === true) {
      this.felonyDetailsForm?.get('is_federal_conviction')?.setValue(false);
      if (!this.felonyDetailsForm.get('felony_county')?.value) {
        this.checkGeoQualify(true, 'felon')
      }
    } else {
      this.felonyDetailsForm?.get('is_federal_conviction')?.setValue(true);
    }
  }

  afdcSelectedState(event: any) {
    this.stateService.counties(event.code).subscribe(counties => {
      this.afdcCounties = counties;
    })
  }

  foodStampsSelectedState(event: any) {
    this.stateService.counties(event.code).subscribe(counties => {
      this.foodStampsCounties = counties;
    })
  }

  vocSelectedState(event: any) {
    this.stateService.counties(event.code).subscribe(counties => {
      this.vocCounties = counties;
    })
  }

  felonySelectedState(event: any) {
    this.felonyDetailsForm.controls['felony_county'].setValue('');
    this.stateService.counties(event.code).subscribe(counties => {
      this.felonyCounties = counties;
    })
  }

  setVeteranDefaultDates(event: any) {
    if (event.checked && !!this.employee_dob) {
      let service_start = moment(this.employee_dob, "DD-MM-YYYY").add(22, 'years').toDate();
      let service_stop = moment(this.employee_dob, "DD-MM-YYYY").add(26, 'years').toDate();
      this.militaryVeteranDetailsForm?.get('service_start')?.setValue(service_start);
      this.militaryVeteranDetailsForm?.get('service_stop')?.setValue(service_stop);
    } else {
      this.militaryVeteranDetailsForm?.get('service_start')?.reset();
      this.militaryVeteranDetailsForm?.get('service_stop')?.reset();
    }
  }

  setUnemploymentDefaultDates(event: any) {
    let dateCheck = new Date(new Date().getFullYear(), 9, 1)
    if (event.checked && !!this.employee_dsw) {
      this.showDefaultCompensation = true;
      this.defaultUnemploymentDateValue = true;
      let unemployment_start_date = this.employee_dsw < dateCheck ? moment().subtract(1, 'years').startOf('year').toDate() : moment().startOf('year').toDate();
      this.unemploymentDetailsForm?.get('unemployment_start_date')?.setValue(unemployment_start_date);
      this.unemploymentDetailsForm?.get('unemployment_stop_date')?.setValue(this.employee_dsw);
    } else {
      this.showDefaultCompensation = false;
      this.defaultUnemploymentDateValue = false;
      this.unemploymentDetailsForm?.get('unemployment_start_date')?.reset();
      this.unemploymentDetailsForm?.get('unemployment_stop_date')?.reset();
      this.unemploymentDetailsForm?.get('compensation_start_date')?.reset();
      this.unemploymentDetailsForm?.get('compensation_stop_date')?.reset();
    }
  }

  useAsUnemploymentDates(event: any) {
    if (event.checked) {
      this.defaultUnemploymentDateValue = false;
      this.showDefaultCompensation = true;
      this.useAsUnemployment = true;
      let start = this.unemploymentDetailsForm?.get('compensation_start_date')?.value
      let stop = this.unemploymentDetailsForm?.get('compensation_stop_date')?.value
      this.unemploymentDetailsForm?.get('unemployment_start_date')?.setValue(start);
      this.unemploymentDetailsForm?.get('unemployment_stop_date')?.setValue(stop);
    } else {
      this.showDefaultCompensation = false;
      this.useAsUnemployment = false;
      this.unemploymentDetailsForm?.get('unemployment_start_date')?.reset();
      this.unemploymentDetailsForm?.get('unemployment_stop_date')?.reset();
    }
  }

  setCompensationDefaultDates(event: any) {
    let dateCheck = new Date(new Date().getFullYear(), 9, 1)
    if (event.checked && !!this.employee_dsw) {
      this.defaultCompensationDateValue = true;
      let start = this.unemploymentDetailsForm?.get('unemployment_start_date')?.value
      let stop = this.unemploymentDetailsForm?.get('unemployment_stop_date')?.value
      this.unemploymentDetailsForm?.get('compensation_start_date')?.setValue(start);
      this.unemploymentDetailsForm?.get('compensation_stop_date')?.setValue(stop);
    } else {
      this.defaultCompensationDateValue = false;
      this.unemploymentDetailsForm?.get('compensation_start_date')?.reset();
      this.unemploymentDetailsForm?.get('compensation_stop_date')?.reset();
    }
  }

  seFelonyDefaultDates(event: any) {
    let dateCheck = new Date(new Date().getFullYear(), 9, 1)
    if (event.checked && !!this.employee_dsw) {
      let conviction_date = this.employee_dsw < dateCheck ? moment().subtract(1, 'years').startOf('year').toDate() : moment().startOf('year').toDate();
      this.felonyDetailsForm?.get('conviction_date')?.setValue(conviction_date);
      this.felonyDetailsForm?.get('release_date')?.setValue(new Date(this.employee_dsw.getFullYear(), this.employee_dsw.getMonth(), this.employee_dsw.getDate() - 14));
    } else {
      this.felonyDetailsForm?.get('conviction_date')?.reset();
      this.felonyDetailsForm?.get('release_date')?.reset();
    }
  }

  checkGeoQualify(event: any, form?: string) {
    
      if (this.role !== 'employee') {
        let address = this.employee.data.employee_info;
        if (!!address.address_line_1 && !!address.city && !!address.state && !!address.zip) {
          let full_address = `full_address='${address.address_line_1}, ${address.city}, ${address.state.code}, ${address.zip}'`
          this.utilService.geoQualify(full_address).subscribe(result => {
            if (form === 'tanf') {
              this.tanfForm.get('county_received')?.setValue(_.find(this.counties, { id: result.formatted_address.county }))
            } else if (form === 'snap') {
              this.snapForm.get('county_received')?.setValue(_.find(this.counties, { id: result.formatted_address.county }))
            } else if (form === 'felon') {
              this.felonyDetailsForm.get('felony_county')?.setValue(_.find(this.felonyCounties, { id: result.formatted_address.county }))
            }
          });
        }
      }
    
  }

  unemploymentCompensationChange(event: any) {
    if (this.role === 'employee' || this.role === 'processor') {
      if (event.value) {
        this.unemploymentDetailsForm.get('compensation_start_date')?.setValidators(Validators.required);
        this.unemploymentDetailsForm.get('compensation_stop_date')?.setValidators(Validators.required);
        // this.unemploymentDetailsForm.get('unemployment_compensation_state')?.setValidators(Validators.required);
      } else {
        this.unemploymentDetailsForm.get('compensation_start_date')?.clearValidators()
        this.unemploymentDetailsForm.get('compensation_stop_date')?.clearValidators()
        // this.unemploymentDetailsForm.get('unemployment_compensation_state')?.clearValidators()
      }
      this.unemploymentDetailsForm.get('compensation_start_date')?.updateValueAndValidity();
      this.unemploymentDetailsForm.get('compensation_stop_date')?.updateValueAndValidity();
      // this.unemploymentDetailsForm.get('unemployment_compensation_state')?.updateValueAndValidity();
    }
  }

  stateConvictionChange(event: any) {
    if (this.role === 'hiring_manager' || this.role === 'processor') {
      if (event.value) {
        this.felonyDetailsForm.get('felony_state')?.setValidators(Validators.required);
        this.felonyDetailsForm.get('felony_county')?.setValidators(Validators.required);
      } else {
        this.felonyDetailsForm.get('felony_state')?.clearValidators()
        this.felonyDetailsForm.get('felony_county')?.clearValidators()
      }
      this.felonyDetailsForm.get('felony_state')?.updateValueAndValidity();
      this.felonyDetailsForm.get('felony_county')?.updateValueAndValidity();
    }
  }

  back() {
    this.employee.focussedTab = 'employee_info'
    this.employeeService.setEmployee(this.employee)
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
    this.validate();
    if ((this.questionnaireForm.valid && !this.tanf_invalid && !this.snap_invalid && !this.voc_rehab_invalid && !this.veteran_Invalid && !this.unemployment_invalid && !this.felony_invalid) || this.employee?.persistent) {
      this.employee.data.questionnaire.hasErrors = false;
      this.employee.data.questionnaire = this.questionnaireForm.value
      this.questionnaireForm.value.afdc ? this.employee.data.afdc_recipient_info = this.tanfForm.value : '';
      this.questionnaireForm.value.food_stamps ? this.employee.data.foodstamps_recipient_info = this.snapForm.value : '';
      this.questionnaireForm.value.voc_rehab ? this.employee.data.voc_rehab_info = this.voacationalRehabilitationForm.value : '';
      this.employee.data.questionnaire.felon ? this.employee.data.felon_info = this.felonyDetailsForm.value : '';
      this.employee.data.questionnaire.veteran ? this.employee.data.veteran_info = this.militaryVeteranDetailsForm.value : '';
      this.employee.data.questionnaire.unemployed ? this.employee.data.unemployment_info = this.unemploymentDetailsForm.value : '';
      this.employee.focussedTab = (this.role === 'hiring_manager' || this.role === 'processor' ? "hiring_manager_info" : "preview_information");
      this.employee.focussedTab = this.isApplicant ? 'E_Sign' : this.employee.focussedTab;
      // this.employeeService.setEmployee(this.employee)
    } else {
      this.questionnaireForm.valid ? _.set(this.employee,"data.questionnaire.hasErrors" , false) : _.set(this.employee,"data.questionnaire.hasErrors" , true);
      this.questionnaireForm.value.afdc && !this.tanfForm.valid ? _.set(this.employee, 'data.afdc_recipient_info.hasErrors', true) : _.set(this.employee, 'data.afdc_recipient_info.hasErrors', false);
      this.questionnaireForm.value.food_stamps && !this.snapForm.valid ? _.set(this.employee, 'data.foodstamps_recipient_info.hasErrors', true) : _.set(this.employee, 'data.foodstamps_recipient_info.hasErrors', false);
      this.questionnaireForm.value.voc_rehab && (!this.voacationalRehabilitationForm.valid || this.voc_rehab_invalid) ? _.set(this.employee, 'data.voc_rehab_info.hasErrors', true) : _.set(this.employee, 'data.voc_rehab_info.hasErrors', false);
      this.employee.data.questionnaire.veteran && !this.militaryVeteranDetailsForm.valid ? _.set(this.employee, 'data.veteran_info.hasErrors', true) : _.set(this.employee, 'data.veteran_info.hasErrors', false);
      this.employee.data.questionnaire.unemployed && !this.unemploymentDetailsForm.valid ? _.set(this.employee, 'data.unemployment_info.hasErrors', true) : _.set(this.employee, 'data.unemployment_info.hasErrors', false);
      this.employee.data.questionnaire.felon && !this.felonyDetailsForm.valid ? _.set(this.employee, 'data.felon_info.hasErrors', true) : _.set(this.employee, 'data.felon_info.hasErrors', false);
      this.employee.focussedTab = 'questionnaire'
      this.ToastrService.error("Please fix validation issues", "WOTC Questionnaire")
    }
  }

  validate() {
    this.questionnaireForm.get('afdc')?.value ? !this.tanfForm.valid ? this.tanf_invalid = true : this.tanf_invalid = false : this.tanf_invalid = false;
    this.questionnaireForm.get('food_stamps')?.value ? !this.snapForm.valid ? this.snap_invalid = true : this.snap_invalid = false : this.snap_invalid = false;
    if (this.questionnaireForm.get('voc_rehab')?.value) {
      !this.voacationalRehabilitationForm?.get('is_agency')?.value && !this.voacationalRehabilitationForm?.get('dept_va')?.value && !this.voacationalRehabilitationForm?.get('ttw')?.value ? this.voc_rehab_invalid = true : this.voc_rehab_invalid = false;
      this.voc_rehab_invalid = !this.voacationalRehabilitationForm.valid ? true : this.voc_rehab_invalid;
    } else {
      this.voc_rehab_invalid = false;
    }
    this.questionnaireForm.get('veteran')?.value ? !this.militaryVeteranDetailsForm.valid ? this.veteran_Invalid = true : this.veteran_Invalid = false : this.veteran_Invalid = false
    this.questionnaireForm.get('unemployed')?.value ? !this.unemploymentDetailsForm.valid ? this.unemployment_invalid = true : this.unemployment_invalid = false : this.unemployment_invalid = false
    this.questionnaireForm.get('felon')?.value ? !this.felonyDetailsForm.valid ? this.felony_invalid = true : this.felony_invalid = false : this.felony_invalid = false
  }

  ngOnDestroy() {
    if (this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
  }

}
