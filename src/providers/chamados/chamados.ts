import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable, Component } from '@angular/core';

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
    //if (!this.platform.is("cordova")) {
      //this.urlApiChamados = "/chamadosapi";
    //}
    //else {
      this.urlApiChamados = this.constantes.urlApiBaseline + this.urlApiChamados;
    //}
  }

  //Ações
  salvarRegistroMovimentacoes(usuario: string, portal: string, numero: string, parametros: any){
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarRegistroMovimentacoes/${usuario}/${portal}/${numero}`, parametros, _opcoes);
  }

  salvarMaterial(usuario: string, portal: string, numero: string, parametros: any){
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });
    
    return this.http.post(this.urlApiChamados + `/SalvarMaterial/${usuario}/${portal}/${numero}`, parametros, _opcoes);
  }

  salvarOffline(usuario: string, portal: string, numero: string, offline: boolean){
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });
    
    return this.http.post(this.urlApiChamados + `/SalvarOffline/${usuario}/${portal}/${numero}/${offline}`, _opcoes);
  }

  salvarSincronizacao(usuario: string, portal: string, numero: string, offline: boolean, parametros: any){
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarSincronizacao/${usuario}/${portal}/${numero}/${offline}`, parametros, _opcoes);
  }

  excluirMaterial(usuario: string, portal: string, numero: string, material: string){
    return this.http.delete(this.urlApiChamados + `/ExcluirMaterial/${usuario}/${portal}/${numero}/${material}`);
  }

  excluirAnexo(usuario: string, portal: string, numero: string, anexo: string){
    return this.http.delete(this.urlApiChamados + `/ExcluirAnexo/${usuario}/${portal}/${numero}/${anexo}`);
  }

  //Retornos
  retornarChamadosAbertos(usuario: string, portal: string, pagina = 1, tamanhoPagina = 10) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadosAbertos/${usuario}/${portal}/${pagina}/${tamanhoPagina}`);
  }

  retornarChamadoPorNumeroUsuario(usuario: string, portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadoPorNumero/${usuario}/${portal}/${numero}`);
  }

  retornarChamadoDetalhes(usuario: string, portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadoDetalhes/${usuario}/${portal}/${numero}`);
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

  retornarSubtipos(portal: string, tipoServico: string, tipo: string){
    return this.http.get(this.urlApiChamados + `/RetornarSubtipos/${portal}/${tipoServico}/${tipo}`);
  }

  retornarStatus(portal: string){
    return this.http.get(this.urlApiChamados + `/RetornarStatus/${portal}`);
  }

  retornarTiposServico(portal: string){
    return this.http.get(this.urlApiChamados + `/RetornarTiposServico/${portal}`);
  }

  retornarMarcasMaterial(portal: string){
    return this.http.get(this.urlApiChamados + `/RetornarMarcasMaterial/${portal}`);
  }

  retornarModelosMaterial(portal: string, marcaMaterial: string){
    return this.http.get(this.urlApiChamados + `/RetornarModelosMaterial/${portal}/${marcaMaterial}`);
  }

  retornarValoresModelo(portal: string, modeloMaterial: string) {
    return this.http.get(this.urlApiChamados + `/RetornarValoresModelo/${portal}/${modeloMaterial}`);
  }

  retornarBytesAnexo(nomeAnexo: string, portal: string, numero: string){
    return this.http.get(this.urlApiChamados + `/RetornarBytesAnexo/${nomeAnexo}/${portal}/${numero}`);
  }
}
