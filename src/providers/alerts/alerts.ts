import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class AlertsProvider {

  //Propriedades
  public alertaClasses = ["toast-danger", "toast-success", "toast-warning"];

  public msgTituloPadrao = "Alerta";
  public msgBotaoPadrao = "OK";
  public msgBotaoConfirmar = "Confirmar";
  public msgBotaoCancelar = "Cancelar";
  public msgBotaoNavegar = "Navegar";
  public msgBotaoFiltrar = "Filtrar";
  public msgValorExistente = "O valor preenchido está em uso!";
  public msgSucesso = "Ação executada com sucesso!";
  public msgErro = "Não foi possível executar está ação!";
  public msgErroAcesso = "Acesso negado!";
  public msgErroAcessoConfig = "Acesso negado, ";
  public msgAguarde = "Por favor aguarde...";
  public msgNenhumItem = "Nenhum item localizado!";
  public msgConfirmacao = "Deseja realmente executar essa ação?";
  public msgEscolhaAcao = "Escolha a ação que deseja executar:";


  public loader;
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
      duration: 6000,
      position: "top"
    });
    toast.present();
  }

  exibirCarregando(mensagem: string) {
    this.loader = this.loadingCtrl.create({
      content: mensagem,
    });
    this.loader.present();
  }

  fecharCarregando() {
    this.loader.dismiss();
  }

}
