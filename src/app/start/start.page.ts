import { LoadingServiceService } from './../Services/loading-service.service';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { ReporteService } from '../Services/reporte.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  start: any;
  busqueda;

  constructor(public servicioreportes: ReporteService,
    private router: Router,
    public loadingController: LoadingController,
    private menu: MenuController,
    private loading: LoadingServiceService

  ) { this.start = []; }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.loading.present();
    this.servicioreportes.tarjetas().then(res => {   
      this.start = this.servicioreportes.start;
      this.loading.dismiss();
    })
  }

  Historial(posicion) {
    this.loading.present();
      let navParams: NavigationExtras = {
      queryParams: {
        id: this.start.recordset[posicion].id
      }
    }

    this.router.navigate(['historial-reportes'], navParams);
    this.loading.dismiss();
  }


  doRefresh(event) {
    this.loadData()
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
}
