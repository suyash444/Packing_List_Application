import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanySelectComponent } from './pages/company-select/company-select.component';
import { Company142PrintComponent } from './pages/company-142-print/company-142-print.component';
import { Company156PrintComponent } from './pages/company-156-print/company-156-print.component';
import { Company156ReprintComponent } from './pages/company-156-reprint/company-156-reprint.component';

const routes: Routes = [
  
  { path: '', pathMatch: 'full', component: CompanySelectComponent },

  // company 142: single screen (print)
  { path: 'company/142/print', component: Company142PrintComponent },

  // company 156: two screens (print + reprint)
  { path: 'company/156/print', component: Company156PrintComponent },
  { path: 'company/156/reprint', component: Company156ReprintComponent },

 
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
