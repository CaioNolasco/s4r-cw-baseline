import { LoginPage } from './../../pages/login/login';
import { Platform, App } from 'ionic-angular';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { ConstantesProvider } from '../constantes/constantes';
import { ConfigLoginProvider } from '../config-login/config-login';

@Injectable()
@Component({ providers: [
  ConstantesProvider,
  ConfigLoginProvider
] })

export class UsuariosProvider {

  private urlApiUsuarios = "/api/usuarios";

  constructor(public http: Http, public platform: Platform, public constantes: ConstantesProvider,
    public configLoginProvider: ConfigLoginProvider, public app: App) {
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

    this.app.getRootNav().setRoot(LoginPage);
  }

  //Retornos
  retornarUsuarioAutenticado(usuario: string, senha: string, portal: string){
    alert(this.urlApiUsuarios);
    return this.http.get(this.urlApiUsuarios + `/RetornarUsuarioAutenticado/${usuario}/${senha}/${portal}`);
  }
}
