import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ChamadosProvider } from '../../providers/chamados/chamados';
import { OfflineProvider } from './../../providers/offline/offline';

import { LoginPage } from '../login/login';
import { ChamadoHistoricoPage } from '../chamado-historico/chamado-historico';
import { ChamadoDetalhesPage } from '../chamado-detalhes/chamado-detalhes';
import { HomeOfflinePage } from '../home-offline/home-offline';

@IonicPage()
@Component({
  selector: 'page-chamados-equipamento',
  templateUrl: 'chamados-equipamento.html',
  providers: [
    AlertsProvider,
    ConfigLoginProvider,
    ChamadosProvider,
    OfflineProvider
  ]
})

export class ChamadosEquipamentoPage {
  //Propriedades
  username: string;
  portal: string;
  msgNenhumItem: string;
  equipamentoId: string;
  nomeEquipamento: string;
  chamados: any;
  infiniteScroll: any;
  refresher: any;
  exibirMsg: boolean = false;
  isRefreshing: boolean = false;
  homeOffline: boolean = false;
  pagina = 1;
  tamanhoPagina = 20;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public configLoginProvider: ConfigLoginProvider,
    public alertsProvider: AlertsProvider, public viewCtrl: ViewController, public chamadosProvider: ChamadosProvider,
    public offlineProvider: OfflineProvider, public app: App) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarChamados();
    }
  }

  //Ações
  carregarDados() {
    try {
      if (this.offlineProvider.validarInternetOffline()) {
        this.app.getRootNav().setRoot(HomeOfflinePage);
        this.homeOffline = true;
      }
      else {
        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.portal = _configLoginProvider.portal;
          this.equipamentoId = this.navParams.get("EquipamentoID");
          this.nomeEquipamento = this.navParams.get("NomeEquipamento");
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

  carregarChamados(novaPagina: boolean = false) {
    try {

      if (!this.isRefreshing && !novaPagina) {
        this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);
      }

      this.exibirMsg = false;

      this.chamadosProvider.retornarChamadosEquipamento(this.username, this.portal, this.equipamentoId,
        this.pagina, this.tamanhoPagina).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            if (novaPagina) {
              this.chamados = this.chamados.concat(_objetoRetorno);
              this.infiniteScroll.complete();
            }
            else {
              this.chamados = _objetoRetorno;
            }

            if (!this.chamados[0]) {
              this.exibirMsg = true;
              this.chamados = null;
            }

            if (this.isRefreshing) {
              this.refresher.complete();
              this.isRefreshing = false;
            }
            else if(!novaPagina) {
              this.alertsProvider.fecharCarregando();
            }
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.exibirMsg = true;
            this.chamados = null;
      
            if (this.isRefreshing) {
              this.refresher.complete();
              this.isRefreshing = false;
            }
            else if(!novaPagina) {
              this.alertsProvider.fecharCarregando();
            }
          });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.chamados = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
  }

  //Eventos
  atualizarClick() {
    this.carregarChamados();
  }

  abrirDetalhesClick(chamado) {
    this.navCtrl.push(ChamadoDetalhesPage, { ChamadoID: chamado.ChamadoID });
  }

  historicoClick(chamado) {
    this.navCtrl.push(ChamadoHistoricoPage, { ChamadoID: chamado.ChamadoID });
  }

  doRefresh(refresher) {
    this.pagina = 1;
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarChamados();
  }

  doInfinite(infiniteScroll) {
    this.pagina++;
    this.infiniteScroll = infiniteScroll;

    this.carregarChamados(true);
  }
}
