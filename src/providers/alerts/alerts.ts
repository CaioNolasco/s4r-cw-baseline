import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class AlertsProvider {

  //Propriedades
  alertaClasses: any = ["toast-danger", "toast-success", "toast-warning"];
  loader: any;
  msgBotaoPadrao: string = "OK";
  
  //Load
  constructor(public alertCtrl: AlertController, public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {
  }

  //Ações
  exibirAlerta(titulo: string, subTitulo: string, botao: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subTitulo,
      buttons: [botao]
    });
    alert.present();
  }

  exibirAlertaConfirmacao(titulo: string, mensagem: string, botao: string, botao1: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensagem,
      buttons: [
        {
          text: botao,
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: botao1,
          handler: () => {
            console.log('Confirmado');
          }
        }
      ]
    });
    alert.present();
  }

  exibirAlertaConfirmacaoHandler(titulo: string, mensagem: string, botoes: any) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensagem,
      buttons: botoes
    });
    alert.present();
  }

  exibirToast(mensagem: string, botao: string, cssClass?: string) {
    let toast = this.toastCtrl.create({
      message: mensagem,
      showCloseButton: true,
      closeButtonText: botao,
      cssClass: cssClass,
      duration: 10000,
      position: "top",
    });
    toast.present();
  }

  exibirToastSemDuracao(mensagem: string, botao: string, cssClass?: string) {
    let toast = this.toastCtrl.create({
      message: mensagem,
      showCloseButton: true,
      closeButtonText: botao,
      cssClass: cssClass,
      position: "top",
    });
    toast.present();
  }

  exibirCarregando(mensagem: string) {
    this.loader = this.loadingCtrl.create({
      content: mensagem
    });
    this.loader.present();
  }

  fecharCarregando() {
    this.loader.dismiss();
  }
}
