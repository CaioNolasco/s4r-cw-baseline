import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { ConstantesProvider } from '../constantes/constantes';
import { ConfigLoginProvider } from '../config-login/config-login';

@Injectable()
@Component({
  providers: [
    ConstantesProvider,
    ConfigLoginProvider
  ]
})

export class ChamadosProvider {

  //Propriedades
  private urlApiChamados = "/api/chamados";

  //Load
  constructor(public http: Http, public platform: Platform, public constantes: ConstantesProvider) {
    if (!this.platform.is("cordova")) {
      this.urlApiChamados = "/chamadosapi";
    }
    else {
      this.urlApiChamados = this.constantes.urlApiBaseline + this.urlApiChamados;
    }
  }

  //Retornos
  retornarChamadosAbertos(usuario: string, portal: string, pagina = 1, tamanhoPagina = 10) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadosAbertos/${usuario}/${portal}/${pagina}/${tamanhoPagina}`);
  }

  retornarChamadoPorNumeroUsuario(usuario: string, portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadoPorNumero/${usuario}/${portal}/${numero}`);
  }

  retornarChamadoPorNumero(portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadoPorNumero/${portal}/${numero}`);
  }

  retornarAnexosChamado(usuario: string, portal: string, numero: string){
    return this.http.get(this.urlApiChamados + `/RetornarAnexosChamado/${usuario}/${portal}/${numero}`);
  }

  retornarHistoricoChamado(portal: string, numero: string){
    return this.http.get(this.urlApiChamados + `/RetornarHistoricoChamado/${portal}/${numero}`);
  }

  retornarMateriaisChamado(portal: string, numero: string){
    return this.http.get(this.urlApiChamados + `/RetornarMateriaisChamado/${portal}/${numero}`);
  }

  retornarChamadosEquipamento(usuario: string, portal: string, equipamento: string, pagina = 1, tamanhoPagina = 10){
    return this.http.get(this.urlApiChamados + `/RetornarChamadosEquipamento/${usuario}/${portal}/${equipamento}/${pagina}/${tamanhoPagina}`);
  }

  retornarAcoes(portal: string){
    return this.http.get(this.urlApiChamados + `/RetornarAcoes/${portal}`);
  }

  retornarStatus(portal: string){
    return this.http.get(this.urlApiChamados + `/RetornarStatus/${portal}`);
  }

  retornarBytesAnexo(caminho: string, portal: string, numero: string){
    return this.http.get(this.urlApiChamados + `/RetornarBytesAnexo/${caminho}/${portal}/${numero}`);
  }
}
