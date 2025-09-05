import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanySelectComponent } from './pages/company-select/company-select.component';
import { Company142PrintComponent } from './pages/company-142-packingList/company-142-print.component';
import { Company156PrintComponent } from './pages/company-156-Inbound/company-156-print.component';
import { Company156ReprintComponent } from './pages/company-156-reprintInbound/company-156-reprint.component';
import { Company156PositionComponent } from './pages/company-156-position/company-156-position.component';


const routes: Routes = [
  
  { path: '', pathMatch: 'full', component: CompanySelectComponent },


  { path: 'company/142/print', component: Company142PrintComponent },

  
  { path: 'company/156/print', component: Company156PrintComponent },
  { path: 'company/156/reprint', component: Company156ReprintComponent },


  { path: 'company/156/position', component: Company156PositionComponent },

 
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
