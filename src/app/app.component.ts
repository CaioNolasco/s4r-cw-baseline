import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { ConfigLoginProvider } from './../providers/config-login/config-login';
import { OfflineProvider } from './../providers/offline/offline';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html',
  providers: [
    ConfigLoginProvider,
    OfflineProvider
  ]
})
export class MyApp {
  //Propriedades
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  paginas: any;

  //Load
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public configLoginProvider: ConfigLoginProvider,
    public offlineProvider: OfflineProvider, public menuController: MenuController, public app: App, public translateService: TranslateService) {
    platform.ready().then(() => {
      
      this.carregarIdioma();
      this.carregarDados();

      statusBar.styleDefault();

      splashScreen.hide();
    });
  }

  //Ações
  carregarDados() {
    try {
      //Desenvolvimento
     
      if (this.offlineProvider.validarInternetOffline()) {
        this.rootPage = "HomeOfflinePage";
      }
      else {
        this.carregarMenu();
        this.validarAutenticacao();
      }
    }
    catch (e) {
      console.log(e);
      this.rootPage = "LoginPage";
    }
  }

  validarAutenticacao() {
    try {
      let _configLoginProvider = this.configLoginProvider.retornarConfigLogin();

      if (_configLoginProvider) {
        this.rootPage = TabsPage;
      }
      else {
        this.rootPage = "LoginPage";
      }
    }
    catch (e) {
      console.log(e);
      this.rootPage = "LoginPage";
    }
  }

  carregarMenu() {
    try {
      //Menu
      this.menuController.enable(false, 'menu');
      this.paginas = [
        { titulo: 'corretivos', pagina: 'RelatoriosPage', icone: 'stats' },
        { titulo: 'tipoServico', pagina: 'RelatoriosBarrasPage', icone: 'stats' },
        { titulo: 'consumiveis', pagina: 'RelatoriosConsumiveisPage', icone: 'analytics'}
      ];
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarIdioma() {
    try {
      let _configLoginIdiomas = this.configLoginProvider.retornarConfigLoginIdiomas();

      this.translateService.addLangs(["pt", "en", 'es']);
      this.translateService.setDefaultLang('pt');

      if (_configLoginIdiomas) {
        _configLoginIdiomas = JSON.parse(_configLoginIdiomas);

        this.translateService.use(_configLoginIdiomas.valor);
      }
      else {
        let _idiomaNavegador = this.translateService.getBrowserLang();
        this.translateService.use(_idiomaNavegador.match(/pt|en|es/) ? _idiomaNavegador : 'pt');
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  //Ações
  abrirClick(pagina) {
    this.app.getActiveNav().setRoot(pagina.pagina);
  }
}