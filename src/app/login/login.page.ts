import { LoadingServiceService } from './../Services/loading-service.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../Services/login.service';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Storage} = Plugins;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  slidesOptions = {
    // slidesPerView: 1.5 
  }
  

  @ViewChild('passwordEyeRegister, { read: ElementRef }') passwordEye: ElementRef;
  // Seleccionamos el elemento con el nombre que le pusimos con el #
  passwordTypeInput = 'password';
  usuario: string;
  password: string;
arry:any;
hasWriteAccess: boolean = false;
  encargado: any;
  sucursal: any;
  correoValidacion= "";
  bool:boolean;
  res_tipos: any;
  array_tipo: any;
  Grupo: any;
  
  constructor(
    public login: LoginService, 
    private router: Router,
    private loading: LoadingServiceService,
    public actionSheetController: ActionSheetController,
    private Platform: Platform,
    ) {
    this.usuario = '',
      this.password = ''
      this.res_tipos = [];
      this.array_tipo = [];
      this.arry=[];
      this.Platform.ready().then(() =>{
       this.loading.present();
       setTimeout(async () => {         
        const ret = await Storage.get({ key: 'user' });
        const user = JSON.parse(ret.value);    
        if(user === null){
          console.log('Login');
          this.loading.dismiss();
        }else{
          this.Grupo = user.Grupo; 
        if(this.Grupo === 'VIGIL'){
          this.loading.dismiss();
          this.alerta();
            this.router.navigate(['busqueda']);         
          } 
          else {
            this.loading.dismiss();
            this.alerta();
            this.router.navigate(['inicio-administracion']);
          }
        }
      }, 4000);
      });

  }
 
  logear() {
    if (this.usuario === '' || this.password === '') {
      this.NoUser()
    } else {
      this.login.Logear(this.usuario, this.password)
    }
    
  }



  NoUser() {
    Swal.fire({
      title: 'Atencion!',
      text: 'Ingreza tu usuario y contraseña',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
    this.router.navigate(['login']);
  }



  togglePasswordMode() {
    //cambiar tipo input
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    //obtener el input
    const nativeEl = this.passwordEye.nativeElement.querySelector('input');
    //obtener el indice de la posición del texto actual en el input
    const inputSelection = nativeEl.selectionStart;
    //ejecuto el focus al input
    nativeEl.focus();
    //espero un milisegundo y actualizo la posición del indice del texto
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);

  }


  ngOnInit() {
  }

  alerta(){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Bienvenido',
      showConfirmButton: false,
      timer: 1500
    });
  }
  

}
