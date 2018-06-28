import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { Device } from '@ionic-native/device';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ChamadosProvider } from '../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { UteisProvider } from './../../providers/uteis/uteis';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { OfflineProvider } from '../../providers/offline/offline';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@IonicPage({name: 'ChamadoMovimentacaoPage'})
@Component({
  selector: 'page-chamado-movimentacao',
  templateUrl: 'chamado-movimentacao.html',
  providers: [
    ConfigLoginProvider,
    ChamadosProvider,
    AlertsProvider,
    UteisProvider,
    ConstantesProvider,
    OfflineProvider,
    Device,
    UsuariosProvider]
})
export class ChamadoMovimentacaoPage {
  //Propriedades
  chamadoId: string;
  username: string;
  portal: string;
  idioma: string;
  statusEncerradoId: number;
  opcoesSubtipos: any;
  opcoesStatus: any;
  chamado: any;
  respostaApi: any;
  dataAtendimento: any;
  inicioAtendimento: any;
  finalAtendimento: any;
  descricaoAtendimento: any;
  dataSolucao: any;
  inicioSolucao: any;
  finalSolucao: any;
  dataProgramacao: any;
  justificativa: any;
  subtipos: any;
  status: any;
  tipoChamado: any;
  tipoServicoId: any;
  geolocalizacao: any;  
  prazoSlaStatus: any;
  habilitarChamado: boolean;
  origemOffline: boolean = false;
  alterarChamado: boolean = false;
  homeOffline: boolean = false;
  perfilMantenedor: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public configLoginProvider: ConfigLoginProvider, public chamadosProvider: ChamadosProvider,
    public alertsProvider: AlertsProvider, public uteisProvider: UteisProvider, public constantesProvider: ConstantesProvider,
    public renderer: Renderer, public offlineProvider: OfflineProvider, public app: App, public device: Device,
    public usuariosProvider: UsuariosProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarDadosForm();
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
          this.geolocalizacao = this.uteisProvider.retornarGeolocalizacao();
          this.geolocalizacao.then((data)=>{
            this.geolocalizacao = data;
          });
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
          this.tipoServicoId = this.navParams.get("TipoServicoID");
          this.habilitarChamado = false;
          this.carregarSubtipos();
          this.carregarStatus();
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

