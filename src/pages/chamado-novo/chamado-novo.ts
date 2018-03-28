import { LoginPage } from './../login/login';
import { Component } from '@angular/core';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';

import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chamado-novo',
  templateUrl: 'chamado-novo.html',
  providers: [
    ConfigLoginProvider
  ]
})
export class ChamadoNovoPage {
//Propriedades
portal: string;
username: string;
tipoChamado: any;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public configLoginProvider: ConfigLoginProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
  }

  //Ações
  carregarDados() {
    try {
      let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

      if (_configLoginProvider) {
        this.portal = _configLoginProvider.portal;
        this.username = _configLoginProvider.username;
        this.tipoChamado = "Dados Básicos";
      }
      else {
        this.navCtrl.push(LoginPage);
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
