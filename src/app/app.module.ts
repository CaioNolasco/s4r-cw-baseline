import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from "@angular/http"

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { RelatoriosPage } from './../pages/relatorios/relatorios';
import { LoginPage } from './../pages/login/login';
import { ChamadoDetalhesPage } from './../pages/chamado-detalhes/chamado-detalhes';
import { ChamadoMapaPage } from './../pages/chamado-mapa/chamado-mapa';
import { ChamadoAnexosPage } from './../pages/chamado-anexos/chamado-anexos';
import { ChamadoMateriaisPage } from './../pages/chamado-materiais/chamado-materiais';
import { ChamadoHistoricoPage } from './../pages/chamado-historico/chamado-historico';
import { ChamadoMovimentacaoPage } from './../pages/chamado-movimentacao/chamado-movimentacao';
import { ChamadosEquipamentoPage } from './../pages/chamados-equipamento/chamados-equipamento';

import { ConfigLoginProvider } from '../providers/config-login/config-login';
import { AlertsProvider } from '../providers/alerts/alerts';
import { ChamadosProvider } from '../providers/chamados/chamados';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { ConstantesProvider } from '../providers/constantes/constantes';

import * as GalleryModal from 'ionic-gallery-modal';
import { UteisProvider } from '../providers/uteis/uteis';


@NgModule({
  declarations: [
    MyApp,
    RelatoriosPage,
    HomePage,
    TabsPage,
    LoginPage,
    ChamadoDetalhesPage,
    ChamadoAnexosPage,
    ChamadoMapaPage,
    ChamadoHistoricoPage,
    ChamadoMateriaisPage,
    ChamadoMovimentacaoPage,
    ChamadosEquipamentoPage
  ],
  imports: [
    BrowserModule,
    GalleryModal.GalleryModalModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RelatoriosPage,
    HomePage,
    TabsPage,
    LoginPage,
    ChamadoDetalhesPage,
    ChamadoAnexosPage,
    ChamadoMapaPage,
    ChamadoHistoricoPage,
    ChamadoMateriaisPage,
    ChamadoMovimentacaoPage,
    ChamadosEquipamentoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigLoginProvider,
    AlertsProvider,
    ChamadosProvider,
    UsuariosProvider,
    ConstantesProvider,
    { provide: BrowserModule, useClass: GalleryModal.GalleryModalHammerConfig},
    UteisProvider
  ]
})
export class AppModule {}
