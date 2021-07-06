import { Component, Input, OnInit } from '@angular/core';
import { BuscarService } from '../Services/buscar.service';
import { Plugins, CameraResultType, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { LoadingServiceService } from '../Services/loading-service.service';
import { AlertController, ModalController } from '@ionic/angular';
const {  Filesystem, Storage } = Plugins;
@Component({
  selector: 'app-modal-descargar-img',
  templateUrl: './modal-descargar-img.page.html',
  styleUrls: ['./modal-descargar-img.page.scss'],
})
export class ModalDescargarImgPage implements OnInit {
  @Input() id_versiones;
  @Input() numero_version;
  @Input() pos;
  articulo: any;
  terminado = false;
  progress = 0.0;

  constructor(
    public serviciobuscar: BuscarService,
    private loading: LoadingServiceService,
    private modalController: ModalController,
    private alertCtrl: AlertController,
  ) {

  }

  ngOnInit() {
    if (this.pos === 0) {
      this.progress = 0.1;
      this.todas_img()
    }
    if (this.pos === 1) {
      this.progress = 0.1;
      this.datos()
    }

  }
  async todas_img() {
    this.progress = 0.2
   await this.serviciobuscar.traer_todas_las_img().then(result => {
      this.articulo = this.serviciobuscar.act_todo_img;
    });
    setTimeout(() => {
      this.progress = 0.3
      this.imgdata()
    }, 2000);
  }
  async datos() {
    this.progress = 0.2
    await this.serviciobuscar.traerimg(this.id_versiones).then(result => {
      this.articulo = this.serviciobuscar.act_img_back;
    });
    setTimeout(() => {
      this.imgdata()
      this.progress = 0.3
    }, 2000);
  }
  async imgdata() {
    this.progress = 0.4
    setTimeout(async () => {  
      this.progress = 0.4
    for (let f of this.articulo.recordset) {
      var arrfotos = {
        id: f.id,
        nombre: f.nombre_imagen,
        foto: f.foto
      }
      const fileName = arrfotos.nombre + '.jpeg';
      const base64Data = arrfotos.foto
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: FilesystemDirectory.Documents
      });

    }
  }, 2000);
    setTimeout(() => {
    this.terminado = true;
    this.progress = 0.5
    this.actuaizarimg()
  }, 2000);
  }
  async actuaizarimg() {
    await Storage.set({
      key: 'version',
      value: JSON.stringify({
        version: this.numero_version
      })
    });
    this.progress += 100;
    var mensaje = 'Exito'
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'ActualizaciÓn Finalizada',
      message: `${mensaje}`,
      buttons: [
        {
          text: 'salir',
          handler: async (blah) => {
            this.modalController.dismiss();
          }
        }]
    });
    await alert.present();
  }
}