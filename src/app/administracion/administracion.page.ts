import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ActualizarArtPage } from '../actualizar-art/actualizar-art.page';
import { AgregarArtPage } from '../agregar-art/agregar-art.page';
import { ModalDescargarImgPage } from '../modal-descargar-img/modal-descargar-img.page';
import { AdministracionService } from '../Services/administracion.service';
import { ArticulosService } from '../Services/articulos.service';
import { BuscarService } from '../Services/buscar.service';
import { LoadingServiceService } from '../Services/loading-service.service';
import { Plugins, Filesystem, FilesystemDirectory } from '@capacitor/core';

const { Storage } = Plugins;
@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
})
export class AdministracionPage implements OnInit {

  Marca: any;
  Articulos: any;
  posicion = 0;
  reporte: any;
  primera = false;
  res: any;
  nombre: any;
  act_img: any;
  version: any;
  id_versiones: any;
  numero_version: any;
  f = new Date();
  d = this.f.getUTCDay();
  m = this.f.getUTCMinutes();
  s = this.f.getUTCSeconds();
  nombre_v = (`Version_${this.m}${this.s}${this.d}`);
  id_Actualizacion = parseInt(`${this.s}${this.m}${this.d}`);
  constructor(public loadingController: LoadingController,
    private Servicioadmin: AdministracionService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loading: LoadingServiceService,
    public serviciobuscar: BuscarService,
    public servicioarticulos: ArticulosService,

  ) {
    this.Articulos = [], this.reporte = []
    this.res = [];
  }

  ngOnInit() {
  }

  async Enviar_actualizacion() {
    await this.Servicioadmin.post_actualizacion(this.nombre_v, this.id_Actualizacion).then(async result => {
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
  async buscar() {
    this.loading.present();
    const ret = await Storage.get({ key: 'version' });
    this.version = JSON.parse(ret.value);
    this.servicioarticulos.getArticulos(this.Marca).then(
    
      (articulos) => {
        this.Articulos = this.servicioarticulos.articulo;
        this.serviciobuscar.act_img().then((result) => {
          this.act_img = this.serviciobuscar.actualizar.recordset[0];
          this.id_versiones = this.serviciobuscar.actualizar.recordset[0].id_Actualizacion;
          this.numero_version = this.serviciobuscar.actualizar.recordset[0].numero_version;
          this.primera = true;
          this.loading.dismiss();
          if (this.version === null) {
            var pos = 0
            this.revisar_act_img(pos);
          } else {
            if (this.version.version === this.act_img.numero_version) {
            } else {
              if (this.version.version != this.act_img.numero_version) {
                var pos = 1
                this.revisar_act_img(pos);
              }
            }
          }
        });
      },
      (error) => {
        alert(error)
      }
    )

  }
  async revisar_act_img(pos) {
    await Storage.set({
      key: 'version',
      value: JSON.stringify({
        version: this.numero_version
      })
    });
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Atención',
      message: 'Se encontro una Actualización de artículos',
      buttons: [
        {
          text: 'Actualizar',
          handler: async (blah) => {
            const modal = await this.modalCtrl.create({
              mode: 'ios',
              component: ModalDescargarImgPage,
              componentProps: {
                id_versiones: this.id_versiones,
                numero_version: this.numero_version,
                pos: pos
              }
            });
            modal.onDidDismiss().then((Data) => { });
            return modal.present();
          }
        }
      ]
    });
    await alert.present();
  }




  editar(event) {
    const Moveritem = this.Articulos.recordset.splice(event.detail.from, 1)[0];
    this.Articulos.recordset.splice(event.detail.to, 0, Moveritem)
    event.detail.complete();
  }
  async Agregar(i) {
    const modal = await this.modalCtrl.create({
      mode: "ios",
      component: AgregarArtPage,
      componentProps: {
        posicion: i,
        Marca: this.Marca,
        tipo_estado: this.Articulos.recordset[i].tipo_estado,
        estado: this.Articulos.recordset[i].estado,
        id_ref_foto: this.Articulos.recordset[i].id_ref_foto,
        id_Actualizacion: this.id_Actualizacion,
      }
    });
    modal.onDidDismiss().then(async (Data) => {
      if (Data.data != 1) {
        this.loading.present();
        await this.guarda_local_img(Data)
        this.buscar_act();
      }
    });

    return modal.present();
  }
  async verificacion_foto(pos) {
    var id_foto = this.Articulos.recordset[pos].id_foto;
    if (id_foto != 0) {
      const alert = await this.alertCtrl.create({
        mode: "ios",
        header: 'Atención',
        message: 'No puedes eliminar esta imagen',
        buttons: [
          {
            text: 'salir',
            handler: async (blah) => {
            }
          }
        ]
      });
      await alert.present();

    } else {
      this.eliminararticulo(pos)
    }
  }

  async eliminararticulo(pos) {

    const alert = await this.alertCtrl.create({
      mode: "ios",
      header: 'Atención',
      message: '¿Estas seguro que quieres borrar este articulo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {

          }

        }, {
          text: 'Eliminar',
          handler: (blah) => {
            var id = this.Articulos.recordset[pos].id;
            var estado = 'N';
            this.loading.present();
            this.Servicioadmin.Delete_articulo(id, estado);
            this.Articulos.recordset.splice(pos, 1)
            this.loading.dismiss();
          }

        }]
    });
    await alert.present();

  }


  async actualizararticulo(pos) {
    const modal = await this.modalCtrl.create({
      component: ActualizarArtPage,
      componentProps: {
        mode: "ios",
        posicion: pos,
        nombre: this.Articulos.recordset[pos].nombre,
        Marca: this.Marca,
        Ubicacion: this.Articulos.recordset[pos].ubicacion,
        tipo_estado: this.Articulos.recordset[pos].tipo_estado,
        id: this.Articulos.recordset[pos].id,
        nombre_imagen: this.Articulos.recordset[pos].nombre_imagen,
        id_ref_foto: this.Articulos.recordset[pos].id_ref_foto,
        id_Actualizacion: this.id_Actualizacion,
      }

    });
    modal.onDidDismiss().then(async (data) => {
      if (data.data != 1) {
        this.loading.present();
        await this.guarda_local_img(data)
        this.buscar_act();
      }
    });
    return modal.present();
  }
  buscar_act() {
    this.servicioarticulos.getArticulos(this.Marca).then((articulos) => {
      this.Articulos = this.servicioarticulos.articulo;
      this.loading.dismiss();
    })
  }

  async guarda_local_img(data) {
    const fileName = data.data.nombre_imagen + '.jpeg';
    const base64Data = data.data.img;
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Documents
    });
    this.loading.dismiss();
  }


  Guardar() {
    this.loading.present();
    for (let art of this.Articulos.recordset) {
      let acomodo = {
        id: art.id,
        posicion: this.posicion,
      }
      this.posicion++;
      this.reporte.push(acomodo);
    }
    this.Servicioadmin.Put_modal_articulo(this.reporte)
    setTimeout(() => {
      this.loading.dismiss();
    }, 2000);
  }


}