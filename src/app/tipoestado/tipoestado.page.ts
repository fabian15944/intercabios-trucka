import { LoadingServiceService } from './../Services/loading-service.service';
// import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ActualizarTipoEstadoPage } from '../actualizar-tipo-estado/actualizar-tipo-estado.page';
import { AdministracionService } from '../Services/administracion.service';


const API_STORAGE_KEY = 'Tipos'

@Component({
  selector: 'app-tipoestado',
  templateUrl: './tipoestado.page.html',
  styleUrls: ['./tipoestado.page.scss'],
})
export class TipoestadoPage implements OnInit {
  primera = false;
  estado_tipos: any;
  
  valor1: any;
  valor2: any;
  valor3: any;
  valor4: any;
  id_Tipo_estado:any;
  nombre:any;
  res_tipos: any;
  array_tipo: any;
  constructor( 
    private modalController: ModalController,
    private tiposestado: AdministracionService,
    public actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private loading: LoadingServiceService,
  
    private modalCtrl: ModalController)

     { 
      this.estado_tipos = [];
      this.valor1= '';
      this.valor2= '';
      this.valor3= '';
      this.valor4= '';
      this.res_tipos = [];
      this.array_tipo = [];
     }

  ngOnInit() {
    this.estado_tipo()
  }
 estado_tipo() { 
  this.loading.present();
    this.tiposestado.Get_tipos_estado().then( res => {
       this.res_tipos = this.tiposestado.tipo_de_estado;
       this.estado_tipos = this.res_tipos; 
       this.primera = true;
       this.loading.dismiss();
        

    })
  }

 async Guardar(){
  this.loading.present();
      var Arraytipo={
        nombre: this.nombre,
        valor1:this.valor1,
        valor2:this.valor2,
        valor3:this.valor3,
        valor4:this.valor4
      }
      this.tiposestado.post_estado(Arraytipo)
      setTimeout(() => {
        this.loading.dismiss();
       this.estado_tipo();
      
      }, 2000);
  
  }

  async actualizar_estado(pos){
  const modal = await this.modalCtrl.create({
    component: ActualizarTipoEstadoPage,
    componentProps: {  
      Tipo_estado: this.estado_tipos.recordset[pos].Tipo_estado,
      id: this.estado_tipos.recordset[pos].id,
      valor1: this.estado_tipos.recordset[pos].valor1,
      valor2: this.estado_tipos.recordset[pos].valor2,
      valor3: this.estado_tipos.recordset[pos].valor3,
      valor4: this.estado_tipos.recordset[pos].valor4
    }
    
});
modal.onDidDismiss().then((res)=>{
 this.estado_tipo()
});

return modal.present();
}











}
