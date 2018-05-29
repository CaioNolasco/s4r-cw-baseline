import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { ConstantesProvider } from '../constantes/constantes';

 @Injectable()

export class RelatoriosProvider {
 //Propriedades
 private urlApiRelatorios: string = "/api/relatorios";

  //Load
  constructor(public http: Http, public constantesProvider: ConstantesProvider) {
    this.urlApiRelatorios = this.constantesProvider.urlApiBaseline + this.urlApiRelatorios;
  }

  //Retornos
  retornarChamadosAbertosFechados(usuario: string, portal: string, mes: number, ano: number, idioma: string) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosAbertosFechados/${usuario}/${portal}/${mes}/${ano}/${idioma}`);
  }

  retornarChamadosDentroForaPrazo(usuario: string, portal: string, idioma: string) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosDentroForaPrazo/${usuario}/${portal}/${idioma}`);
  }

  retornarChamadosEvolucao(usuario: string, portal: string, idioma: string) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosEvolucao/${usuario}/${portal}/${idioma}`);
  }
}
