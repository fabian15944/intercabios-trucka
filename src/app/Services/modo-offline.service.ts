import { Injectable } from '@angular/core';
import { ReporteService } from './reporte.service';
import {  Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
const { Storage } = Plugins;
const STORAGE_REQ_KEY = 'storedreq';
@Injectable({
  providedIn: 'root'
})
export class ModoOfflineService {

  constructor(
    public servicioreportes: ReporteService,
    private toastController: ToastController,
    ) { }

  async reporte_enviar(){
      let reporte = await Storage.get({key: STORAGE_REQ_KEY})
      let storedObj = JSON.parse(reporte.value);
      if(storedObj === null){
      console.log('no hay reportes');
      }
      if(storedObj != null){ 
        var data = storedObj.data
        this.servicioreportes.postReporte(data,status).then(async result =>{
         await Storage.remove({key: STORAGE_REQ_KEY })
         let toast = this.toastController.create({
          message: `Reporte Guardado con exito!`,
          duration: 3000,
          position: 'bottom'
        });
        toast.then(toast => toast.present());
        })

      }
  }

}
