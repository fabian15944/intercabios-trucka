
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { AdministracionService } from '../Services/administracion.service';
import { Plugins, CameraResultType } from '@capacitor/core';
import { LoadingServiceService } from '../Services/loading-service.service';
import { ArticulosService } from '../Services/articulos.service';


const { Camera } = Plugins;

@Component({
  selector: 'app-nuevainspeccion',
  templateUrl: './nuevainspeccion.page.html',
  styleUrls: ['./nuevainspeccion.page.scss'],
})

export class NuevainspeccionPage implements OnInit {
  nombre: any;
  Marca: any;
  Ubicacion: any;
  tipo_estado: any;
  estado_tipos: any;
  arr_Tipo_estados: any;
  img: any;
  validar_valores = true;
  valor1: any;
  valor2: any;
  valor3: any;
  valor4: any;
  validar_foto = true;
  mostrar = false;
  id_Tipo_estado: any;
  ver = true;
  ocultar = false;
  posicion = 0;
  estado = 'S';
  Articulos: any;
  nombre_foto: string;
  con_foto: any;
  id: number;
  f = new Date();
  d = this.f.getUTCDay();
  m = this.f.getUTCMinutes();
  s = this.f.getUTCSeconds();
  nombre_v = (`Version_${this.m}${this.s}${this.d}`);
  id_Actualizacion = parseInt(`${this.s}${this.m}${this.d}`);
  id_ref_foto: any;

  constructor(public loadingController: LoadingController,
    private serviceadmin: AdministracionService,
    public actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private Servicioadmin: AdministracionService,
    private loading: LoadingServiceService,
    public servicioarticulos: ArticulosService,
  ) {
    this.estado_tipos = [];
    this.img = [];
    this.Articulos = [];
    this.arr_Tipo_estados = [];
  }

  ngOnInit() {
    this.estado_tipo();

  }
  doRefresh(event) {
    this.estado_tipo();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  estado_tipo() {
    this.loading.present();
    this.serviceadmin.Get_tipos_estado().then(async res => {
      this.estado_tipos = this.serviceadmin.tipo_de_estado.recordset
    })
    setTimeout(() => {
      this.loading.dismiss()
    }, 2000);

  }

  async CambioTipo() {
    this.validar_valores = false;
    for (let tipo of this.estado_tipos) { 
      if(tipo.Tipo_estado === this.tipo_estado){
        this.id_Tipo_estado = tipo.id
        this.valor1 = tipo.valor1;
        this.valor2 = tipo.valor2;
        this.valor3 = tipo.valor3;
        this.valor4 = tipo.valor4;
      }
    }
  }



  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Completar con',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camara',
        icon: 'camera',
        handler: () => {
          console.log('Share clicked');
          this.hacerFoto();
        }
      }, {
        text: 'Galeria',
        icon: 'image',
        handler: () => {
          console.log('Favorite clicked');
          this.hacerFoto();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  async eliminarImagen() {
    const alert = await this.alertCtrl.create({
      header: 'Atención',
      message: '¿Estas seguro que quieres borrar esta imagen?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {

          }

        }, {
          text: 'Eliminar',
          handler: (blah) => {
            this.img = '';
            (<HTMLInputElement>document.getElementById('img')).src = 'assets/addImage.png';

          }

        }]
    });
    await alert.present();

  }
  // Prueba
  // hacer foto con capacitor funciona solo para generar una version web o una pwa
  async hacerFoto() {
    this.validar_foto = false;
    this.mostrar = true;
    const images = {
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    }
    await Camera.getPhoto(images).then(imgdata => {
      this.img = 'data:image/jpeg;base64,' + imgdata.base64String;
      this.id = Math.random() * (1000 - 1) + 1;
      this.nombre_foto = `${this.Marca}-${this.Ubicacion}-${this.id}`;
      this.con_foto = 'SI';
      (<HTMLInputElement>document.getElementById('img')).src = this.img;

    },
      (err) => {
        alert(err);
      });

  }

  validar() {
    if (this.Ubicacion === '') {
      this.alertNull('La Ubicacion puede ser vacia')
    }
    if (this.nombre === '') {
      this.alertNull('El nombre no puede ser vacio')
    } else {
      this.Guardar()
    }
  }


  Guardar() {
    this.ver = false;
    this.loading.present();
    if (this.con_foto === 'SI') {
      var fecha = new Date();
      var dia = fecha.getUTCDay();
      var min = fecha.getUTCMinutes();
      var seg = fecha.getUTCSeconds();
      var id_foto = parseInt(`${dia}${min}${seg}`);
      this.id_ref_foto = id_foto;
      this.serviceadmin.post_articulo(this.Marca, this.Ubicacion, this.nombre, this.posicion, this.estado, this.img, this.id_Tipo_estado, this.nombre_foto, this.id_Actualizacion, this.id_ref_foto, id_foto)
      this.buscar_en_articulos();
    }
    if (this.con_foto === 'NO') {
      var img = '';
      var id_Actualizacion = '';
      var foto_id = '';
      this.serviceadmin.post_articulo(this.Marca, this.Ubicacion, this.nombre, this.posicion, this.estado, img, this.id_Tipo_estado, this.nombre_foto, id_Actualizacion, this.id_ref_foto, foto_id)
      this.buscar_en_articulos();
    }
    this.con_foto = 'NO';
  }

  Enviar_actualizacion() {
    this.serviceadmin.post_actualizacion(this.nombre_v, this.id_Actualizacion).then(async result => {
      var mensaje = this.Servicioadmin.mensaje.mensaje
      const alert = await this.alertCtrl.create({
        mode: "ios",
        header: 'Atención',
        message: `${mensaje}`,
        buttons: [
          {
            text: 'salir',
            handler: async (blah) => {
            }
          }
        ]
      });
      await alert.present();
    })
  }



  buscar_en_articulos() {
    this.posicion++;
    this.ocultar = true;

    //  (<HTMLInputElement>document.getElementById('ubicacionvalue')).value = '';
    (<HTMLInputElement>document.getElementById('nombrevalue')).value = '';
    setTimeout(() => {
      this.buscar();
    }, 2000);

  }

  buscar() {
    this.servicioarticulos.getArticulos(this.Marca).then((articulos) => {
      this.Articulos = this.servicioarticulos.articulo;
      this.loading.dismiss();
    },
      (error) => {
        console.error('Entro a error', error);

      }
    )

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
