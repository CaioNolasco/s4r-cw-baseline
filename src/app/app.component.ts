import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ConfigLoginProvider } from './../providers/config-login/config-login';

import { LoginPage } from './../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html',
  providers: [
    ConfigLoginProvider
  ]
})
export class MyApp {
  //Propriedades
  rootPage: any;

  //Load
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public configLoginProvider: ConfigLoginProvider) {
    platform.ready().then(() => {
      splashScreen.show();

      this.validarAutenticacao();
      statusBar.styleDefault();

      splashScreen.hide();
    });
  }

  //Ações
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