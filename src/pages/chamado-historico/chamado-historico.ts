import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ChamadosProvider } from '../../providers/chamados/chamados';
import { OfflineProvider } from './../../providers/offline/offline';

import { LoginPage } from '../login/login';
import { HomeOfflinePage } from '../home-offline/home-offline';

@IonicPage()
@Component({
  selector: 'page-chamado-historico',
  templateUrl: 'chamado-historico.html',
  providers: [
    AlertsProvider,
    ConfigLoginProvider,
    ChamadosProvider,
    OfflineProvider]
})
export class ChamadoHistoricoPage {
  //Propriedades
  msgNenhumItem: string;
  portal: string;
  chamadoId: any;
  historicos: any;
  refresher: any;
  isRefreshing: boolean = false;
  exibirMsg: boolean = false;
  origemOffline = false;
  homeOffline: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public configLoginProvider: ConfigLoginProvider, public alertsProvider: AlertsProvider, public chamadosProvider: ChamadosProvider,
    public offlineProvider: OfflineProvider, public app: App) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarHistorico();
    }
  }

  //Ações
  carregarDados() {
    try {
      this.origemOffline = this.navParams.get("OrigemOffline");

      if (this.offlineProvider.validarInternetOffline() && !this.origemOffline) {
        this.app.getRootNav().setRoot(HomeOfflinePage);
        this.homeOffline = true;
      }
      else {
        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

        if (_configLoginProvider) {
          this.chamadoId = this.navParams.get("ChamadoID");
          this.portal = _configLoginProvider.portal;
          this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
          this.exibirMsg = false;
        }
        else {
          this.app.getRootNav().setRoot(LoginPage);
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarHistorico() {
    try {
      if (!this.isRefreshing) {
        this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);
      }

      this.exibirMsg = false;

      if (!this.origemOffline) {
        this.carregarHistoricoOnline();
      }
      else {
        this.carregarHistoricoOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.historicos = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
  }

  carregarHistoricoOnline() {
    this.chamadosProvider.retornarHistoricoChamado(this.portal, this.chamadoId).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.historicos = _objetoRetorno;

        if (!this.historicos[0]) {
          this.exibirMsg = true;
          this.historicos = null;
        }

        if (this.isRefreshing) {
          this.refresher.complete();
          this.isRefreshing = false;
        }
        else {
          this.alertsProvider.fecharCarregando();
        }
      }
    )
  }

  carregarHistoricoOffline() {
    this.offlineProvider.retornarHistoricoOffline(this.portal, this.chamadoId).then(data => {

      this.historicos = data;

      if (!this.historicos[0]) {
        this.exibirMsg = true;
        this.historicos = null;
      }

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    });
  }

  //Eventos
  atualizarClick() {
    this.carregarHistorico();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarHistorico();
  }
}
