import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { ArticulosService } from '../Services/articulos.service'
import { AlertController, LoadingController } from '@ionic/angular';
import { ReporteService } from '../Services/reporte.service';
import { IonSlides } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { LoadingServiceService } from '../Services/loading-service.service';
import { Plugins, CameraResultType, FilesystemDirectory, CameraSource } from '@capacitor/core';
const { Camera, Filesystem, Storage, Network } = Plugins;


@Component({
  selector: 'app-nuevo-reporte',
  templateUrl: './nuevo-reporte.page.html',
  styleUrls: ['./nuevo-reporte.page.scss'],
})
export class NuevoReportePage implements OnInit {
  imgmostrar = true;
  trailer: any;
  Marca: any
  conductor: any;
  longitudImagenes = 0;
  posicion = 0;
  save_reporte_storage = 0;
  terminado = false;
  TomarFoto = false;
  articulo: any;
  reporte: any;
  arrImagenes: any;
  ubicacion: any;
  encargado: any;
  sucursal: any;
  primera = false;
  inicio = false;
  Savereporte: any;
  foto_1: any;
  igual_foto : any;
  nom_img:any;
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
    public servicioarticulos: ArticulosService,
    public servicioreportes: ReporteService,
    private alertCtrl: AlertController,
    private loading: LoadingServiceService,
    private loadingController: LoadingController,
  ) {
    this.trailer = this.routerActivated.snapshot.queryParams.trailer;
    this.Marca = this.routerActivated.snapshot.queryParams.Marca;
    this.conductor = this.routerActivated.snapshot.queryParams.conductor;
    this.articulo = []
    this.reporte = [];
    this.Savereporte = [];
    this.arrImagenes = [];
  }


  ngOnInit() {
   this.GetArticulos();
  }

  // mando llamar un componente de los servicios y despues me trae todos los articulos que hay en la base de datos
  GetArticulos() {
    this.loading.present();
    this.servicioarticulos.getArticulos(this.Marca).then(
      (Data) => {
        this.articulo = this.servicioarticulos.articulo;
      },
      (error) => {
        console.error('Entro a error', error);
      }
    ).then(res => {
      this.editarArray();
     
    });

  }
  //Una funcion la cual va generando un nuevo array el cual se va a mandar en el reporte
  async editarArray() {
    for (let art of this.articulo.recordset) {
      let articulo = {
        id: art.id,
        nombre: art.nombre,
        ubicacion: art.ubicacion,
        comentario: '',
        imagen: [],
        estado: '',
        nombre_imagen: art.nombre_imagen,
        valor1: art.valor1,
        valor2: art.valor2,
        valor3: art.valor3,
        valor4: art.valor4
      }
      this.reporte.push(articulo);
    }
      this.fileRead();
  }
  async getuser() {
    const ret = await Storage.get({ key: 'user' });
    const user = JSON.parse(ret.value)
    this.encargado = user.nombre;
    this.sucursal = user.sucursal;
  }
  async fileRead() {
    let contents = await Filesystem.readFile({
      path: `/${this.reporte[this.posicion].nombre_imagen}.jpeg`,
      directory: FilesystemDirectory.Documents,
      // encoding: FilesystemEncoding.UTF8
    });
    this.foto_1 = `data:image/jpeg;base64,${contents.data}`;
    this.getuser().then(result =>{
      this.loading.dismiss();
      this.primera = true;
    }) 
  }


  // se manda llamar al momento de avanzar al nuevo articulo antes de moverte hace algunas validaciones
  siguiente() {  
    let tope = this.reporte.length - 1;
    if (this.posicion === tope) {
      this.primera = false;
      this.imgmostrar = false;
      this.ReporteTerminado();
      this.terminado = true;

    }
    if (this.reporte[this.posicion].estado === '') {
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
    }
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



  // funcion para retroceder entre los articulos
  anterior() {
    this.posicion = this.posicion - 1;
    this.save_reporte_storage = this.save_reporte_storage - 1;
    this.Función();
  }

  // manda la variable EnvReporte al backend que contiene todos los datos del reporte
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
    // console.log(EnvReporte);
    this.servicioreportes.postReporte(EnvReporte, status)
  }

  // se ejecuta cuando es buen estado o no existe es la primer funcion que entra y verifica los estados
  checarEstado() {
    if (this.reporte[this.posicion].estado === 'Buen Estado' || this.reporte[this.posicion].estado === 'No Existe') {
      this.reporte[this.posicion].valor = '';
      this.reporte[this.posicion].comentario = '';
      this.reporte[this.posicion].imagen = [];
    }
  }


  // funcion para eliminar la imagen le paso la posicion de la imagen en la variable pos
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
  async hacerFoto() {
    if (this.reporte[this.posicion].imagen.length === 3) {
      this.alertaImg();
    } else {
      const images = {
        quality: 90,
        allowEditing: false,
        CameraSource: 'CAMERA',
        resultType: CameraResultType.Base64,
      }
      await Camera.getPhoto(images).then(imgdata => {
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
      title: 'Reporte Finalizado.',
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




}


