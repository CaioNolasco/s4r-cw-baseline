import { Http } from '@angular/http';
import { Injectable, Component } from '@angular/core';

import { ConstantesProvider } from '../constantes/constantes';

@Injectable()
@Component({
  providers: [
    ConstantesProvider
   ]
})
export class RelatoriosProvider {
 //Propriedades
 private urlApiRelatorios: string = "/api/relatorios";

  //Load
  constructor(public http: Http, public constantesProvider: ConstantesProvider) {
    this.urlApiRelatorios = this.constantesProvider.urlApiBaseline + this.urlApiRelatorios;
  }

  //Retornos
  retornarChamadosAbertosFechados(usuario: string, portal: string, mes: number, ano: number) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosAbertosFechados/${usuario}/${portal}/${mes}/${ano}`);
  }

  retornarChamadosDentroForaPrazo(usuario: string, portal: string) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosDentroForaPrazo/${usuario}/${portal}`);
  }

  retornarChamadosEvolucao(usuario: string, portal: string) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosEvolucao/${usuario}/${portal}`);
  }
}
