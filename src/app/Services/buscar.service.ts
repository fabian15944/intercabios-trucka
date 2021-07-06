import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2'
import { AlertController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class BuscarService {
  url: string;    // URL del backend
  Ntracto: any;  // variable con Numero del tracto
  foto:any;
  actualizar:any;
  act_img_back:any;
  alert_data:any;
  act_todo_img:any;
  constructor(private http: HttpClient,private alertCtrl: AlertController,private router: Router,) {
    this.url = environment.urlbackend;
    
  }
  Put_modal_img(orden):Promise<void>{
    return new Promise((resolve, reject) => {
    return this.http.put(this.url + `update/imagen`,{
      orden
    }).subscribe(data => {
      this.alert_data = data
      resolve();
      }, error =>{
      alert(error)
      }
    )
  });
  }
  traerimg(valores):Promise<void> {   
    return new Promise((resolve, reject) => {
      this.http.get(this.url + `act_img/${valores}`).subscribe(Data => {
        this.act_img_back = Data; 
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
  traer_todas_las_img():Promise<void> {   
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'todas_img').subscribe(Data => {
         this.act_todo_img = Data; 
        resolve();
      }, err => {
        this.volver_cargar()
        reject()
      });
    });
  }
  async volver_cargar() {
    const alert = await this.alertCtrl.create({
      header: 'Atención',
      message: 'No tienes Internet vuelve a refrescar la pagina por favor.',
      buttons: [
        {
          text: 'Vover a refrescar',
          handler: (blah) => {
            this.router.navigate(['busqueda']);
          }
  
        }]
    });
    await alert.present();
  
  }


  act_img():Promise<void> {   
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'get_act').subscribe(Data => {
        this.actualizar = Data; 
        resolve();
      }, err => {
        this.volver_cargar()
        reject()
      });
    });
  }
   
  getTractos(numero): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + `buscar/${numero}`).subscribe(Data => {
        this.Ntracto = Data;
        resolve();
      }, err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: 'ERROR EN EL SERVIDOR. comunicate con sistemas',
          showConfirmButton: true
        });
        reject()
      });
    });
  }


  alertnoExiste() {
    Swal.fire({
      title: 'Error!',
      text: 'Unidad no encontrada',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

}