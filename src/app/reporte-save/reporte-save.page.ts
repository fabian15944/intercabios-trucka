import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSlides, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../Services/reporte.service';
import Swal from 'sweetalert2';
import { Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';
import { LoadingServiceService } from '../Services/loading-service.service';
const { Storage, Camera,Filesystem,Network } = Plugins;

@Component({
  selector: 'app-reporte-save',
  templateUrl: './reporte-save.page.html',
  styleUrls: ['./reporte-save.page.scss'],
})
export class ReporteSavePage implements OnInit {
  trailer: any;
  conductor: any;
  longitudImagenes = 0;
  posicion = 0;
  save_reporte_storage = 0;
  terminado = false;
  TomarFoto = false;
  imgmostrar = true;
  articulo: any;
  reporte: any;
  ubicacion: any;
  encargado: any;
  sucursal: any;
  primera = false;
  Marca: any;
  tcm:any;
  nom_img:any;
  foto_1:any;
  igual_foto : any;
  fechaM = moment().format('DD/MM/YYYY HH:mm')
  @ViewChild('slides') slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
   
  };
  constructor(
        private routerActivated: ActivatedRoute,
        public http: HttpClient,
        public servicioreportes: ReporteService,
        private alertCtrl: AlertController,
        public loadingController: LoadingController,
        private loading: LoadingServiceService,
  ) { 
    this.trailer = this.routerActivated.snapshot.queryParams.trailer;
    this.Marca = this.routerActivated.snapshot.queryParams.Marca;
    this.conductor = this.routerActivated.snapshot.queryParams.conductor;
  }

  ngOnInit() {
   this.Get_Reporte();
  }


  async Get_Reporte(){
    
    this.loading.present();
    const ret = await Storage.get({ key: 'reporte-save' });
    const report = JSON.parse(ret.value);
    this.reporte =  report.reporte;
  
    for(let i of this.reporte){
       if(i.estado !== ''){
      this.posicion ++;
       }
    }
    setTimeout(() => {
      this.fileRead();
    }, 2000);
  }

  async fileRead() {
    let contents = await Filesystem.readFile({
      path: `/${this.reporte[this.posicion].nombre_imagen}.jpeg`,
      directory: FilesystemDirectory.Documents,
      // encoding: FilesystemEncoding.UTF8
    });
    this.foto_1 = `data:image/jpeg;base64,${contents.data}`;
    setTimeout(() => {
      this.loading.dismiss();
      this.primera= true;
      this.getLocalData();
    }, 1000);
  }
  async getLocalData() {   
    const ret = await Storage.get({ key: 'user' });
    const user = JSON.parse(ret.value);
    this.encargado = user.nombre;
    this.sucursal = user.sucursal;
  }

  siguiente() { 
    
    let tope = this.reporte.length - 1;   
    if (this.posicion === tope) {
      this.primera = false;
      this.imgmostrar = false;
      this.ReporteTerminado();
      this.terminado = true;
    } if (this.reporte[this.posicion].estado === ''){
      this.alertNull('Aún no has seleccionado el estado');
    }
    else {
      if (this.reporte[this.posicion].estado === 'Dañado') {
        if (this.reporte[this.posicion].valor === '') {
          this.alertNull('Selecciona el daño encontrado')
        }
        else {
          if (this.reporte[this.posicion].imagen.length === 0) {
            this.alertNull('Falta la imagen')
          }
          else {
            if (this.reporte[this.posicion].comentario === '') {
              this.alertNull('Falta el comentario')

            }
            else {
              this.save_reporte_storage = this.save_reporte_storage + 1;
              this.posicion = this.posicion + 1;
              this.Función();
   
            }
          }
        }
      } else { 
        this.save_reporte_storage = this.save_reporte_storage + 1;
        this.posicion = this.posicion + 1;
        this.Función();
      }
    }
  }
  async Función() {
    if (this.imgmostrar === false) {
          console.log('Terminado')
        }else{
             if(this.save_reporte_storage === 25){
                 const loading = await this.loadingController.create({message: 'Guardando Avance, Por Favor Espere ...'});
                 await loading.present();
                 await Storage.set({
                 key: 'reporte-save',
                 value: JSON.stringify({
                 reporte: this.reporte
                                      })
                                   });
                 this.save_reporte_storage = 0;
                 loading.dismiss()
            }
            if(this.nom_img === this.reporte[this.posicion].nombre_imagen){
                 this.foto_1 = this.igual_foto;
            }else{
              let contents = await Filesystem.readFile({
                path: `/${this.reporte[this.posicion].nombre_imagen}.jpeg`,
                directory: FilesystemDirectory.Documents,
                                                       });
                this.foto_1 = `data:image/jpeg;base64,${contents.data}`; 
                this.igual_foto = this.foto_1;
                this.nom_img = this.reporte[this.posicion].nombre_imagen
             }
          }
    }
anterior() {
  this.posicion = this.posicion - 1;  
  this.save_reporte_storage = this.save_reporte_storage - 1;
  this.Función();  
}

async enviar() {
  const loading = await this.loadingController.create();
  await loading.present();  
let status = await Network.getStatus();
    let EnvReporte = {
      num_unidad: this.trailer,
      Marca: this.Marca,
      operador: this.conductor,
      sucursal: this.sucursal,
      encargado: this.encargado,
      reporte: this.reporte,
      fecha: this.fechaM 
    } 
      loading.dismiss();     
      this.servicioreportes.postReporte(EnvReporte,status)    
  
}


async eliminarImagen(pos) {
  const alert = await this.alertCtrl.create({
    header: 'Atención',
    message: '¿Seguro que quieres borrar esta imagen?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: (blah) => {
         
        }

      }, {
        text: 'Eliminar',
        handler: (blah) => {
        
          this.reporte[this.posicion].imagen.splice(pos, 1);
          this.longitudImagenes = this.reporte[this.posicion].imagen.length;
        }

      }]
  });
  await alert.present();

}

