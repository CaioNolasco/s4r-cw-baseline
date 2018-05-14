import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';

import { ConstantesProvider } from '../../providers/constantes/constantes';

import { ChamadoAnexosPage } from '../chamado-anexos/chamado-anexos';
import { ChamadoMovimentacaoPage } from '../chamado-movimentacao/chamado-movimentacao';
import { ChamadoMateriaisPage } from '../chamado-materiais/chamado-materiais';
import { ChamadoRotinaPage } from '../chamado-rotina/chamado-rotina';
import { ChamadoHistoricoPage } from '../chamado-historico/chamado-historico';

@IonicPage()
@Component({
  selector: 'page-chamado-detalhes-popover',
  templateUrl: 'chamado-detalhes-popover.html',
  providers: [ConstantesProvider]})
export class ChamadoDetalhesPopoverPage {
  //Propriedades
  chamadoId: string;
  habilitarChamado: boolean;
  tipoChamadoPreventivo: number;
  tipoServicoId: any;
  chamadoDetalhesPage: any
  tipoChamado: any;
  origemOffline: boolean = false;
  alterarChamado: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public viewCtrl: ViewController,
    public constantesProvider: ConstantesProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
  }

  //Ações
  carregarDados() {
    try{
      this.tipoChamadoPreventivo = this.constantesProvider.tipoChamadoPreventivo;
      this.chamadoId = this.navParams.get("ChamadoID");
      this.habilitarChamado = this.navParams.get("HabilitarChamado");
      this.origemOffline = this.navParams.get("OrigemOffline");
      this.alterarChamado = this.navParams.get("AlterarChamado");
      this.tipoServicoId = this.navParams.get("TipoServicoID");
      this.tipoChamado = this.navParams.get("TipoChamado");
      this.chamadoDetalhesPage = this.navParams.get("ChamadoDetalhesPage");
    }
    catch (e) {
      console.log(e);
    }
  }

  //Eventos
  anexosClick() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().push(ChamadoAnexosPage, {
      ChamadoID: this.chamadoId,
      HabilitarChamado: this.habilitarChamado,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  movimentacaoClick() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().push(ChamadoMovimentacaoPage, {
      ChamadoID: this.chamadoId,
      TipoServicoID: this.tipoServicoId,
      "ChamadoDetalhesPage": this.chamadoDetalhesPage,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  materiaisClick() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().push(ChamadoMateriaisPage, {
      ChamadoID: this.chamadoId,
      HabilitarChamado: this.habilitarChamado,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  rotinaClick() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().push(ChamadoRotinaPage, {
      ChamadoID: this.chamadoId,
      OrigemOffline: this.origemOffline,
      HabilitarChamado: this.habilitarChamado,
      AlterarChamado: this.alterarChamado
    });
  }

  historicoClick() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().push(ChamadoHistoricoPage, { 
      ChamadoID: this.chamadoId, 
      OrigemOffline: this.origemOffline 
    });
  }
}
