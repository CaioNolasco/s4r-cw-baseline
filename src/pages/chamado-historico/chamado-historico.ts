import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ChamadosProvider } from '../../providers/chamados/chamados';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-chamado-historico',
  templateUrl: 'chamado-historico.html',
  providers: [
    AlertsProvider,
    ConfigLoginProvider,
    ChamadosProvider]
})
export class ChamadoHistoricoPage {
  //Propriedades
  msgNenhumItem: string;
  portal: string;
  chamadoId: any;
  historicos: any;
  refresher: any;
  isRefreshing: boolean = false;
  exibirMsg: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
    public configLoginProvider: ConfigLoginProvider, public alertsProvider: AlertsProvider, public chamadosProvider: ChamadosProvider) {
      this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    this.carregarHistorico();
  }

  //Ações
  carregarDados() {
    let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

    if (_configLoginProvider) {
      this.chamadoId = this.navParams.get("ChamadoID");
      this.portal = _configLoginProvider.portal;
      this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
      this.exibirMsg = false;
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  carregarHistorico(){
    this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

    this.chamadosProvider.retornarHistoricoChamado(this.portal, this.chamadoId).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.historicos = _objetoRetorno;

        if(!this.historicos[0]){
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
  atualizarClick() {
    this.carregarHistorico();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarHistorico();

    if (this.isRefreshing) {
      this.refresher.complete();
      this.isRefreshing = false;
    }
  }
}
