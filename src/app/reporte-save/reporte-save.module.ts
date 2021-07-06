import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteSavePageRoutingModule } from './reporte-save-routing.module';

import { ReporteSavePage } from './reporte-save.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteSavePageRoutingModule
  ],
  declarations: [ReporteSavePage]
})
export class ReporteSavePageModule {}
