import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class AlertsProvider {

  //Propriedades
  alertaClasses: any = ["toast-danger", "toast-success", "toast-warning"];
  loader: any;

  msgTituloPadrao: string = "Alerta";
  msgTituloAtualizar: string = "Atualizar";
  msgBotaoPadrao: string = "OK";
  msgBotaoConfirmar: string = "Confirmar";
  msgBotaoCancelar: string = "Cancelar";
  msgBotaoNavegar: string = "Navegar";
  msgBotaoFiltrar: string = "Filtrar";
  msgValorExistente: string = "O valor preenchido está em uso!";
  msgSucesso: string = "Ação executada com sucesso!";
  msgErro: string = "Não foi possível executar a ação!";
  msgErroAcesso: string = "Acesso negado!";
  msgErroAcessoConfig: string = "Acesso negado, ";
  msgErroCampos: string = "Campos preenchidos incorretamente!";
  msgErroCampo: string = "Campo preenchido incorretamente: ";
  msgErroPortal: string = "Você não está vínculado a nenhum contexto de portal!";
  msgErroRotina: string = "Adicione ao menos uma foto e preencha todos os campos obrigatórios!";
  msgAguarde: string = "Por favor, aguarde...";
  msgNenhumItem: string = "Nenhum item localizado!";
  msgConfirmacao: string = "Deseja realmente executar essa ação?";
  msgConfirmacaoEstrutura: string = "Download de estrutura necessária, caso confirme marque offline novamente!";
  msgConfirmarAtualizarEstrutura: string = "Atualização de estrutura offline!"
  msgEscolhaAcao: string = "Escolha a ação que deseja executar:";
  msgOffline: string = "Você está offline!";
  msgPortal: string = "Você está no contexto do portal: ";
  
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
      position: "top",
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
