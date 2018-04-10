import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { Component } from '@angular/core';

import { OfflineProvider } from './../../providers/offline/offline';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';

import { HomeOfflinePage } from '../home-offline/home-offline';
import { LoginPage } from './../login/login';

@IonicPage()
@Component({
  selector: 'page-chamado-novo',
  templateUrl: 'chamado-novo.html',
  providers: [
    ConfigLoginProvider,
    OfflineProvider
  ]
})
export class ChamadoNovoPage {
//Propriedades
portal: string;
username: string;
tipoChamado: any;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public configLoginProvider: ConfigLoginProvider, public offlineProvider: OfflineProvider, public app: App) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
  }

  //Ações
  carregarDados() {
    try {
      if(this.offlineProvider.validarInternetOffline()){
        this.app.getRootNav().setRoot(HomeOfflinePage);
      }
      else{
        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

        if (_configLoginProvider) {
          this.portal = _configLoginProvider.portal;
          this.username = _configLoginProvider.username;
          this.tipoChamado = "Dados Básicos";
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

  //Eventos
  navegarClick(tipoChamado: string){
    this.tipoChamado = tipoChamado;
  }
}
