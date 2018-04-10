import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from "@angular/http"
import { Network } from '@ionic-native/network';
import { SQLite, SQLiteDatabaseConfig } from '@ionic-native/sqlite';

import { ConfigLoginProvider } from '../providers/config-login/config-login';
import { AlertsProvider } from '../providers/alerts/alerts';
import { ChamadosProvider } from '../providers/chamados/chamados';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { ConstantesProvider } from '../providers/constantes/constantes';
import { UteisProvider } from '../providers/uteis/uteis';
import { OfflineProvider } from '../providers/offline/offline';

import { HomePage } from '../pages/home/home';
import { ChamadosOfflinePage } from './../pages/chamados-offline/chamados-offline';
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
import { ChamadoNovoPage } from './../pages/chamado-novo/chamado-novo';
import { HomeOfflinePage } from './../pages/home-offline/home-offline';
import { ChamadoMateriaisNovoPage } from './../pages/chamado-materiais-novo/chamado-materiais-novo';

import * as GalleryModal from 'ionic-gallery-modal';

// Desenvolvimento
// declare var SQL;
// class SQLiteObject {
//   _objectInstance: any;

//   constructor(_objectInstance: any) {
//     this._objectInstance = _objectInstance;
//   };

//   executeSql(statement: string, params: any): Promise<any> {

//     return new Promise((resolve, reject) => {
//       try {
//         var st = this._objectInstance.prepare(statement, params);
//         var rows: Array<any> = [];
//         while (st.step()) {
//           var row = st.getAsObject();
//           rows.push(row);
//         }
//         var payload = {
//           rows: {
//             item: function (i) {
//               return rows[i];
//             },
//             length: rows.length
//           },
//           rowsAffected: this._objectInstance.getRowsModified() || 0,
//           insertId: this._objectInstance.insertId || void 0
//         };

//         //save database after each sql query 

//         var arr: ArrayBuffer = this._objectInstance.export();
//         localStorage.setItem("database", String(arr));
//         resolve(payload);
//       } catch (e) {
//         reject(e);
//       }
//     });
//   };
// }

// class SQLiteMock {
//   public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
//     var db;
//     var storeddb = localStorage.getItem("database");

//     if (storeddb) {
//       var arr = storeddb.split(',');
//       db = new SQL.Database(arr);
//     }
//     else {
//       db = new SQL.Database();
//     }

//     return new Promise((resolve, reject) => {
//       resolve(new SQLiteObject(db));
//     });
//   }
// }

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
    ChamadosEquipamentoPage,
    ChamadoNovoPage,
    HomeOfflinePage,
    ChamadoMateriaisNovoPage,
    ChamadosOfflinePage
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
    ChamadosOfflinePage,
    TabsPage,
    LoginPage,
    ChamadoDetalhesPage,
    ChamadoAnexosPage,
    ChamadoMapaPage,
    ChamadoHistoricoPage,
    ChamadoMateriaisPage,
    ChamadoMovimentacaoPage,
    ChamadosEquipamentoPage,
    ChamadoNovoPage,
    HomeOfflinePage,
    ChamadoMateriaisNovoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConfigLoginProvider,
    AlertsProvider,
    ChamadosProvider,
    UsuariosProvider,
    ConstantesProvider,
    { provide: BrowserModule, useClass: GalleryModal.GalleryModalHammerConfig },
    UteisProvider,
    Network,
    OfflineProvider,
    SQLite
    //{ provide: SQLite, useClass: SQLiteMock }
  ]
})
export class AppModule { }
