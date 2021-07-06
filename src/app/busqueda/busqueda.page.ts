
import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { Plugins } from "@capacitor/core";
import { AlertController, ModalController, ToastController } from "@ionic/angular";
import Swal from "sweetalert2";
import { ModalDescargarImgPage } from "../modal-descargar-img/modal-descargar-img.page";
import { BuscarService } from '../Services/buscar.service';
import { LoadingServiceService } from "../Services/loading-service.service";
import { ModoOfflineService } from "../Services/modo-offline.service";
import { ReporteService } from "../Services/reporte.service";

const { Storage,Network } = Plugins;
@Component({
	selector: 'app-busqueda',
	templateUrl: './busqueda.page.html',
	styleUrls: ['./busqueda.page.scss']
})
export class BusquedaPage implements OnInit {
	MostrarInfo = false;
	Numeconomico: any;
	numero = '';
	no_serie_uni: any;
	Grupo: any;
	pagina = 1;
	reporte: any;
	trailer: any;
	conductor: any;
	marca: any;
	isLoading = false;
	act_img: any;
	modal_Marca: any;
	version: any;
	id_versiones: any;
	numero_version: any;
	constructor(
		private router: Router,
		public serviciobuscar: BuscarService,
		private alertCtrl: AlertController,
		private toastController: ToastController,
		private loading: LoadingServiceService,
		public servicioreportes: ReporteService,
		private modalCtrl: ModalController,
		private offlineManager: ModoOfflineService,
	) {
		this.Numeconomico = [];
		this.reporte = [];

	}

	async revisar_act_img(pos) {
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

	ngOnInit() {
		this.Get_Reporte();
		this.verificar_version();
	}
	doRefresh(event) {
		this.verificar_version();
		setTimeout(() => {
		  event.target.complete();
		}, 2000);
	  }
	async Get_Reporte() {
		this.loading.present();
		const ret = await Storage.get({ key: 'reporte-save' });
		this.reporte = JSON.parse(ret.value);

		if (this.reporte === null) {
			let toast = this.toastController.create({
				message: `No tienes reportes pendientes!`,
				duration: 3000,
				position: 'bottom'
			});
			this.loading.dismiss();
			toast.then((toast) => toast.present());
		} else {
			this.loading.dismiss();
			this.alert_reporte('Tienes un reporte pendiente por terminar ');
		}
	}

	async alert_reporte(mensaje) {
		const alert = await this.alertCtrl.create({
			mode: 'ios',
			header: 'Atención',
			message: mensaje,
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: (blah) => { }
				},
				{
					text: 'Terminar',
					handler: (blah) => {
						this.get_storage();
					}
				}
			]
		});
		await alert.present();
	}

	async get_storage() {
		const ret = await Storage.get({ key: 'tcm' });
		const tcm = JSON.parse(ret.value);
		this.trailer = tcm.trailer;
		this.conductor = tcm.conductor;
		this.marca = tcm.Marca;
		this.direcionar();
	}

	direcionar() {
		let navParams: NavigationExtras = {
			queryParams: {
				trailer: this.trailer,
				conductor: this.conductor,
				Marca: this.marca
			}
		};
		this.router.navigate(['reporte-save'], navParams);
	}

	async verificar_version() {
		const ret = await Storage.get({ key: 'version' });
		this.version = JSON.parse(ret.value);
		this.serviciobuscar.act_img().then((result) => {
			this.act_img = this.serviciobuscar.actualizar.recordset[0];
			this.id_versiones = this.serviciobuscar.actualizar.recordset[0].id_Actualizacion;
			this.numero_version = this.serviciobuscar.actualizar.recordset[0].numero_version;
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


	}

	async buscar() {
		this.loading.present();
		await this.offlineManager.reporte_enviar().then(async result =>{
			const ret = await Storage.get({ key: 'version' });
			this.version = JSON.parse(ret.value);
			this.offlineManager.reporte_enviar()
			this.serviciobuscar.getTractos(this.numero).then(
				async (Ntracto) => {
					this.Numeconomico = this.serviciobuscar.Ntracto;
					if (this.Numeconomico.recordset.length === 0) {
						this.MostrarInfo = false;
						this.alertnoExiste();
						this.loading.dismiss();
					} 
					this.serviciobuscar.act_img().then((result) => {
						this.act_img = this.serviciobuscar.actualizar.recordset[0];
						this.id_versiones = this.serviciobuscar.actualizar.recordset[0].id_Actualizacion;
						this.numero_version = this.serviciobuscar.actualizar.recordset[0].numero_version;
						if (this.version === null) {
							this.loading.dismiss();
							var pos = 0
							this.revisar_act_img(pos);
						} else {
							if (this.version.version === this.act_img.numero_version) {
							this.modal_Marca = this.Numeconomico.recordset[0].marca;
							this.no_serie_uni = this.Numeconomico.recordset[0].no_serie_uni;
							this.MostrarInfo = true;
							this.loading.dismiss();
							} else {
								if (this.version.version != this.act_img.numero_version) {
									this.loading.dismiss();
									var pos = 1
									this.revisar_act_img(pos);
								}
							}
						}
					});
				},
				(error) => {
					console.error('Entro a error', error);
					this.loading.dismiss();
				}
			);
		})
	}

	// validacion del buscador
	vbuscador() {
		if (this.numero === '') {
			Swal.fire({
				title: 'Error!',
				text: 'Ingresa el codigo de la unidad',
				icon: 'error',
				footer: 'Trucka',
				confirmButtonText: 'Aceptar'
			});

			this.MostrarInfo = false;
		} else {
			this.buscar();
		}
	}

	async redirect() {
		let navParams: NavigationExtras = {
			queryParams: {
				trailer: this.numero,
				conductor: this.Numeconomico.recordset[0].nom_tra,
				Marca: this.Numeconomico.recordset[0].marca
			}
		};
		await this.setItem();
		this.router.navigate(['nuevo-reporte'], navParams);
	}

	async setItem() {
		await Storage.set({
			key: 'tcm',
			value: JSON.stringify({
				trailer: this.numero,
				conductor: this.Numeconomico.recordset[0].nom_tra,
				Marca: this.Numeconomico.recordset[0].marca
			})
		});
	}

	// Alertas de validaciones y mas
	alertnoExiste() {
		Swal.fire({
			title: 'Error!',
			text: 'Unidad no encontrada',
			icon: 'error',
			footer: 'Trucka',
			confirmButtonText: 'Aceptar'
		});
	}

	async alertNull() {
		const alert = await this.alertCtrl.create({
			mode: 'ios',
			animated: true,
			cssClass: 'my-custom-class',
			header: 'Atención',
			subHeader: '¿El número de serie es correcto?',
			message: `${this.no_serie_uni}`,

			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: (blah) => { }
				},
				{
					text: 'ok',
					handler: (blah) => {
						this.redirect();
					}
				}
			]
		});
		await alert.present();
	}

	BtnCancelar() {
		Swal.fire({
			title: 'Atencion!',
			text: 'Si cancelas se perdera tu busqueda',
			icon: 'warning',
			footer: 'Trucka',
			confirmButtonText: 'Aceptar'
		});
		this.MostrarInfo = false;
	}
}