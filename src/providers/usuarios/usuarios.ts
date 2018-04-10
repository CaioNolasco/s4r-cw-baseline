import { Platform, App } from 'ionic-angular';
import { Http } from '@angular/http';
import { Injectable, Component } from '@angular/core';

import { ConstantesProvider } from '../constantes/constantes';
import { ConfigLoginProvider } from '../config-login/config-login';
import { OfflineProvider } from '../offline/offline';

import { LoginPage } from './../../pages/login/login';

@Injectable()
@Component({ providers: [
  ConstantesProvider,
  ConfigLoginProvider,
  OfflineProvider
] })

export class UsuariosProvider {

  private urlApiUsuarios = "/api/usuarios";

  constructor(public http: Http, public platform: Platform, public constantes: ConstantesProvider,
    public configLoginProvider: ConfigLoginProvider, public app: App, public offlineProvider: OfflineProvider) {
    //if(!this.platform.is("cordova")){
      //this.urlApiUsuarios = "/usuariosapi";
    //}
    //else{
      this.urlApiUsuarios = this.constantes.urlApiBaseline + this.urlApiUsuarios;
    //}
  }

  //Ações
  logoutUsuario(){
    this.configLoginProvider.removerConfigLogin();
    this.offlineProvider.removerConfigBadgesOffline();
    
    this.app.getRootNav().setRoot(LoginPage);
  }

  validarPermissoes(permissoes: any, acao: string){
    if (permissoes[0]) {
      if(permissoes.some(item => item.Acao === acao)){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }

  //Retornos
  retornarUsuarioAutenticado(usuario: string, senha: string, portal: string){
    return this.http.get(this.urlApiUsuarios + `/RetornarUsuarioAutenticado/${usuario}/${senha}/${portal}`);
  }

  retornarPermissoesFuncionalidade(usuario: string, portal: string, funcionalidade: string){
    return this.http.get(this.urlApiUsuarios + `/RetornarPermissoesFuncionalidade/${usuario}/${portal}/${funcionalidade}`);
  }
}
