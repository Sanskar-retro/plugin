import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
// import { HomeComponent } from './components/home/home.component';

const routes: Routes = [{
  path: '',
  component:AppComponent
},{
  path: 'plugin',
  component:AppComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
