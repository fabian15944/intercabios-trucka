import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteSavePage } from './reporte-save.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteSavePageRoutingModule {}
