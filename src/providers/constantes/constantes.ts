import { Injectable } from '@angular/core';


@Injectable()
export class ConstantesProvider {
  //Url
  urlApiBaseline = "https://cw-portalfacilities-mobile.azurewebsites.net";
  //urlApiBaseline = "http://localhost:49608/";

  //Subtipos
  subtipoAcao = "Ações";

  //Funcionalidades
  funcCadastroChamadoCorretivo = "CadastroChamadoCorretivo";

  //Ações
  acaoCadastrar = "Cadastrar";
  acaoAlterar = "Alterar";
  acaoExcluir = "Excluir";

  constructor() {
  }

}
