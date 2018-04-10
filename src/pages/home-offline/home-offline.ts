import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';

import { AlertsProvider } from '../../providers/alerts/alerts';
import { OfflineProvider } from './../../providers/offline/offline';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';

import { ChamadosOfflinePage } from './../chamados-offline/chamados-offline';
import { LoginPage } from './../login/login';

@IonicPage()
@Component({
  selector: 'page-home-offline',
  templateUrl: 'home-offline.html',
  providers: [
    AlertsProvider,
    OfflineProvider,
    ConfigLoginProvider
  ]
})
export class HomeOfflinePage {
  //Propriedades
  @ViewChild('fab')fab : FabContainer;
  username: string;
  portal: string;
  nomePortal: string;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertsProvider: AlertsProvider,
  public offlineProvider: OfflineProvider, public configLoginProvider: ConfigLoginProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.fab.toggleList();
  }

  //Ações
  carregarDados(){
    try {
      let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

      if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.portal = _configLoginProvider.portal;
          this.nomePortal = _configLoginProvider.nomePortal;
      }
    }
    catch(e){
      console.log(e);
    }
  }

  onlineAcesso(){
    try{
      if(!this.offlineProvider.validarInternetOffline()){
        this.navCtrl.setRoot(LoginPage);
      }
      else{
        this.alertsProvider.exibirToast(this.alertsProvider.msgOffline, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch(e){
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  chamadosOffline(){
    try{
      if(this.offlineProvider.retornarConfigEstruturaSQLite()){
        this.navCtrl.push(ChamadosOfflinePage, { OrigemOffline: true});
      }
      else{
        let _titulo = this.alertsProvider.msgTituloPadrao;

        let _botoes: any = [{ text:  this.alertsProvider.msgBotaoCancelar }, 
          { text:  this.alertsProvider.msgBotaoConfirmar, handler: this.confirmarDownloadClick }]
    
            this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo,  this.alertsProvider.msgConfirmacaoEstrutura, _botoes);
      }
    }
    catch(e){
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  salvarEstruturaOffline(){
    try{
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

      this.offlineProvider.removerConfigEstruturaSQLite();
      let _sqlite = this.offlineProvider.salvarBancoSQLite();
      this.offlineProvider.salvarEstruturaSQLite(_sqlite);

      this.alertsProvider.exibirToast(this.alertsProvider.msgSucesso, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      this.alertsProvider.fecharCarregando();
    }
    catch(e){
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarInfo(){
    try{
      let _msg: string;

      if(this.nomePortal){
        _msg = this.alertsProvider.msgPortal + this.nomePortal;
      }
      else{
        _msg = this.alertsProvider.msgErroPortal;
      }

      this.alertsProvider.exibirAlerta(this.alertsProvider.msgTituloPadrao, _msg, this.alertsProvider.msgBotaoPadrao);
    }
    catch(e){
      console.log(e);
    }
  }

  //Eventos
  chamadosOfflineClick(){
    this.chamadosOffline();
  }

  onlineClick(){
    this.onlineAcesso();
  }

  infoClick(){
    this.carregarInfo();
  }

  confirmarDownloadClick = () => {
    this.salvarEstruturaOffline();
  }
}
