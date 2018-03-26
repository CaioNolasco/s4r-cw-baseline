import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ChamadosProvider } from '../../providers/chamados/chamados';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-chamado-materiais',
  templateUrl: 'chamado-materiais.html',
  providers: [
    ConfigLoginProvider,
    AlertsProvider,
    ChamadosProvider]
})
export class ChamadoMateriaisPage {
  //Propriedades
  portal: string;
  msgNenhumItem: string;
  refresher: any;
  materiais: any;
  isRefreshing: boolean = false;
  exibirMsg: boolean = false;

  chamadoId: any;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public configLoginProvider: ConfigLoginProvider, public alertsProvider: AlertsProvider,
    public chamadosProvider: ChamadosProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    this.carregarMateriais();
  }

  //Ações
  carregarDados() {
    try {
      let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

      if (_configLoginProvider) {
        this.portal = _configLoginProvider.portal;
        this.chamadoId = this.navParams.get("ChamadoID");
        this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
        this.exibirMsg = false;
      }
      else {
        this.navCtrl.push(LoginPage);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarMateriais() {
    try {
      if (!this.isRefreshing) {
        this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);
      }

      this.exibirMsg = false;

      this.chamadosProvider.retornarMateriaisChamado(this.portal, this.chamadoId).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.materiais = _objetoRetorno;

          if (!this.materiais[0]) {
            this.exibirMsg = true;
            this.materiais = null;
          }

          if (this.isRefreshing) {
            this.refresher.complete();
            this.isRefreshing = false;
          }
          else {
            this.alertsProvider.fecharCarregando();
          }
        }
      )
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.materiais = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
  }

  excluirMaterial(material: any) {
    try {
      let _titulo = `Excluir ${material.TipoServico} - ${material.Marca} - ${material.Modelo}?`;

      this.alertsProvider.exibirAlertaConfirmacao(_titulo, this.alertsProvider.msgConfirmacao,
        this.alertsProvider.msgBotaoCancelar, this.alertsProvider.msgBotaoConfirmar);
    }
    catch (e) {
      console.log(e);
    }
  }

  //Eventos
  excluirClick(material: any) {
    this.excluirMaterial(material);
  }

  atualizarClick() {
    this.carregarMateriais();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarMateriais();
  }
}
