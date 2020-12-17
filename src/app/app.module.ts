import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AppRoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadRuleSetsComponent } from './views/upload-rule-sets/upload-rule-sets.component';
import { LoginComponent } from './views/login/login.component';
import { RuleBucketsComponent } from './views/rule-buckets/rule-buckets.component';
import { AdminViewComponent } from './views/admin-view/admin-view.component';

const routes: Routes = []


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UploadRuleSetsComponent,
    LoginComponent,
    RuleBucketsComponent,
    AdminViewComponent  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
