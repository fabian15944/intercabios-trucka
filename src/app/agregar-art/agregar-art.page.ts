import { Component, Input, OnInit } from '@angular/core';
import { CameraResultType, Plugins, CameraOptions, } from '@capacitor/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AdministracionService } from '../Services/administracion.service';
import { LoadingServiceService } from '../Services/loading-service.service';

const { Camera } = Plugins;
@Component({
  selector: 'app-agregar-art',
  templateUrl: './agregar-art.page.html',
  styleUrls: ['./agregar-art.page.scss'],
})
export class AgregarArtPage implements OnInit {

  Ubicacion: any;
  nombre: any;
  @Input() tipo_estado;
  @Input() Marca;
  @Input() estado;
  @Input() posicion;
  @Input() id_ref_foto;
  @Input() id_Actualizacion;
  valor1: any
  img: any;
  valor2: any;
  valor3: any;
  valor4: any;
  id_Tipo_estado: any;
  estado_tipos: any;
  primera = true;
  fecha: any;
  id: number;
  validar_foto = true;
  mostrar = false;
  con_foto: any;
  nombre_foto: String;
  con_actualizacion: any;
  constructor(public loadingController: LoadingController,
    private modalController: ModalController,
    private tiposestado: AdministracionService,
    private serviceadmin: AdministracionService,
    public actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private loading: LoadingServiceService,
  ) {
    this.estado_tipos = [];
    this.img = [];
  }

  ngOnInit() {
    this.estado_tipo()

  }
  estado_tipo() {
    this.loading.present();
    this.tiposestado.Get_tipos_estado().then(res => {
      this.estado_tipos = this.tiposestado.tipo_de_estado
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
    setTimeout(() => {
      this.loading.dismiss()
      this.primera = true
    }, 2000);

  }


  CambioTipo() {
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



  Guardar() {
    this.loading.present();
    var fecha = new Date();
    var dia = fecha.getUTCDay();
    var min = fecha.getUTCMinutes();
    var seg = fecha.getUTCSeconds();
    var id_foto = parseInt(`${dia}${min}${seg}`);
    this.id_ref_foto = id_foto;
    var res = {
      nombre_imagen: this.nombre_foto,
      img: this.img
    }
    this.serviceadmin.post_articulo(this.Marca, this.Ubicacion, this.nombre, this.posicion, this.estado, this.img, this.id_Tipo_estado, this.nombre_foto, this.id_Actualizacion, this.id_ref_foto, id_foto)
    setTimeout(() => {
      this.loading.dismiss();
      this.modalController.dismiss(res)
    }, 2000);
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
      (<HTMLInputElement>document.getElementById('img')).src = this.img;

    },
      (err) => {
        alert(err);
      });

  }




  salir() {
    var r = 1
    this.modalController.dismiss(r);
  }

}