// alerta que se dispara cuando se quiere tomar mas de 3 imagenes
async alertaImg() {
  const alert = await this.alertCtrl.create({
    header: 'Atención',
    message: 'El numero limite de imágenes es de 3',
    buttons: [
      , {
        text: 'Aceptar',
        handler: (blah) => {
        
        }

      }]
  });
  await alert.present();
}


//hacer foto con capacitor funciona solo para generar una version web o una pwa
 async  hacerFoto() {
  if(this.reporte[this.posicion].imagen.length === 3){
      this.alertaImg();
      }else{
  const images = {
    quality: 90,
    allowEditing: false,
    CameraSource: 'CAMERA',
    resultType: CameraResultType.Base64,
  }
  await  Camera.getPhoto(images).then(imgdata => {
    let img = 'data:image/jpeg;base64,' + imgdata.base64String
    this.reporte[this.posicion].imagen.push(img);
    this.longitudImagenes = this.reporte[this.posicion].imagen.length;

  }, (err) => {
        console.log(err);
      });
}
}
// alerta que se disparan cuando finaliza el reporte 
ReporteTerminado() {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Reporte Finalizado',
    text: 'Guardando...',
    showConfirmButton: true
  });
  this.enviar()
}


async alertNull(mensaje) {
  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: '!Atención',
    message: mensaje,
    buttons: [
      {
        text: 'ok',
        role: 'cancel',
        handler: (blah) => {
         
        }

      }]
  });
  await alert.present();
}

checarEstado() {
 
  if (this.reporte[this.posicion].estado === 'Buen Estado' || this.reporte[this.posicion].estado === 'No Existe') {
    this.reporte[this.posicion].valor = '';
    this.reporte[this.posicion].comentario = '';
    this.reporte[this.posicion].imagen = [];
  }
}
































}
