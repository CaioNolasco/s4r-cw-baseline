import { Injectable } from '@angular/core';


@Injectable()
export class ConstantesProvider {
  //Url
  //urlApiBaseline: string = "http://cwfacilities6377.cloudapp.net:9999";
  urlApiBaseline: string = "http://192.168.100.207:49608/";

  //Subtipos
  subtipoAcao: string = "Ações";
  subtipoCausas: string = "Causas";

  //Funcionalidades
  funcCadastroChamadoCorretivo: string = "CadastroChamadoCorretivo";

  //Ações
  acaoCadastrar: string = "Cadastrar";
  acaoAlterar: string = "Alterar";
  acaoExcluir: string = "Excluir";
  acaoMovimentacao: string = "Movimentação";
  acaoSincronizacao: string = "Sincronização";

  //Títulos
  tituloDadosBasicos: string = "Dados Básicos";
  tituloChamado: string = "Chamado";

  //Campos
  campoEmailSolicitante: string = "E-mail do Solicitante";

  //Chamados
  tipoChamadoCorretivo: number = 0;
  tipoChamadoPreventivo: number = 1;

  //Chaves
  tipoAnexos = "Anexos";
  tipoRotinas = "Rotinas";
  
  //Relatórios
  nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  backgroundColors = ['rgba(255,99,132, 0.4)', 'rgba(54, 162, 235, 0.4)',  'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)', 'rgba(153, 102, 255, 0.4)', 'rgba(255, 159, 64, 0.4)']
  
  constructor() {
  }

}
