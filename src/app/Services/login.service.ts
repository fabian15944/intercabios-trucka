import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;




@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: string;
  user: any;
  sucursal: any;

  constructor(private http: HttpClient, private router: Router,
  ) {
    this.url = environment.urlbackend
    this.user = []
  }




  Logear(email, password): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'login', {
        email,
        password
      }).subscribe(res => {
        this.user = res;
        if (this.user.recordset.length === 0) {
          this.alertnoExiste();
        }
        if(this.user.recordset[0].Grupo === 'VIGIL'){
        this.setItem(res)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Bienvenido',
          showConfirmButton: false,
          timer: 1500
        });
          this.router.navigate(['busqueda']);
          resolve();
        } 
        else {
          this.setItem(res)
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Bienvenido',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['inicio-administracion']);
          resolve();
        }
      
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


  // guardando en storage
  async setItem(data) {
    console.log(data)
    await Storage.set({
      key: 'user',
      value: JSON.stringify({
        nombre: data.recordset[0].NOM_USER,
        sucursal: data.recordset[0].SUCURSAL,
        Grupo:  data.recordset[0].Grupo,
      })
    });

  }





  alertnoExiste() {
    Swal.fire({
      title: 'Error!',
      text: 'Usuario Y/O Contraseña Incorrecto',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }




}


