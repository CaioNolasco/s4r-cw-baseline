import { NavController, App, Events, IonicPage } from 'ionic-angular';
import { Component, Renderer } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from './../../providers/config-login/config-login';
import { UsuariosProvider } from './../../providers/usuarios/usuarios';
import { ChamadosProvider } from './../../providers/chamados/chamados';
import { UteisProvider } from './../../providers/uteis/uteis';
import { OfflineProvider } from './../../providers/offline/offline';
import { ConstantesProvider } from './../../providers/constantes/constantes';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    BarcodeScanner,
    ConfigLoginProvider,
    ChamadosProvider,
    UsuariosProvider,
    AlertsProvider,
    UteisProvider,
    OfflineProvider,
    InAppBrowser,
    ConstantesProvider
  ]
})
export class HomePage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string;
  idioma: string;
  msgNenhumItem: string;
  filtroEquipamento: string;
  filtroNomeEquipamento: string;
  qrCodeUrl: string;
  search: any;
  chamados: any;
  chamado: any;
  refresher: any;
  infiniteScroll: any;
  respostaApi: any;
  permissoesChamado: any;
  exibirMsg: boolean = false;
  exibirSearch: boolean = false;
  isRefreshing: boolean = false;
  adicionarChamado: boolean = false;
  alterarChamado: boolean = false;
  homeOffline: boolean = false;
  pagina = 1;
  tamanhoPagina = 20;

  //Load
  constructor(public navCtrl: NavController, public configLoginProvider: ConfigLoginProvider, public chamadosProvider: ChamadosProvider,
    public usuariosProvider: UsuariosProvider, public alertsProvider: AlertsProvider, public barcodeScanner: BarcodeScanner,
    public uteisProvider: UteisProvider, public inAppBrowser: InAppBrowser, public renderer: Renderer, public offlineProvider: OfflineProvider,
    public events: Events, public app: App, public constantesProvider: ConstantesProvider) {
    this.navCtrl = navCtrl;
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

          this.adicionarChamado = this.usuariosProvider.validarPermissoes(this.permissoesChamado, this.constantesProvider.acaoCadastrar);
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

      this.chamadosProvider.retornarChamadosAbertos(this.username, this.portal,
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

  carregarDetalhesChamado(valor: string) {
    try {
      this.chamadosProvider.retornarChamadoPorNumeroUsuario(this.username, this.portal, valor).subscribe(
        data => {
          let _resposta = (data as any);

          let _objetoRetorno = JSON.parse(_resposta._body);

          this.chamado = _objetoRetorno;

          if (this.chamado) {
            this.navCtrl.push("ChamadoDetalhesPage", {
              ChamadoID: this.chamado.ChamadoID,
              AlterarChamado: this.alterarChamado
            });
          }
          else {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
          }
        }, e => {
          console.log(e);

          if (e.status == 404) {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
          }
          else {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }
        }
      )
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarQrCode() {
    try {
      this.filtroEquipamento = null;
      this.filtroNomeEquipamento = null;
      this.qrCodeUrl = null;

      let _opcoesQrCode: any = {
        formats: "QR_CODE"
      }

      this.barcodeScanner.scan(_opcoesQrCode).then(barcodeData => {

        let _valor = barcodeData.text;

        if (_valor) {
          this.filtroEquipamento = this.uteisProvider.retornarQueryString("v", _valor);
          this.filtroNomeEquipamento = this.uteisProvider.retornarQueryString("v1", _valor);
          this.qrCodeUrl = _valor;

          let _botoes: any = [{
            text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveNavegar),
            handler: this.navegarClick
          },
          {
            text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveFiltrar),
            handler: this.filtrarClick
          },
          { text: "Cancelar" }]

          this.alertsProvider.exibirAlertaConfirmacaoHandler(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveAlerta),
            this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgEscolhaAcao), _botoes);
        }
      }).catch(e => {
        console.log(e);
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  navegarQrCode() {
    try {
      if (this.uteisProvider.validarUrl(this.qrCodeUrl)) {
        this.inAppBrowser.create(this.qrCodeUrl, '_system')
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  filtrarQrCode() {
    try {
      if (this.filtroEquipamento) {
        this.navCtrl.push("ChamadosEquipamentoPage", {
          EquipamentoID: this.filtroEquipamento,
          NomeEquipamento: this.filtroNomeEquipamento,
          AlterarChamado: this.alterarChamado
        });
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
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
        {
          text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar),
          handler: this.confirmarDownloadClick
        }]

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
  logoutClick() {
    this.usuariosProvider.logoutUsuario();
  }

  searchClick() {
    this.search = "";
    this.exibirSearch = !this.exibirSearch;
  }

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

  novoChamadoClick() {
    this.navCtrl.push("ChamadoNovoPage", { "HomePage": this });
  }

  qrCodeClick() {
    this.carregarQrCode();
  }

  offlineClick(chamado: any) {
    this.salvarOffline(chamado);
  }

  confirmarDownloadClick = () => {
    this.salvarEstruturaOffline();
  }

  navegarClick = () => {
    this.navegarQrCode();
  }

  filtrarClick = () => {
    this.filtrarQrCode();
  }

  buscarChamados(evento: any) {
    this.renderer.invokeElementMethod(event.target, 'blur');

    let _valor = evento.target.value;

    this.carregarDetalhesChamado(_valor);
  }

  buscarChamadosClick() {
    this.renderer.invokeElementMethod(event.target, 'blur');

    this.carregarDetalhesChamado(this.search);
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