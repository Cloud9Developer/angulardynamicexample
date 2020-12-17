import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UploadRuleSetsComponent } from './views/upload-rule-sets/upload-rule-sets.component';
import { LoginComponent } from './views/login/login.component';
import { RuleBucketsComponent } from './views/rule-buckets/rule-buckets.component';
import { AdminViewComponent } from './views/admin-view/admin-view.component';

const routes: Routes = [
  { path: '', redirectTo: "/rulesUpload", pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'rulesUpload', component: UploadRuleSetsComponent },
  { path: 'authRules', component: RuleBucketsComponent },
  { path: 'admin', component: AdminViewComponent },
  { path: '**', redirectTo: "/rulesUpload"},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
