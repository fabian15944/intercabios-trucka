import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  url: string;
  articulos: any;
  Tipos: any;
  tipo_de_estado: any;
  mensaje: any;

  constructor(private http: HttpClient, private router: Router, private alertCtrl: AlertController) {
    this.url = environment.urlbackend,
      this.articulos = [],
      this.Tipos = []
  }

  Get_tipos_estado(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'admin/tipos_estados').subscribe(Data => {
        this.tipo_de_estado = Data;
        resolve();
      }, err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: 'ERROR EN EL SERVIDOR. comunicate con sistemas',
          footer: 'Trucka',
          showConfirmButton: true
        });
        reject()
      });
    });
  }


  put_articulo(id, nombre, ubicacion, foto, Tipo_estado, nombrefoto, posicion, id_Actualizacion, id_ref_foto) {
    return this.http.put(this.url + `admin/articulo`, {
      id,
      nombre,
      ubicacion,
      foto,
      nombrefoto,
      Tipo_estado,
      posicion,
      id_Actualizacion,
      id_ref_foto
    }).subscribe(
      data => {
      }, error => {
        console.log(error);
      }
    )
  }
  Delete_articulo(id, estado) {
    this.http.delete(this.url + `admin/${id}/${estado}`).subscribe(Data => {
    }, error => {
      console.log(error);
    }
    )
  }

  Put_modal_articulo(orden) {
    return this.http.put(this.url + `nuevo_reporte/orden`, {
      orden
    }).subscribe(
      data => {
      }, error => {
        console.log(error);
      }
    )
  }


  post_articulo(Marca, Ubicacion, nombre, posicion, estado, foto, Tipo_estado, nombre_img, id_Actualizacion, id_ref_foto, foto_id) {
    return this.http.post(this.url + 'nuevo_reporte', {
      Marca,
      Ubicacion,
      nombre,
      posicion,
      estado,
      foto,
      Tipo_estado,
      nombre_img,
      id_Actualizacion,
      id_ref_foto,
      foto_id

    }).subscribe(
      data => {
      }, error => {
        console.log(error);
      }
    )
  }




  //Apartados de estados

  post_estado(Arraytipo) {
    return this.http.post(this.url + `nuevo/Tipo_estado`, {
      Arraytipo

    }).subscribe(
      data => {
      }, error => {
        console.log(error);
      }
    )
  }
  post_actualizacion(nombre_v, array_img): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.http.post(this.url + `versiones_fotos`, {
        nombre_v,
        array_img
      }).subscribe(res => {
        this.mensaje = res;
        resolve();
      }, error => {
        alert(error);
        reject();
      }
      )
    });
  }


  put_estado(id, Tipo_estado, valor1, valor2, valor3, valor4) {
    return this.http.put(this.url + 'actualizar/Tipo_estado', {
      id, Tipo_estado, valor1, valor2, valor3, valor4
    }).subscribe(
      data => {
        console.log(data);
      }, error => {
        console.log(error);

      }
    )
  }


}
