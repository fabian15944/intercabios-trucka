import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDescargarImgPage } from './modal-descargar-img.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDescargarImgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDescargarImgPageRoutingModule {}
