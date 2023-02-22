import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeInformationComponent } from './components/employee-information/employee-information.component';
import { JobInformationComponent } from './components/job-information/job-information.component';
import { WotcQuestionnaireComponent } from './components/wotc-questionnaire/wotc-questionnaire.component';
import { ElectronicSignatureComponent } from './components/electronic-signature/electronic-signature.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ToastrModule } from 'ngx-toastr';
import { LoadingComponent } from './components/loading/loading.component';
import { SuccessPopUpComponent } from './components/success-pop-up/success-pop-up.component';
import { UltimateSoftwatePopUpComponent } from './components/ultimate-softwate-pop-up/ultimate-softwate-pop-up.component';
import { windowProvider } from './classes/window.token';
import { AuthInterceptor } from './services/auth.interceptor';
// import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeInformationComponent,
    JobInformationComponent,
    WotcQuestionnaireComponent,
    ElectronicSignatureComponent,
    HomeComponent,
    LoadingComponent,
    SuccessPopUpComponent,
    UltimateSoftwatePopUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    // MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },windowProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
