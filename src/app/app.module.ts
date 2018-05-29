import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from "@angular/http"
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { SQLite } from '@ionic-native/sqlite';
//Desenvolvimento
import { ChartsModule } from 'ng2-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AlertsProvider } from '../providers/alerts/alerts';
import { ChamadosProvider } from '../providers/chamados/chamados';
import { ConstantesProvider } from '../providers/constantes/constantes';
import { UteisProvider } from '../providers/uteis/uteis';

import { TabsPage } from '../pages/tabs/tabs';

import { ChamadoDetalhesPageModule } from '../pages/chamado-detalhes/chamado-detalhes.module';
import { HomePageModule } from './../pages/home/home.module';
import { LoginPageModule } from './../pages/login/login.module';
import { HomeOfflinePageModule } from './../pages/home-offline/home-offline.module';

import * as GalleryModal from 'ionic-gallery-modal';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "../assets/i18n/", ".json");
}

//Desenvolvimento

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    GalleryModal.GalleryModalModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    ChartsModule,
    ChamadoDetalhesPageModule,
    HomePageModule,
    LoginPageModule,
    HomeOfflinePageModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AlertsProvider,
    ChamadosProvider,
    ConstantesProvider,
    { provide: BrowserModule, useClass: GalleryModal.GalleryModalHammerConfig },
    UteisProvider,
    Network,
    Geolocation,
    SQLite
    //Desenvolvimento
  ]
})
export class AppModule { }
