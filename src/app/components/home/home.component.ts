import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Subscription } from 'rxjs'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '../../services/local-storage.service';
import { StateService } from '../../services/state.service';
import { EmployeeTransform,EBasicData } from '../../classes/employee-transform';
import { SuccessPopUpComponent } from '../success-pop-up/success-pop-up.component';
import { UltimateSoftwatePopUpComponent } from '../ultimate-softwate-pop-up/ultimate-softwate-pop-up.component';
import { LoginService } from '../../services/login.service';
import { HttpParams } from '@angular/common/http';
import { EmployeeInformationComponent } from '../employee-information/employee-information.component';
import { JobInformationComponent } from '../job-information/job-information.component';
import { WotcQuestionnaireComponent } from '../wotc-questionnaire/wotc-questionnaire.component';
import { ElectronicSignatureComponent } from '../electronic-signature/electronic-signature.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends EmployeeTransform implements OnInit {

  @ViewChild('EmployeeInfo') employeeInfo!: EmployeeInformationComponent;
  @ViewChild('JobInfo') jobInfo!: JobInformationComponent;
  @ViewChild('WOTC') wotc!: WotcQuestionnaireComponent;
  @ViewChild('Esign') esign!: ElectronicSignatureComponent;

  LangButtonText!: string;
  panelOpenState = false;
  Firstname = "";
  Lastname = "";
  step = 0;
  empData:any
  employeeSubscription!: Subscription;
  ShowWotcForm = false;
  submitting!:boolean
  currentUser!:any;
  states: any;
  PluginInputStyle:any;
  PluginEmployeeInfo:any;
  PluginJobInfo:any;
  loading = true;
  isInit = false;
  constructor( 
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<HomeComponent>,
    private localStorageService:LocalStorageService,  
    private stateService: StateService,  
    private dialog: MatDialog,
    private login:LoginService
    ) {
    super();
  }

  ngOnInit(): void {
  
    this.employeeSubscription = this.employeeService.employeeData.subscribe((data: any) => {
      this.empData = data;
      this.loading = _.get(this.empData, 'loading',true);
      
      if(this.loading === false){
        if(data.isError === true){
          this.dialogRef.close();
        }
      }
      if(data.data.employee_info?.rehire!=undefined){
        this.ShowWotcForm = !data.data.employee_info.rehire;
      }
        this.currentUser = this.localStorageService.userInfo();
        if(!this.isInit){
          this._initatePluginData();
        }
    });

    this.employeeService.Pluginsubmit$.subscribe( ()=> {

      if(!this.employeeInfo.employeeForm.value.rehire){
        this.wotc.checkValidations();
      }
      this.employeeInfo.checkValidations();
      this.jobInfo.checkValidations();
      this.esign.checkValidations();
      if(this.employeeInfo.employee.data.employee_info.hasErrors){
        this.step = 0
      }
      else if((!this.employeeInfo.employeeForm.value.rehire) && this.wotc.employee.data.questionnaire.hasErrors){
        this.step = 1
      }
      else if(!this.employeeInfo.employeeForm.value.rehire){
        console.log("HI")
        if(!(this.wotc.employee.data.questionnaire.hasErrors) && this.wotc.employee.data.questionnaire.felon && this.wotc.employee.data.felon_info.hasErrors){
          this.step = 1
          console.log("HI felon")
        }
        else if(!(this.wotc.employee.data.questionnaire.hasErrors)&& this.wotc.employee.data.questionnaire.veteran && this.wotc.employee.data.veteran_info.hasErrors ){
          this.step = 1
          console.log("HI vet")
        }
        else if(!(this.wotc.employee.data.questionnaire.hasErrors)&& this.wotc.employee.data.questionnaire.unemployed && this.wotc.employee.data.unemployment_info.hasErrors ){
          this.step = 1
          console.log("HI unemp")
        }
        else if(!(this.wotc.employee.data.questionnaire.hasErrors) && this.wotc.employee.data.questionnaire.voc_rehab && this.wotc.employee.data.voc_rehab_info.hasErrors){
          this.step = 1
          console.log("HI rehab")
        }else{

          if(this.jobInfo.employee.data.hiring_manager_info.hasErrors){
            this.step = 2
            console.log('HIII');
          }
          else if(this.esign.employee.data.e_signatures.hm_signature.hasErrors){
            this.step =3;
            console.log('HIII');
          }
          else{            
            _.set(this.empData,'data.employee_info', this.employeeInfo.employee.data.employee_info);
            _.set(this.empData,'data.hiring_manager_info', this.jobInfo.employee.data.hiring_manager_info);
            if(!this.empData.data.employee_info.rehire){
              _.set(this.empData,'data.questionnaire', this.wotc.employee.data.questionnaire)
            }
            _.set(this.empData,'data.e_signatures', this.esign.employee.data.e_signatures);
            this._createEmployee();
            this.closeDialog();
          }
        }
      }
      else if(this.jobInfo.employee.data.hiring_manager_info.hasErrors){
        this.step = 2
        console.log('HIII');
      }
      else if(this.esign.employee.data.e_signatures.hm_signature.hasErrors){
        this.step =3;
        console.log('HIII');
      }
      else{            
        _.set(this.empData,'data.employee_info', this.employeeInfo.employee.data.employee_info);
        _.set(this.empData,'data.hiring_manager_info', this.jobInfo.employee.data.hiring_manager_info);
        if(!this.empData.data.employee_info.rehire){
          _.set(this.empData,'data.questionnaire', this.wotc.employee.data.questionnaire)
        }
        _.set(this.empData,'data.e_signatures', this.esign.employee.data.e_signatures);
        this._createEmployee();
        this.closeDialog();
      }
    })
  }

  ngAfterViewChecked() {
    this.employeeInfo.employeeForm.valueChanges.subscribe(() => {
      this.Firstname = this.employeeInfo.employeeForm.controls['first_name'].value;
      this.Lastname = this.employeeInfo.employeeForm.controls['last_name'].value;
    })
  }

  private _createEmployee(){
    
    _.set(this.empData,"data.employee_info.client" , _.get(this.currentUser,"ccl_info.client_id",''));
    _.set(this.empData,"data.employee_info.company" , _.get(this.currentUser,"ccl_info.company_id",''));
    _.set(this.empData,"data.employee_info.location" , _.get(this.currentUser,"ccl_info.location_id",''));

    if (_.get(this.empData,"data.employee_info",'')) {
      this.stateService.states().subscribe(data=>{
        this.states = data;
      })
    }
    this.save();
  }

  save() {
    let emp = _.cloneDeep(this.empData);
    this.transformPluginEmployee(emp, this.currentUser, false);
    this.submitting = true;
    if (this.currentUser.ats_enabled && !this.currentUser.ssn_enabled) {
      this.checkRandomSSN(emp)
    } else {
      console.log(emp)
      // this.empData?.data?.employee_info.id ? this.update(emp) : this.submit(emp);
    }
  }

  submit(empData: any) {

    this.employeeService.employees(empData.data, 'plugin').subscribe({
      next: (employee: any) => {
        this.submitting = false;
        // this.reset();
        if (this.currentUser.ats_enabled) {
          if (this.currentUser.is_require_confirmation) {
            this.ultimateConfirmationCheck();
          }
          else {
            this.openSuccessMessage();
          }
        } else {
          // navigate to new page
        }
      }, error: (err: Error) => {
        this.submitting = false;
        _.set(this.empData, 'data.serverErrors', err.message)
        this.empData.focussedTab = 'employee_info'
        this.employeeService.setEmployee(this.empData)
      }
    });
  }

  private _getPluginStyle(Data:any) {
      const style = {
        button_class:Data.button_class,
        button_class_error:Data.button_class_error,
        button_text:Data.button_text,
        button_text_error:Data.button_text_error,
        error_color:Data.error_color,
        head_color:Data.head_color,
        hide_fields:Data.hide_fields,
        hide_hm_section:Data.hide_hm_section,
        logo:Data.logo,
        modalAnimation:Data.modalAnimation,
        panel_color:Data.panel_color,
    }
    return style;
  }

  private _initatePluginData(){
    if(!_.get(this.empData, "data.pluginInput", null)){
      console.log("no plugin input");
    }else{      
      this.PluginInputStyle = this._getPluginStyle(_.get(this.empData,'data.pluginInput',''));
      this.PluginEmployeeInfo = _.get(this.empData,'data.pluginInput.populated_fields',{})
      this.PluginJobInfo = _.get(this.empData,'data.pluginInput.hiring_manager_fields',{});
      
      _.set(this.PluginEmployeeInfo,"client", this.currentUser.ccl_info.client_id);
      _.set(this.PluginEmployeeInfo,"company", this.currentUser.ccl_info.company_id);
      _.set(this.PluginEmployeeInfo,"location", this.currentUser.ccl_info.company_id);
     
      this.LangButtonText = this.currentUser.preffered_language;
      const employeePluginInfo = {
        ...this.empData,
        data:{
          employee_info : this.PluginEmployeeInfo,
          hiring_manager_info : this.PluginJobInfo,
        }
      }
      console.log("Emp-->",employeePluginInfo)
      this.isInit = true;
      this.employeeService.setEmployee(employeePluginInfo);
    }
  }

  checkRandomSSN(empData: any) {
    let randomSSN = "666" + Math.floor(Math.random() * 900000)
    let params = {
      ssn: randomSSN,
      is_advanced_search: true
    }
    let queryParams = new HttpParams({ fromObject: params });
    this.employeeService.listEmployee(queryParams).subscribe((employees: any) => {
      if (employees.list.length) {
        this.checkRandomSSN(empData)
      }
      else {
        empData.data.employee_info.ssn = randomSSN;
        empData.data.employee_info.ssn_confirmation = randomSSN;
        this.submit(empData)
      }
    })
  }

  closeDialog(): void {
    if(this.empData.data.e_signatures === undefined) {
      this.empData.data['e_signatures'] = {hm_signature : {
        authorization: false,
        esign: true,}
      }
    }

    this.empData.data.employee_info.client_id = this.currentUser.ccl_info.client_id;
    this.empData.data.employee_info.company_id = this.currentUser.ccl_info.company_id;
    this.empData.data.employee_info.location_id = this.currentUser.ccl_info.location_id;

    // tranforming the changed data
    let emp = _.cloneDeep(this.empData);
    this.transformPluginEmployee(emp, this.currentUser, false);
    
    if (this.currentUser.ats_enabled && !this.currentUser.ssn_enabled) {
      this.checkRandomSSN(emp)
    } 
    else {
      // transformed data setting 
      emp.data.e_signatures.hm_signature['authorization'] = false;
      emp.data['model_closed'] = true;
      if(emp.data.hiring_manager_info?.occupation_id===undefined){
        emp.data.hiring_manager_info.occupation_id=""
      }
      console.log(this.empData,emp);
      this.submit(emp);
      this.dialogRef.close();
    }
  }

  openSuccessMessage(): void {
    const dialogRe = this.dialog.open(SuccessPopUpComponent, {
      data: { title: 'Applicant Information', message: 'You have successfully submitted your tax credit screening application. We do not require any other information from you. You may leave this page. Thank you!' }
    });
    dialogRe.afterClosed().subscribe((result: any) => {
      if (result)
        this._logout()
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
        this._logout()
      }
    });
  }

  update(empData: any) {
    let message = 'Employee updated successfully'
    this.employeeService.update(empData?.data?.employee_info?.id, empData.data, message).subscribe({
      next: (employee: any) => {
        this._logout();
      }, error: (err: Error) => {
        this.submitting = false;
      }
    })
  }

  private _logout(){
    this.login.logout().subscribe(data=>{
      console.log(data);
    });
  }


  setStep(index: number) {
    this.step = index;
  }

  formSubmit(){
    this.employeeService.Pluginsubmit$.next(true);
  }

  changeLanguage() {
    if(this.LangButtonText==="english"){
      this.currentUser.preffered_language = "spanish";
    }
    else {
      this.currentUser.preffered_language = "english";
    }
    
    this.localStorageService.saveData('userInfo',JSON.stringify(this.currentUser));
    this.LangButtonText = this.currentUser.preffered_language;
  }
}
