import { Injectable } from '@angular/core';


@Injectable()
export class ConstantesProvider {
  //Url
  urlApiBaseline: string = "http://cwfacilities6377.cloudapp.net:9999";
  //urlApiBaseline: string = "http://192.168.100.211:49608/";

  //Subtipos
  subtipoAcao: string = "Ações";
  subtipoCausas: string = "Causas";

  //Funcionalidades
  funcCadastroChamadoCorretivo: string = "CadastroChamadoCorretivo";

  //Ações
  acaoCadastrar: string = "Cadastrar";
  acaoAlterar: string = "Alterar";
  acaoExcluir: string = "Excluir";

  //Títulos
  tituloDadosBasicos: string = "Dados Básicos";
  tituloChamado: string = "Chamado";

  //Campos
  campoEmailSolicitante: string = "E-mail do Solicitante";

  constructor() {
  }

}
