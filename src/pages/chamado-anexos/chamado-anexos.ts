import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ChamadosProvider } from './../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-chamado-anexos',
  templateUrl: 'chamado-anexos.html',
  providers: [
    ConfigLoginProvider,
    AlertsProvider,
    ChamadosProvider,
    InAppBrowser]
})
export class ChamadoAnexosPage {
  //Propriedades
  username: string;
  portal: string;
  msgNenhumItem: string;
  chamadoId: any;
  tipoAnexos: any;
  anexos: any;
  refresher: any;
  isRefreshing: boolean = false;
  exibirMsgAnexos: boolean = false;
  exibirMsgFotos: boolean = false;

  fotos: any[] = [];

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public modalCtrl: ModalController, public alertsProvider: AlertsProvider, public chamadosProvider: ChamadosProvider,
    public configLoginProvider: ConfigLoginProvider, public inAppBrowser: InAppBrowser) {
    this.carregarDados();
    this.carregarFotos();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    this.carregarAnexos();
  }

  //Açoes
  carregarDados() {
    try {
      let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

      if (_configLoginProvider) {
        this.username = _configLoginProvider.username;
        this.portal = _configLoginProvider.portal;
        this.chamadoId = this.navParams.get("ChamadoID");
        this.tipoAnexos = "anexos";
        this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
        this.exibirMsgAnexos = false;
        this.exibirMsgFotos = false;
      }
      else {
        this.navCtrl.push(LoginPage);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarAnexos() {
    try {
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

      this.exibirMsgAnexos = false;

      this.chamadosProvider.retornarAnexosChamado(this.username, this.portal, this.chamadoId).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.anexos = _objetoRetorno;

          if (!this.anexos[0]) {
            this.exibirMsgAnexos = true;
            this.anexos = null;
          }

          this.alertsProvider.fecharCarregando();
        }
      )
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsgAnexos = true;
      this.anexos = null;
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarFotos() {
    try {

      this.exibirMsgFotos = false;

      this.fotos.push({
        url: `https://i.ytimg.com/vi/peOP8Gs8NFY/maxresdefault.jpg`,
        sequencia: 0
      });

      this.fotos.push({
        url: `https://i.ytimg.com/vi/IkVrj9-c3To/hqdefault.jpg`,
        sequencia: 1
      });

      this.fotos.push({
        url: `https://i.ytimg.com/vi/jpgYesWUNm8/maxresdefault.jpg`,
        sequencia: 2
      });

      this.fotos.push({
        url: `https://i.ytimg.com/vi/WcMsR2uknOQ/maxresdefault.jpg`,
        sequencia: 3
      });

      if (!this.fotos) {
        this.exibirMsgFotos = true;
        this.fotos = null;
      }
    }
    catch (e) {
      console.log(e);
      this.exibirMsgFotos = true;
      this.fotos = null;
    }
  }

  carregarAbrirFoto(sequencia: number) {
    try {
      let _modal = this.modalCtrl.create(GalleryModal, {
        photos: this.fotos,
        initialSlide: sequencia
      });
      _modal.present();
    }
    catch (e) {
      console.log(e);
    }
  }

  excluirAnexo(anexo: any) {
    try {
      let _titulo = `Excluir ${anexo.NomeAnexo}?`;

      this.alertsProvider.exibirAlertaConfirmacao(_titulo, this.alertsProvider.msgConfirmacao,
        this.alertsProvider.msgBotaoCancelar, this.alertsProvider.msgBotaoConfirmar);
    }
    catch (e) {
      console.log(e);
    }
  }

  //Eventos
  abrirFotoClick(sequencia: number) {
    this.carregarAbrirFoto(sequencia);
  }

  acessarClick(anexo: any) {
    this.inAppBrowser.create(anexo.CaminhoAnexo, '_system')
  }

  excluirClick(anexo: any) {
    this.excluirAnexo(anexo);
  }

  atualizarClick() {
    if (this.tipoAnexos == "anexos") {
      this.carregarAnexos();
    }
    else if (this.tipoAnexos == "fotos") {
      this.carregarFotos();
    }
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarAnexos();

    if (this.isRefreshing) {
      this.refresher.complete();
      this.isRefreshing = false;
    }
  }
}
