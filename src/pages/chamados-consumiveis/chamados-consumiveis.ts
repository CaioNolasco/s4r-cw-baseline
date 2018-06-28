import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';

import { OfflineProvider } from '../../providers/offline/offline';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { UteisProvider } from '../../providers/uteis/uteis';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ChamadosProvider } from '../../providers/chamados/chamados';

@IonicPage()
@Component({
  selector: 'page-chamados-consumiveis',
  templateUrl: 'chamados-consumiveis.html',
  providers: [
    OfflineProvider,
    ConfigLoginProvider,
    UteisProvider,
    UsuariosProvider,
    AlertsProvider
  ]
})
export class ChamadosConsumiveisPage {
  //Propriedades
  username: string;
  nomePortal: string;
  portal: string;
  msgNenhumItem: string;
  idioma: string;
  permissoesChamado: any;
  chamados: any;
  infiniteScroll: any;
  refresher: any;
  respostaApi: any;
  homeOffline: boolean = false;
  exibirMsg: boolean = false;
  alterarChamado: boolean = false;
  isRefreshing: boolean = false;
  pagina = 1;
  tamanhoPagina = 20;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public offlineProvider: OfflineProvider,
    public app: App, public configLoginProvider: ConfigLoginProvider, public uteisProvider: UteisProvider,
    public usuariosProvider: UsuariosProvider, public constantesProvider: ConstantesProvider, public alertsProvider: AlertsProvider,
    public chamadosProvider: ChamadosProvider, public events: Events) {
    this.carregarDados();
  }

  ionViewDidLoad() {
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
          this.nomePortal = _configLoginProvider.nomePortal;
          this.portal = _configLoginProvider.portal;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.msgNenhumItem = this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem);
          this.exibirMsg = false;
          this.carregarPermissoesChamado();
        }
        else {
          this.navCtrl.setRoot("LoginPage");
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarPermissoesChamado() {
    try {
      this.usuariosProvider.retornarPermissoesFuncionalidade(this.username, this.portal, this.constantesProvider.funcCadastroChamadoCorretivo).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.permissoesChamado = _objetoRetorno;

          this.alterarChamado = this.usuariosProvider.validarPermissoes(this.permissoesChamado, this.constantesProvider.acaoAlterar);
        }, e => {
          console.log(e);
        });
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

      this.chamadosProvider.retornarChamadosConsumiveis(this.username, this.portal,
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
            else if (!novaPagina) {
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
            else if (!novaPagina) {
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
      AlterarChamado: this.alterarChamado
    });
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
