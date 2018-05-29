import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ModalController, PopoverController } from 'ionic-angular';

import { ChamadosProvider } from './../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { OfflineProvider } from '../../providers/offline/offline';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';

@IonicPage()
@Component({
  selector: 'page-chamado-detalhes',
  templateUrl: 'chamado-detalhes.html',
  providers: [
    AlertsProvider,
    ConfigLoginProvider,
    ChamadosProvider,
    OfflineProvider,
    ConstantesProvider,
    UteisProvider]
})
export class ChamadoDetalhesPage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string;
  idioma: string;
  msgNenhumItem: string;
  chamadoId: string;
  tipoChamadoPreventivo: number;
  chamado: any;
  tipoServicoId: any;
  tipoChamado: any;
  exibirMsg: boolean = false;
  habilitarChamado: boolean;
  origemOffline: boolean = false;
  alterarChamado: boolean = false;
  homeOffline: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public modalCtrl: ModalController, public alertsProvider: AlertsProvider, public configLoginProvider: ConfigLoginProvider,
    public chamadosProvider: ChamadosProvider, public offlineProvider: OfflineProvider, public app: App, 
    public constantesProvider: ConstantesProvider, public popoverController: PopoverController, public uteisProvider: UteisProvider) {
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
      this.tipoChamadoPreventivo = this.constantesProvider.tipoChamadoPreventivo;

      if (this.offlineProvider.validarInternetOffline() && !this.origemOffline) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
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
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.portal = _configLoginProvider.portal;
          this.nomePortal = _configLoginProvider.nomePortal;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.chamadoId = this.navParams.get("ChamadoID");
          this.msgNenhumItem = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem);
          this.exibirMsg = false;
          this.habilitarChamado = false;
        }
        else {
          this.app.getRootNav().setRoot("LoginPage");
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarDetalhesChamado() {
    try {
      this.alertsProvider.exibirCarregando('');

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
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.chamado = null;
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarDetalhesChamadoOnline() {
    this.chamadosProvider.retornarChamadoDetalhes(this.username, this.portal, this.chamadoId, this.idioma).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.chamado = _objetoRetorno;
      
        if (!this.chamado) {
          this.exibirMsg = true;
          this.chamado = null;
        }
        else{
          this.tipoServicoId = this.chamado.TipoServicoID;
          this.tipoChamado = this.chamado.TipoChamado;
          this.habilitarChamado = this.chamado.HabilitarChamado;
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
      else {
        this.tipoChamado = this.chamado.TipoChamado;
      }

      this.alertsProvider.fecharCarregando();
    });
  }

  carregarMapa(chamado: any) {
    try {
      let modal = this.modalCtrl.create("ChamadoMapaPage",
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
    this.navCtrl.push("ChamadoAnexosPage", {
      ChamadoID: this.chamadoId,
      HabilitarChamado: this.habilitarChamado,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  movimentacaoClick() {
    this.navCtrl.push("ChamadoMovimentacaoPage", {
      ChamadoID: this.chamadoId,
      TipoServicoID: this.tipoServicoId,
      "ChamadoDetalhesPage": this,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  rotinaClick() {
    this.navCtrl.push("ChamadoRotinaPage", {
      ChamadoID: this.chamadoId,
      OrigemOffline: this.origemOffline,
      HabilitarChamado: this.habilitarChamado,
      AlterarChamado: this.alterarChamado
    });
  }

  materiaisClick() {
    this.navCtrl.push("ChamadoMateriaisPage", {
      ChamadoID: this.chamadoId,
      HabilitarChamado: this.habilitarChamado,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  historicoClick() {
    this.navCtrl.push("ChamadoHistoricoPage", { 
      ChamadoID: this.chamadoId, 
      OrigemOffline: this.origemOffline 
    });
  }

  atualizarClick() {
    this.carregarDetalhesChamado();
  }

  popoverClick(evento) {
    let _popover = this.popoverController.create("ChamadoDetalhesPopoverPage", 
      { ChamadoID: this.chamadoId,
        HabilitarChamado: this.habilitarChamado,
        OrigemOffline: this.origemOffline,
        AlterarChamado: this.alterarChamado,
        TipoServicoID: this.tipoServicoId,
        TipoChamado: this.tipoChamado,
        "ChamadoDetalhesPage": this});
    _popover.present({
      ev: evento
    });
  }
}
