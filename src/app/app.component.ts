import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import {  Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Storage } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private menu: MenuController,
    private router: Router,
) { }
  openEnd() {
    this.menu.close('first');
      }
  async cerrar_sesion(){
    await Storage.remove({ key: 'user' }).then(res =>{
      this.router.navigate(['login']);
      this.menu.close('first');
    });

  }
}
