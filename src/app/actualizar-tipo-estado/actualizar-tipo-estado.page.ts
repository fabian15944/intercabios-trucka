import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdministracionService } from '../Services/administracion.service';
import { LoadingServiceService } from '../Services/loading-service.service';


@Component({
  selector: 'app-actualizar-tipo-estado',
  templateUrl: './actualizar-tipo-estado.page.html',
  styleUrls: ['./actualizar-tipo-estado.page.scss'],
})
export class ActualizarTipoEstadoPage implements OnInit {

  @Input() Tipo_estado;
  @Input() id;
  @Input() valor1;
  @Input() valor2;
  @Input() valor3;
  @Input() valor4;
  constructor(private actualizarestado: AdministracionService,
    private modalController: ModalController,
    private loading: LoadingServiceService,
  ) { }

  ngOnInit() {
  }
  Guardar() {
    this.loading.present();
    this.actualizarestado.put_estado(this.id, this.Tipo_estado, this.valor1, this.valor2, this.valor3, this.valor4)
    setTimeout(() => {
      this.loading.dismiss();
      this.modalController.dismiss();
    }, 2000);
  }

}