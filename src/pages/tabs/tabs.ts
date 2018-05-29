import { Component } from '@angular/core';
import { Events, NavParams } from 'ionic-angular';

import { OfflineProvider } from '../../providers/offline/offline';
import { UsuariosProvider } from './../../providers/usuarios/usuarios';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ConstantesProvider } from '../../providers/constantes/constantes';

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
  tab1Root = "HomePage";
  tab2Root = "RelatoriosPage";
  tab3Root = "ChamadosOfflinePage";
  badgesOffline: string;
  username: string;
  portal: string;
  relatorios: string;
  sincronizacao: string;
  index: number;
  permissoesChamado: any;
  alterarChamado: boolean = false;

  //Load
  constructor(public offlineProvider: OfflineProvider, public events: Events, public usuariosProvider: UsuariosProvider,
    public configLoginProvider: ConfigLoginProvider, public constantesProvider: ConstantesProvider, public navParams: NavParams) {
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
    }, e => {
      console.log(e);
    });;

    this.badgesOffline = this.offlineProvider.retornarConfigBadgesOffline();
  }

  carregarPermissoesChamado() {
    try {
      this.usuariosProvider.retornarPermissoesFuncionalidade(this.username, this.portal, this.constantesProvider.funcCadastroChamadoCorretivo).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.permissoesChamado = _objetoRetorno;

          this.alterarChamado = this.usuariosProvider.validarPermissoes(this.permissoesChamado, this.constantesProvider.acaoAlterar);
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }
}
