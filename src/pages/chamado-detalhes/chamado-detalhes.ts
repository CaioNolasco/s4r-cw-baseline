import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ModalController, PopoverController, Content } from 'ionic-angular';

import { ChamadosProvider } from './../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { OfflineProvider } from '../../providers/offline/offline';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@IonicPage()
@Component({
  selector: 'page-chamado-detalhes',
  templateUrl: 'chamado-detalhes.html',
  providers: [
    AlertsProvider,
    ConfigLoginProvider,
    ChamadosProvider,
    OfflineProvider,
    ConstantesProvider,
    UteisProvider,
    UsuariosProvider]
})
export class ChamadoDetalhesPage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string;
  idioma: string;
  chamadoId: string;
  chamado: any;
  tipoServicoId: any;
  tipoChamado: any;
  respostaApi: any;
  opcoesMantenedores: any;
  mantenedores: any;
  aprovado: any;
  tipoDados: any;
  exibirMsg: boolean = false;
  habilitarChamado: boolean;
  origemOffline: boolean = false;
  alterarChamado: boolean = false;
  excluirChamado: boolean = false;
  homeOffline: boolean = false;
  exibirChamadoCorretivo: boolean = false;
  exibirChamadoPreventivo: boolean = false;
  exibirChamadoConsumivel: boolean = false;
  vinculoMantenedor: boolean = false;
  perfilAprovacao: boolean = false;
  aprovacaoOperadorCushman: boolean = false;

  @ViewChild(Content) content: Content;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public modalCtrl: ModalController, public alertsProvider: AlertsProvider, public configLoginProvider: ConfigLoginProvider,
    public chamadosProvider: ChamadosProvider, public offlineProvider: OfflineProvider, public app: App,
    public constantesProvider: ConstantesProvider, public popoverController: PopoverController, public uteisProvider: UteisProvider,
    public usuariosProvider: UsuariosProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarDetalhesChamado();
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
          this.excluirChamado = this.navParams.get("ExcluirChamado");
        }
        else {
          this.alterarChamado = true;
          this.excluirChamado = false;
        }

        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.portal = _configLoginProvider.portal;
          this.nomePortal = _configLoginProvider.nomePortal;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.chamadoId = this.navParams.get("ChamadoID");
          this.exibirMsg = false;
          this.habilitarChamado = false;
          this.tipoDados = "dadosBasicos";
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

  carregarDetalhesChamado() {
    try {
      this.alertsProvider.exibirCarregando('');

      this.exibirMsg = false;

      if (!this.origemOffline) {
        this.carregarDetalhesChamadoOnline();
        this.carregarDadosUsuario();
      }
      else {
        this.carregarDetalhesChamadoOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro),
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.chamado = null;
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarDetalhesChamadoOnline() {
    this.chamadosProvider.retornarChamadoDetalhes(this.username, this.portal, this.chamadoId, this.idioma).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.chamado = _objetoRetorno;

        if (!this.chamado) {
          this.exibirMsg = true;
          this.chamado = null;
        }
        else {
          this.tipoServicoId = this.chamado.TipoServicoID;
          this.tipoChamado = this.chamado.TipoChamado;
          this.habilitarChamado = this.chamado.HabilitarChamado;

          if (this.tipoChamado == this.constantesProvider.tipoChamadoCorretivo) {
            this.exibirChamadoCorretivo = true;
            this.aprovacaoOperadorCushman = this.chamado.AprovacaoOperadorCushman == 0 && this.chamado.CriadoOperadorCW == 0;
          }
          else if (this.tipoChamado == this.constantesProvider.tipoChamadoPreventivo) {
            this.exibirChamadoPreventivo = true;
          }
          else if (this.tipoChamado == this.constantesProvider.tipoChamadoConsumivel) {
            this.exibirChamadoConsumivel = true;
          }

          this.content.resize();
        }

        this.alertsProvider.fecharCarregando();
      }, e => {
        console.log(e);
        this.alertsProvider.fecharCarregando();
      });
  }

  carregarDetalhesChamadoOffline() {
    this.offlineProvider.retornarDetalhesChamadoOffline(this.portal, this.chamadoId).then(data => {
      this.chamado = data;

      if (!this.chamado) {
        this.exibirMsg = true;
        this.chamado = null;
      }
      else {
        this.tipoChamado = this.chamado.TipoChamado;

        if (this.tipoChamado == this.constantesProvider.tipoChamadoCorretivo) {
          this.exibirChamadoCorretivo = true;
        }
        else if (this.tipoChamado == this.constantesProvider.tipoChamadoPreventivo) {
          this.exibirChamadoPreventivo = true;
        }
        else if (this.tipoChamado == this.constantesProvider.tipoChamadoConsumivel) {
          this.exibirChamadoConsumivel = true;
        }
      }

      this.alertsProvider.fecharCarregando();
    });
  }

  carregarDadosUsuario() {
    try {
      this.usuariosProvider.retornarDadosUsuario(this.username, this.portal).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          let _dadosUsuario = _objetoRetorno;

          if (_dadosUsuario) {

            this.perfilAprovacao = _dadosUsuario.PerfilAcessoID == this.constantesProvider.perfilOperadorCushman ||
              _dadosUsuario.PerfilAcessoID == this.constantesProvider.perfilAdministradorCushman ||
              _dadosUsuario.PerfilAcessoID == this.constantesProvider.perfilAdministradorTI;
          }
          else {
            this.perfilAprovacao = false;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarMapa(chamado: any) {
    try {
      let modal = this.modalCtrl.create("ChamadoMapaPage",
        { Endereco: chamado.Endereco, Cidade: chamado.Cidade, Estado: chamado.Estado });
      modal.present();
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarExcluirChamado() {
    try {
      let _titulo = this.origemOffline ? `` : `${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveNumeroChamado)} ${this.chamadoId}`;

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      {
        text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar),
        handler: this.confirmarExcluirChamadoClick
      }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarMantenedores(aprovado: boolean) {
    try {
      this.opcoesMantenedores = null;
      this.mantenedores = null;
      this.vinculoMantenedor = false;

      if (aprovado) {
        this.chamadosProvider.retornarMantenedores(this.portal, this.chamado.TipoServicoID, this.chamado.PontoVendaID).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            this.opcoesMantenedores = _objetoRetorno;

            if (!this.opcoesMantenedores[0]) {
              this.opcoesMantenedores = null;
            }
          }, e => {
            console.log(e);
          });
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarVinculoMantenedor(mantenedor: any) {
    try {
      this.vinculoMantenedor = false;

      if (this.opcoesMantenedores) {
        this.chamadosProvider.retornarVinculoMantenedor(this.username, this.portal, mantenedor, this.idioma).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            if (_objetoRetorno.sucesso) {
              this.vinculoMantenedor = _objetoRetorno.sucesso;
            }
            else {
              this.alertsProvider.exibirToast(_objetoRetorno.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          });
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  excluirChamadoConfirmado() {
    try {
      this.alertsProvider.exibirCarregando('');

      this.chamadosProvider.excluirChamado(this.username, this.portal, this.chamadoId, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.respostaApi = _objetoRetorno;

          if (this.respostaApi) {
            if (this.respostaApi.sucesso) {
              this.app.getActiveNav().setRoot("HomePage");
              this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
            }
            else {
              this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }
          }
          else {
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }

          this.alertsProvider.fecharCarregando();
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro),
            this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          this.alertsProvider.fecharCarregando();
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro),
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  salvarAprovacao(){
    try {
      if (this.mantenedores) {
        
        this.alertsProvider.exibirCarregando('');

        let _parametros = {
          MantenedorID: this.mantenedores,
          StatusOperadorCW: this.aprovado
        };

        this.chamadosProvider.salvarAprovacao(this.username, this.portal, this.chamadoId, this.idioma, _parametros).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            this.respostaApi = _objetoRetorno;

            if (this.respostaApi) {
              if (this.respostaApi.sucesso) {
                this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
                let _mantenedores = parseInt(this.mantenedores);

                let _opcaoMantenedor = this.opcoesMantenedores.filter(function (entrada) {
                  return entrada.MantenedorID === _mantenedores;
                });

                this.chamado.Mantenedor = _opcaoMantenedor[0].Nome;
                this.tipoDados = 'dadosBasicos';
                this.aprovacaoOperadorCushman = false;
                this.content.resize();
              }
              else {
                this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
              }
            }
            else {
              this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }

            this.alertsProvider.fecharCarregando();
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.alertsProvider.fecharCarregando();
          });
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroCampos), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  //Eventos
  mapaClick(chamado: any) {
    this.carregarMapa(chamado);
  }

  anexosClick() {
    this.navCtrl.push("ChamadoAnexosPage", {
      ChamadoID: this.chamadoId,
      HabilitarChamado: this.habilitarChamado,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  movimentacaoClick() {
    this.navCtrl.push("ChamadoMovimentacaoPage", {
      ChamadoID: this.chamadoId,
      TipoServicoID: this.tipoServicoId,
      "ChamadoDetalhesPage": this,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  rotinaClick() {
    this.navCtrl.push("ChamadoRotinaPage", {
      ChamadoID: this.chamadoId,
      OrigemOffline: this.origemOffline,
      HabilitarChamado: this.habilitarChamado,
      AlterarChamado: this.alterarChamado
    });
  }

  materiaisClick() {
    this.navCtrl.push("ChamadoMateriaisPage", {
      ChamadoID: this.chamadoId,
      HabilitarChamado: this.habilitarChamado,
      OrigemOffline: this.origemOffline,
      AlterarChamado: this.alterarChamado
    });
  }

  historicoClick() {
    this.navCtrl.push("ChamadoHistoricoPage", {
      ChamadoID: this.chamadoId,
      OrigemOffline: this.origemOffline
    });
  }

  atualizarClick() {
    this.carregarDetalhesChamado();
  }

  popoverClick(evento) {
    let _popover = this.popoverController.create("ChamadoDetalhesPopoverPage",
      {
        ChamadoID: this.chamadoId,
        HabilitarChamado: this.habilitarChamado,
        OrigemOffline: this.origemOffline,
        AlterarChamado: this.alterarChamado,
        TipoServicoID: this.tipoServicoId,
        TipoChamado: this.tipoChamado,
        "ChamadoDetalhesPage": this
      });
    _popover.present({
      ev: evento
    });
  }

  consumivelClick() {
    this.navCtrl.push("ChamadoConsumivelPage", {
      ChamadoID: this.chamadoId,
      OrigemOffline: this.origemOffline,
      HabilitarChamado: this.habilitarChamado,
      AlterarChamado: this.alterarChamado
    });
  }

  excluirClick() {
    this.carregarExcluirChamado();
  }

  aprovarClick(){
    this.salvarAprovacao();
  }

  confirmarExcluirChamadoClick = () => {
    this.excluirChamadoConfirmado();
  }

  aprovadoChange(aprovado: any) {
    this.carregarMantenedores(aprovado.checked);
  }

  mantenedorChange(mantenedor: any) {
    this.carregarVinculoMantenedor(mantenedor);
  }
}
