import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDescargarImgPageRoutingModule } from './modal-descargar-img-routing.module';

import { ModalDescargarImgPage } from './modal-descargar-img.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDescargarImgPageRoutingModule
  ],
  declarations: [ModalDescargarImgPage]
})
export class ModalDescargarImgPageModule {}
