import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { ChamadoAnexosPage } from './../chamado-anexos/chamado-anexos';
import { ChamadoMapaPage } from './../chamado-mapa/chamado-mapa';
import { LoginPage } from '../login/login';
import { ChamadoHistoricoPage } from '../chamado-historico/chamado-historico';
import { ChamadoMateriaisPage } from './../chamado-materiais/chamado-materiais';
import { ChamadoMovimentacaoPage } from './../chamado-movimentacao/chamado-movimentacao';

import { ChamadosProvider } from './../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';

@IonicPage()
@Component({
  selector: 'page-chamado-detalhes',
  templateUrl: 'chamado-detalhes.html',
  providers: [
    AlertsProvider,
    ConfigLoginProvider,
    ChamadosProvider]
})
export class ChamadoDetalhesPage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string; 
  msgNenhumItem: string;
  chamadoId: string;
  chamado: any;
  exibirMsg: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public modalCtrl: ModalController, public alertsProvider: AlertsProvider, public configLoginProvider: ConfigLoginProvider,
    public chamadosProvider: ChamadosProvider) {
      this.carregarDados();
  }

  ionViewDidLoad(){
    this.viewCtrl.setBackButtonText('');

    this.carregarDetalhesChamado();
  }

  //Ações
  carregarDados() {
    let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

    if (_configLoginProvider) {
      this.username = _configLoginProvider.username;
      this.portal = _configLoginProvider.portal;
      this.nomePortal = _configLoginProvider.nomePortal;
      this.chamadoId = this.navParams.get("ChamadoID");
      this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
      this.exibirMsg = false;
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  carregarDetalhesChamado(){
    this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

    this.chamadosProvider.retornarChamadoPorNumero(this.portal, this.chamadoId).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.chamado = _objetoRetorno;

        if(!this.chamado){
            this.exibirMsg = true;
        }

        this.alertsProvider.fecharCarregando();

      }, error => {
        this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        this.exibirMsg = true;
        this.alertsProvider.fecharCarregando();
      }
    )
  }

  //Eventos
  mapaClick(chamado: any){
    let modal = this.modalCtrl.create(ChamadoMapaPage, 
      { Endereco: chamado.Endereco, Cidade: chamado.Cidade, Estado: chamado.Estado });
    modal.present();
  }

  anexosClick(){
    this.navCtrl.push(ChamadoAnexosPage, { ChamadoID: this.chamadoId });
  }

  movimentacaoClick(){
    this.navCtrl.push(ChamadoMovimentacaoPage, {ChamadoID: this.chamadoId });
  }

  materiaisClick(){
    this.navCtrl.push(ChamadoMateriaisPage, {ChamadoID: this.chamadoId });
  }

  historicoClick(){
    this.navCtrl.push(ChamadoHistoricoPage, {ChamadoID: this.chamadoId });
  }
 
  atualizarClick() {
    this.carregarDetalhesChamado();
  }
}
