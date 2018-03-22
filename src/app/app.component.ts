import { ConfigLoginProvider } from './../providers/config-login/config-login';
import { HomePage } from './../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html',
  providers: [
    ConfigLoginProvider
  ]
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public configLoginProvider: ConfigLoginProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // localStorage.removeItem("configLoginPortais");

      this.validarAutenticacao();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  validarAutenticacao(): void {
    let _configLoginProvider = this.configLoginProvider.retornarConfigLogin();

    if (_configLoginProvider) {
      this.rootPage = TabsPage;
    }
    else {
      this.rootPage = LoginPage;
    }
  }
}