  carregarSubtipos() {
    try {
      if (!this.origemOffline) {
        this.carregarSubtiposOnline();
      }
      else {
        this.carregarSubtiposOffline();
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarSubtiposOnline() {
    this.chamadosProvider.retornarSubtipos(this.portal, this.tipoServicoId, this.constantesProvider.subtipoAcao).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.opcoesSubtipos = _objetoRetorno;
      }, e => {
        console.log(e);
      });
  }

  carregarSubtiposOffline() {
    this.offlineProvider.retornarSubtiposOffline(this.portal, this.chamadoId).then(data => {
      this.opcoesSubtipos = data;
    }).catch((e) => {
      console.log(e);
    });
  }

  carregarStatus() {
    try {
      if (!this.origemOffline) {
        this.carregarStatusOnline();
      }
      else {
        this.carregarStatusOffline();
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarStatusOnline() {
    this.chamadosProvider.retornarStatus(this.username, this.portal, this.chamadoId, this.idioma).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.opcoesStatus = _objetoRetorno;
      }, e => {
        console.log(e);
      });
  }

  carregarStatusOffline() {
    this.offlineProvider.retornarStatusOffline(this.portal, this.chamadoId).then(data => {
      this.opcoesStatus = data;
    }).catch((e) => {
      console.log(e);
    });
  }

  carregarDadosForm() {
    try {
      this.alertsProvider.exibirCarregando('');

      if (!this.origemOffline) {
        this.carregarDadosFormOnline();
      }
      else {
        this.carregarDadosFormOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarDadosFormOnline() {
    this.chamadosProvider.retornarChamadoDetalhes(this.username, this.portal, this.chamadoId, this.idioma).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.chamado = _objetoRetorno;

        if (this.chamado) {
          let _dataAtendimentoInicial = this.uteisProvider.retornarIonicDateTime(this.chamado.DataInicialEfetivaAtendimento);
          let _dataAtendimentoFinal = this.uteisProvider.retornarIonicDateTime(this.chamado.DataFinalEfetivaAtendimento);
          let _dataSolucaoInicial = this.uteisProvider.retornarIonicDateTime(this.chamado.DataInicialEfetivaSolucao);
          let _dataSolucaoFinal = this.uteisProvider.retornarIonicDateTime(this.chamado.DataFinalEfetivaSolucao);
          let _dataProgramacao = this.uteisProvider.retornarIonicDateTime(this.chamado.DataProgramacaoAtendimento);

          this.dataAtendimento = _dataAtendimentoInicial;
          this.inicioAtendimento = _dataAtendimentoInicial;
          this.finalAtendimento = _dataAtendimentoFinal;
          this.descricaoAtendimento = this.chamado.DescricaoAtendimento;
          this.dataSolucao = _dataSolucaoInicial;
          this.inicioSolucao = _dataSolucaoInicial;
          this.finalSolucao = _dataSolucaoFinal;
          this.dataProgramacao = _dataProgramacao;
          this.justificativa = this.chamado.TextoJustificativa;
          this.subtipos = this.chamado.Acao;
          this.status = this.chamado.StatusChamadoID;
          this.habilitarChamado = this.chamado.HabilitarChamado;
          this.tipoChamado = this.chamado.TipoChamado;
          this.tipoServicoId = this.chamado.TipoServicoID;

          this.carregarPrazoSlaStatus(this.status);
          this.carregarDadosUsuario();
        }

        this.alertsProvider.fecharCarregando();
      }, e => {
        console.log(e);
        this.alertsProvider.fecharCarregando();
      });
  }

  carregarDadosFormOffline() {
    this.offlineProvider.retornarDetalhesChamadoOffline(this.portal, this.chamadoId).then(data => {

      this.chamado = data;

      if (this.chamado) {
        let _dataAtendimentoInicial = this.uteisProvider.retornarIonicDateTime(this.chamado.DataInicialEfetivaAtendimento);
        let _dataAtendimentoFinal = this.uteisProvider.retornarIonicDateTime(this.chamado.DataFinalEfetivaAtendimento);
        let _dataSolucaoInicial = this.uteisProvider.retornarIonicDateTime(this.chamado.DataInicialEfetivaSolucao);
        let _dataSolucaoFinal = this.uteisProvider.retornarIonicDateTime(this.chamado.DataFinalEfetivaSolucao);
        let _dataProgramacao = this.uteisProvider.retornarIonicDateTime(this.chamado.DataProgramacaoAtendimento);

        this.dataAtendimento = _dataAtendimentoInicial;
        this.inicioAtendimento = _dataAtendimentoInicial;
        this.finalAtendimento = _dataAtendimentoFinal;
        this.descricaoAtendimento = this.chamado.DescricaoAtendimento;
        this.dataSolucao = _dataSolucaoInicial;
        this.inicioSolucao = _dataSolucaoInicial;
        this.finalSolucao = _dataSolucaoFinal;
        this.dataProgramacao = _dataProgramacao;
        this.justificativa = this.chamado.TextoJustificativa;
        this.subtipos = this.chamado.Acao;
        this.status = this.chamado.StatusChamadoID;
        this.habilitarChamado = true;
        this.tipoChamado = this.chamado.TipoChamado;
        this.tipoServicoId = this.chamado.TipoServicoID;
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
            this.perfilMantenedor = _dadosUsuario.PerfilAcessoID == this.constantesProvider.perfilMantenedor;
          }
          else {
            this.perfilMantenedor = false;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarPrazoSlaStatus(status: any) {
    this.chamadosProvider.retornarPrazoSlaStatus(this.portal, this.chamadoId, status, this.idioma).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.prazoSlaStatus = _objetoRetorno;

        if (!this.prazoSlaStatus) {
          this.prazoSlaStatus = null;
        }
      }, e => {
        console.log(e);
        this.prazoSlaStatus = null;
      });
  }

  carregarHabilitarChamado() {
    try {
      this.chamadosProvider.retornarChamadoDetalhes(this.username, this.portal, this.chamadoId, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.chamado = _objetoRetorno;

          if (this.chamado) {
            this.habilitarChamado = this.chamado.HabilitarChamado;
          }
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarAtualizarMovimentacao() {
    try {
      let _titulo = this.origemOffline ? `` : `${this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveNumeroChamado)} ${this.chamadoId}`;

      let _botoes: any = [{ text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveCancelar) },
      { text: this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveConfirmar), 
        handler: this.confirmarMovimentacaoClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgConfirmacao), _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }

  atualizarMovimentacao() {
    try {
      this.alertsProvider.exibirCarregando('');

      let _parametros = {
        ChamadoID: this.chamadoId,
        StatusChamadoID: this.status,
        TipoChamado: this.tipoChamado,
        Acao: this.subtipos,
        DataAtendimento: this.uteisProvider.retornarDataApi(this.dataAtendimento),
        InicioAtendimento: this.uteisProvider.retornarHoraApi(this.inicioAtendimento),
        FinalAtendimento: this.uteisProvider.retornarHoraApi(this.finalAtendimento),
        DataSolucao: this.uteisProvider.retornarDataApi(this.dataSolucao),
        InicioSolucao: this.uteisProvider.retornarHoraApi(this.inicioSolucao),
        FinalSolucao: this.uteisProvider.retornarHoraApi(this.finalSolucao),
        DataProgramacao: this.uteisProvider.retornarDataApi(this.dataProgramacao),
        Justificativa: this.justificativa,
        DescricaoAtendimento: this.descricaoAtendimento,
        Rastreabilidade: {ChamadoID: this.chamadoId, 
          StatusChamadoID: this.status, 
          Tipo: this.constantesProvider.acaoMovimentacao,
          UUID: this.device.uuid,
          Plataforma: this.device.platform,
          Modelo: this.device.model,
          Latitude: this.geolocalizacao ? this.geolocalizacao.coords.latitude : null,
          Longitude: this.geolocalizacao ? this.geolocalizacao.coords.longitude : null
         }
      };

      if (!this.origemOffline) {
        this.atualizarMovimentacaoOnline(_parametros);
      }
      else {
        this.atualizarMovimentacaoOffline(_parametros);
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  atualizarMovimentacaoOnline(_parametros: any) {
    this.chamadosProvider.salvarRegistroMovimentacoes(this.username, this.portal, this.chamadoId, this.idioma, _parametros).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.respostaApi = _objetoRetorno;

        if (this.respostaApi) {
          if (this.respostaApi.sucesso) {
            this.navParams.get("ChamadoDetalhesPage").carregarDetalhesChamado();
            this.carregarHabilitarChamado();
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
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        this.alertsProvider.fecharCarregando();
      });
  }

  atualizarMovimentacaoOffline(_parametros: any) {
    this.offlineProvider.salvarMovimentacaoOffline(this.portal, this.chamadoId, _parametros).then(data => {
      if (data) {
        //this.navParams.get("ChamadoDetalhesPage").carregarDetalhesChamado();
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgSucesso), 
        this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }

      this.alertsProvider.fecharCarregando();
    });
  }
  
  //Eventos
  atualizarMovimentacaoClick() {
    this.carregarAtualizarMovimentacao();
    //this.atualizarMovimentacao();
  }

  confirmarMovimentacaoClick = () => {
    this.atualizarMovimentacao();
  }

  statusChange(status: any) {
    if (!this.origemOffline) {
    this.carregarPrazoSlaStatus(status);
    }
  }

  redimencionarPagina() {
    this.renderer.invokeElementMethod(event.target, 'blur');
  }
}