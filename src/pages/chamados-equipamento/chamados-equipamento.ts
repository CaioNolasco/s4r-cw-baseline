import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, Events } from 'ionic-angular';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ChamadosProvider } from '../../providers/chamados/chamados';
import { OfflineProvider } from './../../providers/offline/offline';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';

@IonicPage({name: 'ChamadosEquipamentoPage'})
@Component({
  selector: 'page-chamados-equipamento',
  templateUrl: 'chamados-equipamento.html',
  providers: [
    AlertsProvider,
    ConfigLoginProvider,
    ChamadosProvider,
    OfflineProvider,
    ConstantesProvider,
    UteisProvider
  ]
})

export class ChamadosEquipamentoPage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string;
  idioma: string;
  msgNenhumItem: string;
  equipamentoId: string;
  nomeEquipamento: string;
  chamados: any;
  infiniteScroll: any;
  refresher: any;
  respostaApi: any;
  exibirMsg: boolean = false;
  isRefreshing: boolean = false;
  homeOffline: boolean = false;
  alterarChamado: boolean = false;
  excluirChamado: boolean = false;
  pagina = 1;
  tamanhoPagina = 20;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public configLoginProvider: ConfigLoginProvider,
    public alertsProvider: AlertsProvider, public viewCtrl: ViewController, public chamadosProvider: ChamadosProvider,
    public offlineProvider: OfflineProvider, public app: App, public uteisProvider: UteisProvider, public constantesProvider: ConstantesProvider,
    public events: Events) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarChamados();
    }
  }

  //Ações
  carregarDados() {
    try {
      if (this.offlineProvider.validarInternetOffline()) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
        this.homeOffline = true;
      }
      else {
        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.portal = _configLoginProvider.portal;
          this.nomePortal = _configLoginProvider.nomePortal;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.equipamentoId = this.navParams.get("EquipamentoID");
          this.nomeEquipamento = this.navParams.get("NomeEquipamento");
          this.alterarChamado = this.navParams.get("AlterarChamado");
          this.excluirChamado = this.navParams.get("ExcluirChamado");
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

  carregarChamados(novaPagina: boolean = false) {
    try {

      if (!this.isRefreshing && !novaPagina) {
        this.alertsProvider.exibirCarregando('');
      }

      this.exibirMsg = false;

      this.chamadosProvider.retornarChamadosEquipamento(this.username, this.portal, this.equipamentoId,
        this.pagina, this.tamanhoPagina).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            if (novaPagina) {
              this.chamados = this.chamados.concat(_objetoRetorno);
              this.infiniteScroll.complete();
            }
            else {
              this.chamados = _objetoRetorno;
            }

            if (!this.chamados[0]) {
              this.exibirMsg = true;
              this.chamados = null;
            }

            if (this.isRefreshing) {
              this.refresher.complete();
              this.isRefreshing = false;
            }
            else if(!novaPagina) {
              this.alertsProvider.fecharCarregando();
            }
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.exibirMsg = true;
            this.chamados = null;
      
            if (this.isRefreshing) {
              this.refresher.complete();
              this.isRefreshing = false;
            }
            else if(!novaPagina) {
              this.alertsProvider.fecharCarregando();
            }
          });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.chamados = null;

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
  }

  salvarOffline(chamado: any) {
    try {
      if (this.offlineProvider.retornarConfigEstruturaSQLite()) {

        this.alertsProvider.exibirCarregando('');

        this.offlineProvider.salvarChamadoOffline(this.portal, this.nomePortal, this.username, chamado, this.idioma).then(data => {
          if (data) {
            this.chamadosProvider.salvarOffline(this.username, this.portal, chamado.ChamadoID, true, this.idioma).subscribe(
              data => {
                let _resposta = (data as any);
                let _objetoRetorno = JSON.parse(_resposta._body);

                this.respostaApi = _objetoRetorno;

                if (this.respostaApi) {
                  if (this.respostaApi.sucesso) {
                    chamado.HabilitarChamado = false;
                    this.offlineProvider.salvarConfigBadgesOffline();
                    this.events.publish('badge:exibir');
                    this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
                  }
                  else {
                    this.offlineProvider.excluirChamadoOffline(this.portal, chamado.ChamadoID);
                    this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                  }
                }
                else {
                  this.offlineProvider.excluirChamadoOffline(this.portal, chamado.ChamadoID);
                  this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                }

                this.alertsProvider.fecharCarregando();
              }, e => {
                console.log(e);
                this.offlineProvider.excluirChamadoOffline(this.portal, chamado.ChamadoID);
                this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                this.alertsProvider.fecharCarregando();
              });
          }
          else {
            this.offlineProvider.excluirChamadoOffline(this.portal, chamado.ChamadoID);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }
        });
      }
      else {
        let _titulo = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta);

        let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
        { text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar), 
          handler: this.confirmarDownloadClick }]

        this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacaoEstrutura), _botoes);
      }
    }
    catch (e) {
      console.log(e);
      this.offlineProvider.excluirChamadoOffline(this.portal, chamado.ChamadoID);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  salvarEstruturaOffline() {
    try {
      this.alertsProvider.exibirCarregando('');

      this.offlineProvider.removerConfigEstruturaSQLite();
      let _sqlite = this.offlineProvider.salvarBancoSQLite();
      this.offlineProvider.salvarEstruturaSQLite(_sqlite);

      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso),
       this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      this.alertsProvider.fecharCarregando();
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  //Eventos
  atualizarClick() {
    this.carregarChamados();
  }

  abrirDetalhesClick(chamado) {
    this.navCtrl.push("ChamadoDetalhesPage", { 
      ChamadoID: chamado.ChamadoID,
      AlterarChamado: this.alterarChamado,
      ExcluirChamado:  this.excluirChamado });
  }

  historicoClick(chamado) {
    this.navCtrl.push("ChamadoHistoricoPage", { ChamadoID: chamado.ChamadoID });
  }

  offlineClick(chamado: any) {
    this.salvarOffline(chamado);
  }

  confirmarDownloadClick = () => {
    this.salvarEstruturaOffline();
  }

  doRefresh(refresher) {
    this.pagina = 1;
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarChamados();
  }

  doInfinite(infiniteScroll) {
    this.pagina++;
    this.infiniteScroll = infiniteScroll;

    this.carregarChamados(true);
  }
}
