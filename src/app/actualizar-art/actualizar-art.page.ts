import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AdministracionService } from '../Services/administracion.service';
import { Plugins, CameraResultType, CameraOptions, CameraSource, Filesystem, FilesystemDirectory } from '@capacitor/core';
import { LoadingServiceService } from '../Services/loading-service.service';
const { Camera } = Plugins;

@Component({
  selector: 'app-actualizar-art',
  templateUrl: './actualizar-art.page.html',
  styleUrls: ['./actualizar-art.page.scss'],
})
export class ActualizarArtPage implements OnInit {
  @Input() nombre;
  @Input() Marca;
  @Input() Ubicacion;
  @Input() tipo_estado;
  @Input() id;
  @Input() posicion;
  @Input() nombre_imagen;
  @Input() id_ref_foto;
  @Input() id_Actualizacion;
  @Input() nombre_v;
  numero: number;
  valor1: any;
  valor2: any;
  valor3: any;
  valor4: any;
  estado_tipos: any;
  tipo: any;
  tipo1: any;
  tipo2: any;
  id_Tipo_estado: any;
  arraytipos: any;
  Tipo: any;
  primera = false;
  mostrar = true;
  nuevaimg = false;
  base64Image: any;
  img: any;
  con_id_tipo: any;
  foto: any;
  constructor(
    public loadingController: LoadingController,
    private modalController: ModalController,
    private administracion: AdministracionService,
    public actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private loading: LoadingServiceService,
  ) {
    this.img = '';
    this.id_Tipo_estado = '';
    this.con_id_tipo = ''
    this.estado_tipos = [];
    this.arraytipos = [];

  }

  ngOnInit() {
    this.estado_tipo();
    this.fileRead()
  }

  async fileRead() {
    this.loading.present();
    let contents = await Filesystem.readFile({
      path: `/${this.nombre_imagen}.jpeg`,
      directory: FilesystemDirectory.Documents,
      // encoding: FilesystemEncoding.UTF8
    });

    this.foto = `data:image/jpeg;base64,${contents.data}`;
    this.loading.dismiss();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Completar accion con',
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
          this.fotoGaleria();
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
            this.img = '';
            (<HTMLInputElement>document.getElementById('img')).src = 'assets/addImage.png';

          }

        }]
    });
    await alert.present();

  }


  async quitarImagen() {
    this.img = '';
    (<HTMLInputElement>document.getElementById('img')).src = 'assets/images/mp-image.png';

  }

  // hacer foto con capacitor funciona solo para generar una version web o una pwa
  async hacerFoto() {
    this.mostrar = false;
    const images = {
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    }
    await Camera.getPhoto(images).then(imgdata => {
      this.img = 'data:image/jpeg;base64,' + imgdata.base64String;
      this.nuevaimg = true;

    },
      (err) => {
        alert(err)
      });
  }
  async fotoGaleria() {
    this.mostrar = false;
    const images = {
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      CameraSource: 'PHOTOS'
    }
    await Camera.getPhoto(images).then(imgdata => {
      this.img = 'data:image/jpeg;base64,' + imgdata.base64String;
      this.numero = Math.random() * (1000 - 1) + 1;
      this.nuevaimg = true;

    },
      (err) => {
        alert(err)
      });
  }
  Guardar() {
    if (this.img === '' && this.con_id_tipo === '') {
      this.loading.present();
      let con_actualizacion = ''
      this.administracion.put_articulo(this.id, this.nombre, this.Ubicacion, this.img, this.con_id_tipo, this.nombre_imagen, this.posicion, con_actualizacion, this.id_ref_foto)
      setTimeout(() => {
        this.loading.dismiss();
        this.modalController.dismiss();
      }, 2000)
    }
    if (this.con_id_tipo === '' && this.img != '') {
      this.alert_img()
    }
    if (this.con_id_tipo != '' && this.img === '') {
      let con_actualizacion = ''
      this.administracion.put_articulo(this.id, this.nombre, this.Ubicacion, this.img, this.id_Tipo_estado, this.nombre_imagen, this.posicion, con_actualizacion, this.id_ref_foto)
      this.loading.present();
      setTimeout(() => {
        this.loading.dismiss();
        this.modalController.dismiss();
      }, 2000)
    }
    if (this.con_id_tipo != '' && this.img !== '') {
      this.alert_img()
    }
  }

  estado_tipo() {
    this.loading.present();
    this.administracion.Get_tipos_estado().then(res => {
      this.estado_tipos = this.administracion.tipo_de_estado
      for (let tipo of this.estado_tipos.recordset) {
        if (tipo.Tipo_estado === this.tipo_estado) {
          this.id_Tipo_estado = tipo.id
          this.valor1 = tipo.valor1;
          this.valor2 = tipo.valor2;
          this.valor3 = tipo.valor3;
          this.valor4 = tipo.valor4;
        }
      }
    })
    this.loading.dismiss();
    this.primera = true;
  }
  CambioTipo() {
    this.con_id_tipo = 'SI';
    for (let tipo of this.estado_tipos.recordset) {
      if (tipo.Tipo_estado === this.tipo_estado) {
        this.id_Tipo_estado = tipo.id
        this.valor1 = tipo.valor1;
        this.valor2 = tipo.valor2;
        this.valor3 = tipo.valor3;
        this.valor4 = tipo.valor4;
      }
    }
  }

  salir() {
    var r = 1
    this.modalController.dismiss(r);
  }

  async alert_img() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Atencion',
      message: 'Se detecto relación con algunas imágenes ¿Deseas remplazar la imagen para todas las de más?',
      buttons: [
        {
          text: 'Cancelar',
          handler: async (blah) => {
            console.log('Cancelado')
          }

        },
        {
          text: 'Aceptar',
          handler: async (blah) => {
            this.loading.present();
            var res = {
              nombre_imagen: this.nombre_imagen,
              img: this.img
            }
            this.administracion.put_articulo(this.id, this.nombre, this.Ubicacion, this.img, this.con_id_tipo, this.nombre_imagen, this.posicion, this.id_Actualizacion, this.id_ref_foto)
            setTimeout(() => {
              this.loading.dismiss()
              this.modalController.dismiss(res);
            }, 3000)
          }

        }
      ]
    });
    await alert.present();
  }

}
