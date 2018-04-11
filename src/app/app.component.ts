import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ConfigLoginProvider } from './../providers/config-login/config-login';
import { OfflineProvider } from './../providers/offline/offline';

import { LoginPage } from './../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { HomeOfflinePage } from './../pages/home-offline/home-offline';

@Component({
  templateUrl: 'app.html',
  providers: [
    ConfigLoginProvider,
    OfflineProvider
  ]
})
export class MyApp {
  //Propriedades
  rootPage: any;

  //Load
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public configLoginProvider: ConfigLoginProvider,
  public offlineProvider: OfflineProvider) {
    platform.ready().then(() => {
      splashScreen.show();

      this.carregarDados();

      statusBar.styleDefault();

      splashScreen.hide();
    });
  }

  //Ações
  carregarDados(){
    try{
      //Desenvolvimento
      //this.offlineProvider.removerConfigEstruturaSQLite();
      //this.offlineProvider.excluirBancoSQLite();
      //localStorage.removeItem("database");s
           
      if(this.offlineProvider.validarInternetOffline()){
        this.rootPage = HomeOfflinePage;
      }
      else{
      this.validarAutenticacao();
      }
    }
    catch(e){
      console.log(e);
      this.rootPage = LoginPage;
    }
  }

  validarAutenticacao() {
    try {
      let _configLoginProvider = this.configLoginProvider.retornarConfigLogin();

      if (_configLoginProvider) {
        this.rootPage = TabsPage;
      }
      else {
        this.rootPage = LoginPage;
      }
    }
    catch (e) {
      console.log(e);
      this.rootPage = LoginPage;
    }
  }
}