import { Injectable } from '@angular/core';

import { AlertsProvider } from './../alerts/alerts';
import { ConstantesProvider } from './../constantes/constantes';
import { UteisProvider } from './../uteis/uteis';

@Injectable()

export class ConfigLoginProvider {
  //Propriedades
  configLoginKey: string = "configLogin";
  configLoginPortaisKey: string = "configLoginPortais";
  configLoginIdiomasKey: string = "configLoginIdiomas";

  configLogin: any = { username: "", password: "", portal: "", nomePortal: "" };
  configLoginPortais: any = { valor: "", texto: "" };
  configLoginIdiomas: any = {icone: "", valor: ""}; 

  //Load
  constructor(private alertsProvider: AlertsProvider, public uteisProvider: UteisProvider, public constantesProvider: ConstantesProvider) {
  }

  //Ações
  salvarConfigLogin(username?: string, password?: string, portal?: string, nomePortal?: string) {
    if (username) {
      this.configLogin.username = username;
    }

    if (password) {
      this.configLogin.password = password;
    }

    if (portal) {
      this.configLogin.portal = portal;
    }

    this.configLogin.nomePortal = nomePortal != "" ? nomePortal : "Portal";

    localStorage.setItem(this.configLoginKey, JSON.stringify(this.configLogin));
  }

  salvarConfigLoginPortais(valor: string, texto: string) {
    let _configLoginPortais = JSON.parse(this.retornarConfigLoginPortais());

    this.configLoginPortais.valor = valor;
    this.configLoginPortais.texto = texto;

    if (_configLoginPortais) {
      let _index = _configLoginPortais.findIndex(x => x.valor == this.configLoginPortais.valor)

      if (_index === -1) {
        _configLoginPortais.push(this.configLoginPortais);
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgValorExistente), 
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
      }
    }
    else {
      _configLoginPortais = [this.configLoginPortais];
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
    }

    localStorage.setItem(this.configLoginPortaisKey, JSON.stringify(_configLoginPortais));
  }

  salvarConfigLoginIdiomas(icone: string, valor: string){
    this.configLoginIdiomas.icone = icone;
    this.configLoginIdiomas.valor = valor;
   
    localStorage.setItem(this.configLoginIdiomasKey, JSON.stringify(this.configLoginIdiomas));
  }

  removerConfigLogin() {
    localStorage.removeItem(this.configLoginKey);
  }

  removerConfigLoginIdiomas() {
    localStorage.removeItem(this.configLoginIdiomasKey);
  }

  //Retornos
  retornarConfigLogin(): any {
    return localStorage.getItem(this.configLoginKey);
  }

  retornarConfigLoginPortais(): any {
    return localStorage.getItem(this.configLoginPortaisKey);
  }

  retornarConfigLoginIdiomas(): any {
    return localStorage.getItem(this.configLoginIdiomasKey);
  }
}
