import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Plugins} from '@capacitor/core';
import { LoadingController, ToastController } from '@ionic/angular';
const {Storage} = Plugins;
const STORAGE_REQ_KEY = 'storedreq';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  url: string;
  cuenta: any;
  start: any;
  rep: any;
  urlstart: any;



  constructor(
      private http: HttpClient,
       private router:Router,
       public loadingController: LoadingController,
       private toastController: ToastController) { this.url = environment.urlbackend;
  this.rep = [];
  this.start = [];
  this.urlstart = environment.urlbackend;
  }
  
 async postReporte(data,status): Promise <void>{
    if (status.connected === false) {
      const loading = await this.loadingController.create();
      await loading.present(); 
      let toast = this.toastController.create({
        message: `La peticion se ha guardado localmente`,
        duration: 3000,
        position: 'bottom'  
      });
      toast.then(toast => toast.present());
      await Storage.set({
        key: STORAGE_REQ_KEY,
        value: JSON.stringify({
          data
        })
      }).then(async result =>{
        setTimeout(async () => {
          await Storage.remove({ key: 'reporte-save' }).then(res =>{
         let toast = this.toastController.create({
           message: `No tienes reportes pendientes!`,
           duration: 3000,
           position: 'bottom'
         });
         toast.then(toast => toast.present());
       });    
       }, 2000);
        loading.dismiss();
       this.router.navigate(['/busqueda'])
      });
    }else{
      const loading = await this.loadingController.create();
      await loading.present();  
     return new Promise((resolve, reject) => {
      this.http.post(this.url + 'reporte', {
       data
      }).subscribe(async res => {
        
          setTimeout(async () => {
            await Storage.remove({ key: 'reporte-save' }).then(res =>{
           let toast = this.toastController.create({
             message: `No tienes reportes pendientes!`,
             duration: 3000,
             position: 'bottom'
           });
           toast.then(toast => toast.present());
         });    
         }, 2000);
          loading.dismiss();
         this.router.navigate(['/busqueda'])
        resolve();
      }, err => {
        console.log('error', err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al conectarse con el servidor',
          text: 'Verifica tu conexion a internet',
          showConfirmButton: true
        });
        reject()
      }); 
    });
  }
    }

  tarjetas():Promise <void> { 
    return new Promise((resolve, reject) => {
      this.http.get(this.urlstart + 'start').subscribe(res => {
        this.start = res;
        resolve();
      }, err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: err.error.message,
          showConfirmButton: true         
        });
        reject()
      });
    });
  }
 // Save result of API requests
//  private setLocalData(key, data) {
//   this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
// }

// Get cached API result
private getLocalData(key) {
  try {
//     return this.storage.get(`${API_STORAGE_KEY}-${key}`).then((valor) =>{
//     this.start = valor;
   
// });
  } catch (error) {
    Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: error,
          showConfirmButton: true         
        });
  }
             
}

  reporte(id):  Promise<void> {
    
    return new Promise((resolve, reject) => {
      this.http.get(this.url + `reporte/${id}`).subscribe(Data => {
        this.rep = Data; 
        resolve();
      }, err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: err.error.message,
          showConfirmButton: true         
        });
        reject()
      });
    });
  }
 
}
