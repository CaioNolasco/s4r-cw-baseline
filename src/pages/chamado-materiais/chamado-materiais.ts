import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ChamadosProvider } from '../../providers/chamados/chamados';
import { OfflineProvider } from './../../providers/offline/offline';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';

@IonicPage({name: 'ChamadoMateriaisPage'})
@Component({
  selector: 'page-chamado-materiais',
  templateUrl: 'chamado-materiais.html',
  providers: [
    ConfigLoginProvider,
    AlertsProvider,
    ChamadosProvider,
    OfflineProvider,
    ConstantesProvider,
    UteisProvider]
})
export class ChamadoMateriaisPage {
  //Propriedades
  portal: string;
  idioma: string;
  msgNenhumItem: string;
  refresher: any;
  materiais: any;
  chamadoId: any;
  username: any;
  respostaApi: any;
  index: any;
  materialChamadoId: any;
  isRefreshing: boolean = false;
  exibirMsg: boolean = false;
  habilitarChamado: boolean;
  origemOffline: boolean = false;
  alterarChamado: boolean = false;
  homeOffline: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public configLoginProvider: ConfigLoginProvider, public alertsProvider: AlertsProvider,
    public chamadosProvider: ChamadosProvider, public offlineProvider: OfflineProvider, public app: App,
    public uteisProvider: UteisProvider, public constantesProvider: ConstantesProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarMateriais();
    }
  }

  //Ações
  carregarDados() {
    try {
      this.origemOffline = this.navParams.get("OrigemOffline");

      if (this.offlineProvider.validarInternetOffline() && !this.origemOffline) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
        this.homeOffline = true;
      }
      else {
        if (!this.origemOffline) {
          this.alterarChamado = this.navParams.get("AlterarChamado");
        }
        else {
          this.alterarChamado = true;
        }

        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.portal = _configLoginProvider.portal;
          this.username = _configLoginProvider.username;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.chamadoId = this.navParams.get("ChamadoID");
          this.habilitarChamado = this.navParams.get("HabilitarChamado");
          this.msgNenhumItem = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem);
          this.exibirMsg = false;
        }
        else {
          this.app.getRootNav().setRoot("LoginPage");
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarMateriais() {
    try {
      if (!this.isRefreshing) {
        this.alertsProvider.exibirCarregando('');
      }

      this.exibirMsg = false;

      if (!this.origemOffline) {
        this.carregarMateriaisOnline();
      }
      else {
        this.carregarMateriaisOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
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

  carregarMateriaisOnline() {
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
      }, e => {
        console.log(e);

        if (this.isRefreshing) {
          this.refresher.complete();
          this.isRefreshing = false;
        }
        else {
          this.alertsProvider.fecharCarregando();
        }
      });
  }

  carregarMateriaisOffline() {
    this.offlineProvider.retornarMateriaisOffline(this.portal, this.chamadoId).then(data => {

      this.materiais = data;

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
    });
  }

  carregarExcluirMaterial(material: any) {
    try {
      this.index = this.materiais.indexOf(material);
      this.materialChamadoId = material.MaterialChamadoID;

      let _titulo = `${material.TipoServico} - ${material.Marca} - ${material.Modelo}`;

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      { text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar), 
        handler: this.confirmarExcluirClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }
  
  excluirMaterial() {
    try {
      this.alertsProvider.exibirCarregando('');

      this.chamadosProvider.excluirMaterial(this.username, this.portal, this.chamadoId, this.materialChamadoId, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.respostaApi = _objetoRetorno;

          if (this.respostaApi) {
            if (this.respostaApi.sucesso) {
              if (this.index > -1) {
                this.materiais.splice(this.index, 1);
              }

              if (!this.materiais[0]) {
                this.exibirMsg = true;
                this.materiais = null;
              }

              this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
            }
            else {
              this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }
          }
          else {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }

          this.index = null;
          this.materialChamadoId = null;
          this.alertsProvider.fecharCarregando();
        }, e => {
          console.log(e);
          this.index = null;
          this.materialChamadoId = null;
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
          this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          this.alertsProvider.fecharCarregando();
        });
    }
    catch (e) {
      console.log(e);
      this.index = null;
      this.materialChamadoId = null;
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  //Eventos
  excluirClick(material: any) {
    this.carregarExcluirMaterial(material);
  }

  confirmarExcluirClick = () => {
    this.excluirMaterial();
  }

  atualizarClick() {
    this.carregarMateriais();
  }

  novoMaterialClick() {
    this.navCtrl.push("ChamadoMateriaisNovoPage", { ChamadoID: this.chamadoId, "ChamadoMateriaisNovoPage": this });
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarMateriais();
  }
}
