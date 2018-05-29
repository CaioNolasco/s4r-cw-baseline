import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';

import { AlertsProvider } from '../../providers/alerts/alerts';
import { OfflineProvider } from './../../providers/offline/offline';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';

@IonicPage({name: 'HomeOfflinePage'})
@Component({
  selector: 'page-home-offline',
  templateUrl: 'home-offline.html',
  providers: [
    AlertsProvider,
    OfflineProvider,
    ConfigLoginProvider,
    ConstantesProvider
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
  public offlineProvider: OfflineProvider, public configLoginProvider: ConfigLoginProvider, public constantesProvider: ConstantesProvider,
  public uteisProvider: UteisProvider) {
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
        this.navCtrl.setRoot("LoginPage");
      }
      else{
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgOffline), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch(e){
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  chamadosOffline(){
    try{
      if(this.offlineProvider.retornarConfigEstruturaSQLite()){
        this.navCtrl.push("ChamadosOfflinePage", { OrigemOffline: true});
      }
      else{
        let _titulo = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta);

        let _botoes: any = [{ text:  this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) }, 
          { text:  this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar), 
            handler: this.confirmarDownloadClick }]
    
            this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo,  this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacaoEstrutura), _botoes);
      }
    }
    catch(e){
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  salvarEstruturaOffline(){
    try{
      this.alertsProvider.exibirCarregando('');

      this.offlineProvider.removerConfigEstruturaSQLite();
      let _sqlite = this.offlineProvider.salvarBancoSQLite();
      this.offlineProvider.salvarEstruturaSQLite(_sqlite);

      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      this.alertsProvider.fecharCarregando();
    }
    catch(e){
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarInfo(){
    try{
      let _msg: string;

      if(this.nomePortal){
        _msg = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgPortal) + this.nomePortal;
      }
      else{
        _msg = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroPortal);
      }

      this.alertsProvider.exibirAlerta(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta), 
      _msg, this.alertsProvider.msgBotaoPadrao);
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
