import { Injectable, Component } from '@angular/core';

import { AlertsProvider } from './../alerts/alerts';

@Injectable()
@Component({ providers: [AlertsProvider] })

export class ConfigLoginProvider {
  //Propriedades
  configLoginKey: string = "configLogin";
  configLoginPortaisKey: string = "configLoginPortais";

  configLogin = { username: "", password: "", portal: "", nomePortal: "" };
  configLoginPortais = { valor: "", texto: "" };

  //Load
  constructor(private alertsProvider: AlertsProvider) {
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
      this.alertsProvider.exibirToast(this.alertsProvider.msgSucesso, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
    }
    else {
      this.alertsProvider.exibirToast(this.alertsProvider.msgValorExistente, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
    }
  }
  else {
    _configLoginPortais = [this.configLoginPortais];
    this.alertsProvider.exibirToast(this.alertsProvider.msgSucesso, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
  }

  localStorage.setItem(this.configLoginPortaisKey, JSON.stringify(_configLoginPortais));
}

removerConfigLogin() {
  localStorage.removeItem(this.configLoginKey);
}

  //Retornos
  retornarConfigLogin(): any {
    return localStorage.getItem(this.configLoginKey);
  }

  retornarConfigLoginPortais(): any {
    return localStorage.getItem(this.configLoginPortaisKey);
  }
}
