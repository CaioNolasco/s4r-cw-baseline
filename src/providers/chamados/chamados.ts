import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

import { ConstantesProvider } from '../constantes/constantes';

@Injectable()

export class ChamadosProvider {

  //Propriedades
  private urlApiChamados: string = "/api/chamados";

  //Load
  constructor(public http: Http, public platform: Platform, public constantesProvider: ConstantesProvider) {
    this.urlApiChamados = this.constantesProvider.urlApiBaseline + this.urlApiChamados;
  }

  //Ações
  salvarRegistroMovimentacoes(usuario: string, portal: string, numero: string, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarRegistroMovimentacoes/${usuario}/${portal}/${numero}/${idioma}`, parametros, _opcoes);
  }

  salvarMaterial(usuario: string, portal: string, numero: string, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarMaterial/${usuario}/${portal}/${numero}/${idioma}`, parametros, _opcoes);
  }

  salvarOffline(usuario: string, portal: string, numero: string, offline: boolean, idioma: string) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarOffline/${usuario}/${portal}/${numero}/${offline}/${idioma}`, _opcoes);
  }

  salvarSincronizacao(usuario: string, portal: string, numero: string, 
    tipo1: string, tipo2: string,  offline: boolean, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarSincronizacao/${usuario}/${portal}/${numero}/${offline}/${tipo1}/${tipo2}/${idioma}`, parametros, _opcoes);
  }

  salvarChamado(usuario: string, portal: string, tipo: string, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarChamado/${usuario}/${portal}/${tipo}/${idioma}`, parametros, _opcoes);
  }

  salvarAprovacao(usuario: string, portal: string, numero: string, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarAprovacao/${usuario}/${portal}/${numero}/${idioma}`, parametros, _opcoes);
  }

  salvarOs(usuario: string, portal: string, numero: string, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarOs/${usuario}/${portal}/${numero}/${idioma}`, parametros, _opcoes);
  }

  salvarAnexo(usuario: string, portal: string, numero: string, tipo: string, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarAnexo/${usuario}/${portal}/${numero}/${tipo}/${idioma}`, parametros, _opcoes);
  }

  salvarRotina(usuario: string, portal: string, numero: string, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarRotina/${usuario}/${portal}/${numero}/${idioma}`, parametros, _opcoes);
  }

  salvarConsumivel(usuario: string, portal: string, numero: string, idioma: string, parametros: any) {
    let _headers = new Headers();
    _headers.append("Accept", 'application/json');
    _headers.append('Content-Type', 'application/json');

    let _opcoes = new RequestOptions({ headers: _headers });

    return this.http.post(this.urlApiChamados + `/SalvarConsumivel/${usuario}/${portal}/${numero}/${idioma}`, parametros, _opcoes);
  }

  excluirMaterial(usuario: string, portal: string, numero: string, material: string, idioma: string) {
    return this.http.delete(this.urlApiChamados + `/ExcluirMaterial/${usuario}/${portal}/${numero}/${material}/${idioma}`);
  }

  excluirAnexo(usuario: string, portal: string, numero: string, anexo: string, tipo: string, idioma: string) {
    return this.http.delete(this.urlApiChamados + `/ExcluirAnexo/${usuario}/${portal}/${numero}/${anexo}/${tipo}/${idioma}`);
  }

  excluirChamado(usuario: string, portal: string, numero: string, idioma: string) {
    return this.http.delete(this.urlApiChamados + `/ExcluirChamado/${usuario}/${portal}/${numero}/${idioma}`);
  }

  //Retornos
  retornarChamadosAbertos(usuario: string, portal: string, pagina = 1, tamanhoPagina = 10) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadosAbertos/${usuario}/${portal}/${pagina}/${tamanhoPagina}`);
  }

  retornarChamadosConsumiveis(usuario: string, portal: string, pagina = 1, tamanhoPagina = 10) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadosConsumiveis/${usuario}/${portal}/${pagina}/${tamanhoPagina}`);
  }

  retornarChamadoPorNumeroUsuario(usuario: string, portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadoPorNumero/${usuario}/${portal}/${numero}`);
  }

  retornarChamadoDetalhes(usuario: string, portal: string, numero: string, idioma: string) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadoDetalhes/${usuario}/${portal}/${numero}/${idioma}`);
  }

  retornarAnexosChamado(portal: string, numero: string, tipo: string) {
    return this.http.get(this.urlApiChamados + `/RetornarAnexosChamado/${portal}/${numero}/${tipo}`);
  }

  retornarFotosChamado(portal: string, numero: string, tipo: string, base64: boolean) {
    return this.http.get(this.urlApiChamados + `/RetornarFotosChamado/${portal}/${numero}/${tipo}/${base64}`);
  }

  retornarHistoricoChamado(portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarHistoricoChamado/${portal}/${numero}`);
  }

  retornarMateriaisChamado(portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarMateriaisChamado/${portal}/${numero}`);
  }

  retornarChamadosEquipamento(usuario: string, portal: string, equipamento: string, pagina = 1, tamanhoPagina = 10) {
    return this.http.get(this.urlApiChamados + `/RetornarChamadosEquipamento/${usuario}/${portal}/${equipamento}/${pagina}/${tamanhoPagina}`);
  }

  retornarSubtipos(portal: string, tipoServico: string, tipo: string) {
    return this.http.get(this.urlApiChamados + `/RetornarSubtipos/${portal}/${tipoServico}/${tipo}`);
  }

  retornarStatus(usuario: string, portal: string, numero: string, idioma: string) {
    return this.http.get(this.urlApiChamados + `/RetornarStatus/${usuario}/${portal}/${numero}/${idioma}`);
  }

  retornarTiposServico(portal: string) {
    return this.http.get(this.urlApiChamados + `/RetornarTiposServico/${portal}`);
  }

  retornarMarcasMaterial(portal: string) {
    return this.http.get(this.urlApiChamados + `/RetornarMarcasMaterial/${portal}`);
  }

  retornarModelosMaterial(portal: string, marcaMaterial: string) {
    return this.http.get(this.urlApiChamados + `/RetornarModelosMaterial/${portal}/${marcaMaterial}`);
  }

  retornarValoresModelo(portal: string, modeloMaterial: string) {
    return this.http.get(this.urlApiChamados + `/RetornarValoresModelo/${portal}/${modeloMaterial}`);
  }

  retornarValoresOs(portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarValoresOs/${portal}/${numero}`);
  }

  retornarPrazoSlaStatus(portal: string, numero: string, status: string, idioma: string) {
    return this.http.get(this.urlApiChamados + `/RetornarPrazoSlaStatus/${portal}/${numero}/${status}/${idioma}`);
  }


  retornarBytesAnexo(nomeAnexo: string, portal: string, numero: string, tipo: string) {
    return this.http.get(this.urlApiChamados + `/RetornarBytesAnexo/${nomeAnexo}/${portal}/${numero}/${tipo}`);
  }

  retornarPontosVenda(portal: string, codigoPontoVenda: string) {
    return this.http.get(this.urlApiChamados + `/RetornarPontosVenda/${portal}/${codigoPontoVenda}`);
  }

  retornarTodosPontosVenda(portal: string) {
    return this.http.get(this.urlApiChamados + `/RetornarPontosVenda/${portal}`);
  }

  retornarValoresPontoVenda(portal: string, pontoVenda: string) {
    return this.http.get(this.urlApiChamados + `/RetornarValoresPontoVenda/${portal}/${pontoVenda}`);
  }

  retornarCriticidades(portal: string, idioma: string) {
    return this.http.get(this.urlApiChamados + `/RetornarCriticidades/${portal}/${idioma}`);
  }

  retornarMantenedores(portal: string, tipoServico: string, pontoVenda: string) {
    return this.http.get(this.urlApiChamados + `/RetornarMantenedores/${portal}/${tipoServico}/${pontoVenda}`);
  }

  retornarLocalizacoes(portal: string, pontoVenda: string) {
    return this.http.get(this.urlApiChamados + `/RetornarLocalizacoes/${portal}/${pontoVenda}`);
  }

  retornarEquipamentos(portal: string, localizacao: string) {
    return this.http.get(this.urlApiChamados + `/RetornarEquipamentos/${portal}/${localizacao}`);
  }

  retornarLocalizacoesEquipamento(portal: string, equipamento: string, pontoVenda: string) {
    return this.http.get(this.urlApiChamados + `/RetornarLocalizacoesEquipamento/${portal}/${equipamento}/${pontoVenda}`);
  }

  retornarValoresSla(portal: string, tipoServico: string, prioridadePontoVenda: string, criticidade: string, idioma: string) {
    return this.http.get(this.urlApiChamados + `/RetornarValoresSla/${portal}/${tipoServico}/${prioridadePontoVenda}/${criticidade}/${idioma}`);
  }

  retornarValoresSlaPrioridade(portal: string, tipoServico: string, prioridadePontoVenda: string, idioma: string) {
    return this.http.get(this.urlApiChamados + `/RetornarValoresSlaPrioridade/${portal}/${tipoServico}/${prioridadePontoVenda}/${idioma}`);
  }

  retornarRotinaChamado(portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarRotinaChamado/${portal}/${numero}`);
  }

  retornarVinculoMantenedor(usuario: string, portal: string, mantenedor: string, idioma: string){
    return this.http.get(this.urlApiChamados + `/RetornarVinculoMantenedor/${usuario}/${portal}/${mantenedor}/${idioma}`);
  }

  retornarConsumivel(portal: string, numero: string) {
    return this.http.get(this.urlApiChamados + `/RetornarConsumivel/${portal}/${numero}`);
  }

  retornarEquipamento(portal: string, equipamento: string) {
    return this.http.get(this.urlApiChamados + `/RetornarEquipamento/${portal}/${equipamento}`);
  }
}