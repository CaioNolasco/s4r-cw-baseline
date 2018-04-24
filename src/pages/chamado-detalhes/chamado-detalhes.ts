import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ModalController } from 'ionic-angular';

import { ChamadosProvider } from './../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { OfflineProvider } from '../../providers/offline/offline';

import { ChamadoAnexosPage } from './../chamado-anexos/chamado-anexos';
import { ChamadoMapaPage } from './../chamado-mapa/chamado-mapa';
import { LoginPage } from '../login/login';
import { ChamadoHistoricoPage } from '../chamado-historico/chamado-historico';
import { ChamadoMateriaisPage } from './../chamado-materiais/chamado-materiais';
import { ChamadoMovimentacaoPage } from './../chamado-movimentacao/chamado-movimentacao';
import { HomeOfflinePage } from '../home-offline/home-offline';


@IonicPage()
@Component({
  selector: 'page-chamado-detalhes',
  templateUrl: 'chamado-detalhes.html',
  providers: [
    AlertsProvider,
    ConfigLoginProvider,
    ChamadosProvider,
    OfflineProvider]
})
export class ChamadoDetalhesPage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string;
  msgNenhumItem: string;
  chamadoId: string;
  chamado: any;
  tipoServicoId: any;
  exibirMsg: boolean = false;
  habilitarChamado: boolean;
  origemOffline: boolean = false;
  alterarChamado: boolean = false;
  homeOffline: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public modalCtrl: ModalController, public alertsProvider: AlertsProvider, public configLoginProvider: ConfigLoginProvider,
    public chamadosProvider: ChamadosProvider, public offlineProvider: OfflineProvider, public app: App) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if(!this.homeOffline){
      this.carregarDetalhesChamado();
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
        if (!this.origemOffline) {
          this.alterarChamado = this.navParams.get("AlterarChamado");
        }
        else {
          this.alterarChamado = true;
        }

        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.portal = _configLoginProvider.portal;
          this.nomePortal = _configLoginProvider.nomePortal;
          this.chamadoId = this.navParams.get("ChamadoID");
          this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
          this.exibirMsg = false;
          this.habilitarChamado = false;
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

  carregarDetalhesChamado() {
    try {
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

      this.exibirMsg = false;

      if (!this.origemOffline) {
        this.carregarDetalhesChamadoOnline();
      }
      else {
        this.carregarDetalhesChamadoOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.chamado = null;
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarDetalhesChamadoOnline() {
    this.chamadosProvider.retornarChamadoDetalhes(this.username, this.portal, this.chamadoId).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.chamado = _objetoRetorno;
        this.tipoServicoId = this.chamado.TipoServicoID;
        this.habilitarChamado = this.chamado.HabilitarChamado;

        if (!this.chamado) {
          this.exibirMsg = true;
          this.chamado = null;
        }

        this.alertsProvider.fecharCarregando();
      }, e => {
        console.log(e);
        this.alertsProvider.fecharCarregando();
      });
  }

  carregarDetalhesChamadoOffline() {
    this.offlineProvider.retornarDetalhesChamadoOffline(this.portal, this.chamadoId).then(data => {
      this.chamado = data;

      if (!this.chamado) {
        this.exibirMsg = true;
        this.chamado = null;
      }

      this.alertsProvider.fecharCarregando();
    });
  }

  carregarMapa(chamado: any) {
    try {
      let modal = this.modalCtrl.create(ChamadoMapaPage,
        { Endereco: chamado.Endereco, Cidade: chamado.Cidade, Estado: chamado.Estado });
      modal.present();
    }
    catch (e) {
      console.log(e);
    }
  }

  //Eventos
  mapaClick(chamado: any) {
    this.carregarMapa(chamado);
  }

  anexosClick() {
    this.navCtrl.push(ChamadoAnexosPage, {
      ChamadoID: this.chamadoId,
      HabilitarChamado: this.habilitarChamado,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  movimentacaoClick() {
    this.navCtrl.push(ChamadoMovimentacaoPage, {
      ChamadoID: this.chamadoId,
      TipoServicoID: this.tipoServicoId,
      "ChamadoDetalhesPage": this,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  materiaisClick() {
    this.navCtrl.push(ChamadoMateriaisPage, {
      ChamadoID: this.chamadoId,
      HabilitarChamado: this.habilitarChamado,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  historicoClick() {
    this.navCtrl.push(ChamadoHistoricoPage, { ChamadoID: this.chamadoId, OrigemOffline: this.origemOffline });
  }

  atualizarClick() {
    this.carregarDetalhesChamado();
  }
}
