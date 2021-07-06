import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingServiceService } from '../Services/loading-service.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Component({
  selector: 'app-inicio-administracion',
  templateUrl: './inicio-administracion.page.html',
  styleUrls: ['./inicio-administracion.page.scss'],
})
export class InicioAdministracionPage implements OnInit {
  reporte: any
  trailer
  conductor
  marca:any;
  Usuario:any;
  constructor(
    private alertCtrl: AlertController,   
    private router: Router,
    private toastController: ToastController,
    private loading: LoadingServiceService
    ) 
  {  
   this.reporte = [];
  }

  ngOnInit() {   
    this.Get_user();
  }

async Get_user(){
  this.loading.present();
    const ret = await Storage.get({ key: 'user' });
    const user = JSON.parse(ret.value);
    this.Usuario = user.nombre  
this.loading.dismiss();
this.Get_Reporte();
}


 async Get_Reporte(){
    this.loading.present();
    const ret = await Storage.get({ key: 'reporte-save' });
     this.reporte = JSON.parse(ret.value)

     if(this.reporte === null ){
      let toast = this.toastController.create({
        message: `No tienes reportes pendientes!`,
        duration: 3000,
        position: 'bottom'
      });
      this.loading.dismiss();
      toast.then(toast => toast.present());
    }else{
      this.loading.dismiss();
      this.alert_reporte('Tienes un reporte pendiente por terminar ')

    } 
    
  }

  async alert_reporte(mensaje) {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Atención',
      message: mensaje,
      buttons: [
         {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {          
          }
        },{
          text: 'Terminar',
          handler: (blah) => {   
            this.get_storage()
          }

        }]
    });
    await alert.present();
  }
  
    
 async get_storage(){
  const ret = await Storage.get({ key: 'tcm' });
  const tcm = JSON.parse(ret.value);
  this.trailer = tcm.trailer;
  this.conductor = tcm.conductor;
  this.marca = tcm.Marca;
  this.direcionar();
 }   
      
   
 direcionar() {
  let navParams: NavigationExtras = {
    queryParams: {
      trailer: this.trailer,
      conductor: this.conductor,
      Marca: this.marca
    }
  };
  this.router.navigate(['reporte-save'], navParams);
}



}
