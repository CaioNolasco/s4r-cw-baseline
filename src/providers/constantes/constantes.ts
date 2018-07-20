import { Injectable } from '@angular/core';


@Injectable()
export class ConstantesProvider {
  //Url
  //urlApiBaseline: string = "http://cwfacilities6377.cloudapp.net:9999";
  urlApiBaseline: string = "http://192.168.100.199:49608/";

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
  campoEmailSolicitante: string = "E-mail";

  //Chamados
  tipoChamadoCorretivo: number = 0;
  tipoChamadoPreventivo: number = 1;
  tipoChamadoConsumivel: number = 2;

  //Chaves
  tipoAnexos = "Anexos";
  tipoRotinas = "Rotinas";
  tipoConsumiveis = "Consumiveis";
  
  //Perfis 
  perfilOperadorCushman = 1;
  perfilAdministradorCushman = 2;
  perfilAdministradorTI = 3;
  perfilCliente = 4;
  perfilMantenedor = 5;
  perfilOperador = 6;

  //Relatórios
  nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  backgroundColors = ['rgba(255,99,132, 0.4)', 'rgba(54, 162, 235, 0.4)',  'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)', 'rgba(153, 102, 255, 0.4)', 'rgba(255, 159, 64, 0.4)']
  
  //Idiomas
  opcoesIdiomas = [{icone: 'custom-brazil', valor: 'pt', texto: 'Português'}, 
  {icone: 'custom-united-states', valor: 'en', texto: 'English'},
  {icone: 'custom-spain', valor: 'es', texto: 'Español'}];
  
  //Chaves Idiomas
  chaveAlerta = "alerta";
  chaveAtualizar = "atualizar";
  chaveConfirmar = "confirmar";
  chaveCancelar = "cancelar";
  chaveNavegar = "navegar";
  chaveFiltrar = "filtrar";
  chaveNumeroChamado = "numeroChamado";
  chaveMsgValorExistente = "msgValorExistente";
  chaveMsgSucesso = "msgSucesso";
  chaveMsgErro = "msgErro";
  chaveMsgErroAcesso = "msgErroAcesso";
  chaveMsgErroAcessoConfig = "msgErroAcessoConfig";
  chaveMsgErroCampos = "msgErroCampos";
  chaveMsgErroCampo = "msgErroCampo";
  chaveMsgErroPortal = "msgErroPortal";
  chaveMsgErroRotina = "msgErroRotina";
  chaveMsgAguarde = "msgAguarde";
  chaveMsgNenhumItem = "msgNenhumItem";
  chaveMsgConfirmacao = "msgConfirmacao";
  chaveMsgConfirmacaoEstrutura = "msgConfirmacaoEstrutura";
  chaveMsgConfirmarAtualizarEstrutura = "msgConfirmarAtualizarEstrutura";
  chaveMsgEscolhaAcao = "msgEscolhaAcao";
  chaveMsgOffline = "msgOffline";
  chaveMsgPortal = "msgPortal";
  chaveMsgErroEquipamento = "msgErroEquipamento";
  chaveMsgSucessoLeituraEquipamento = "msgSucessoLeituraEquipamento";
  chaveMsgSucessoLeituraSemEquipamento = "msgSucessoLeituraSemEquipamento";
  chaveMsgErroSincronizacaoConsumivel = "msgErroSincronizacaoConsumivel";

  //Portais
  portalBaseline = "PortalBaseline";
  portalBancoPan = "PortalBancoPan";
  portalBankBoston = "PortalBankBoston";
  portalNike = "PortalNike";
  portalCushman = "PortalCushman";
  portalDespegar = "PortalDespegar";
  portalCarrefour = "PortalCarrefour";
  portalItauPredial = "PortalItauPredial";
  portalBradescoPredial = "PortalBradescoPredial";
  portalSaoCarlos = "PortalSaoCarlos";
  portalLMB = "PortalLMB";
  portalBunge = "PortalBunge";

  constructor() {
  }

}
