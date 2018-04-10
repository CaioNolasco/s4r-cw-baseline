import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { OfflineProvider } from '../../providers/offline/offline';
import { UsuariosProvider } from './../../providers/usuarios/usuarios';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ConstantesProvider } from '../../providers/constantes/constantes';

import { HomePage } from '../home/home';
import { RelatoriosPage } from './../relatorios/relatorios';
import { ChamadosOfflinePage } from './../chamados-offline/chamados-offline';




@Component({
  templateUrl: 'tabs.html',
  providers: [
    OfflineProvider,
    UsuariosProvider,
    ConfigLoginProvider,
    ConstantesProvider
  ]
})
export class TabsPage {

  //Propriedades
  tab1Root = HomePage;
  tab2Root = RelatoriosPage;
  tab3Root = ChamadosOfflinePage
  badgesOffline: string;
  username: string;
  portal: string;
  permissoesChamado: any;
  alterarChamado: boolean = false;

  //Load
  constructor(public offlineProvider: OfflineProvider, public events: Events, public usuariosProvider: UsuariosProvider,
  public configLoginProvider: ConfigLoginProvider, public constantesProvider: ConstantesProvider) {
    this.carregarDados();
  }

  //Ações
  carregarDados() {
    try {
      this.carregarBadge();

      let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

      if (_configLoginProvider) {
        this.username = _configLoginProvider.username;
        this.portal = _configLoginProvider.portal;
      
        this.carregarPermissoesChamado();
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarBadge() {
    this.events.subscribe('badge:exibir', () => {
      this.badgesOffline = this.offlineProvider.retornarConfigBadgesOffline();
    });

    this.badgesOffline = this.offlineProvider.retornarConfigBadgesOffline();
  }

  carregarPermissoesChamado(){
    try{
      this.usuariosProvider.retornarPermissoesFuncionalidade(this.username, this.portal, this.constantesProvider.funcCadastroChamadoCorretivo).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.permissoesChamado = _objetoRetorno;

         this.alterarChamado = this.usuariosProvider.validarPermissoes(this.permissoesChamado, this.constantesProvider.acaoAlterar);      
        }
      )
    }
    catch (e) {
      console.log(e);
    }
  }
}
