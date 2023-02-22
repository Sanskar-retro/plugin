import { Component, OnInit,OnDestroy,HostListener ,Inject, Injector,  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HomeComponent } from './components/home/home.component';
import { Subscription } from 'rxjs'
import { EmployeeService } from './services/employee.service';
import { LoginService } from './services/login.service';
import { ILogin } from './services/login.model';
import { LocalStorageService } from './services/local-storage.service';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from './classes/window.token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'plugin';
  employeeSubscription!: Subscription
  user!: ILogin;
  loading:boolean=false;
  employee!:any;
  constructor(
     public dialog: MatDialog,
     private employeeService: EmployeeService,
     private login:LoginService,
     private localStorageService:LocalStorageService,
     @Inject(WINDOW) private window: Window,
     @Inject(DOCUMENT) private document: Document,
     private injector: Injector,
      ) { }

  ngOnInit(): void {
    this.employeeService.employeeData.subscribe(data => {
      this.employee = data;
    })
    this.window.addEventListener('message', (event)=>{
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if(!_.isUndefined(data)){
        if(data.password){
          if(_.get(this.employee,'data.pluginInput')===undefined){
            _.set(this.employee, 'data.pluginInput', data);
            this.employeeService.setEmployee(this.employee);
            this._login(data);
          }
        }
      }
    });
  }
  
  private _login(data:any){
    this.user = {
      username: data.username,
      password: data.password
    }
    _.set(this.employee, 'loading', true);
    this.employeeService.setEmployee(this.employee);
    this.openDialog();


    this.login.login(this.user,true).subscribe(data=>{
      if(data){
        if(data.role!=="plugin"){
          this.dialog.closeAll();
        }else{
          this.localStorageService.saveData('userInfo',JSON.stringify(data))
          _.set(this.employee, 'loading', false);
          this.employeeService.setEmployee(this.employee);
        }
      }else{
        this.dialog.closeAll();
      }
    });
  }
  
  private _logout(){
    this.login.logout().subscribe(data=>{
      console.log(data);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(HomeComponent,{
      width: '100%',
      disableClose:true
    });
  }

  ngOnDestroy(): void {
    this._logout();
  }

}
