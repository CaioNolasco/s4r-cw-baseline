import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ChamadosProvider } from '../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { UteisProvider } from './../../providers/uteis/uteis';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { OfflineProvider } from '../../providers/offline/offline';

import { LoginPage } from '../login/login';
import { HomeOfflinePage } from '../home-offline/home-offline';

@IonicPage()
@Component({
  selector: 'page-chamado-movimentacao',
  templateUrl: 'chamado-movimentacao.html',
  providers: [
    ConfigLoginProvider,
    ChamadosProvider,
    AlertsProvider,
    UteisProvider,
    ConstantesProvider,
    OfflineProvider]
})
export class ChamadoMovimentacaoPage {
  //Propriedades
  chamadoId: string;
  username: string;
  portal: string;
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
  habilitarChamado: boolean;
  origemOffline: boolean = false;
  alterarChamado: boolean = false;
  homeOffline: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public configLoginProvider: ConfigLoginProvider, public chamadosProvider: ChamadosProvider,
    public alertsProvider: AlertsProvider, public uteisProvider: UteisProvider, public constantesProvider: ConstantesProvider,
    public renderer: Renderer, public offlineProvider: OfflineProvider, public app: App) {
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
        this.app.getRootNav().setRoot(HomeOfflinePage);
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

        if (_configLoginProvider) {
          this.portal = _configLoginProvider.portal;
          this.username = _configLoginProvider.username;
          this.chamadoId = this.navParams.get("ChamadoID");
          this.tipoServicoId = this.navParams.get("TipoServicoID");
          this.habilitarChamado = false;
          this.carregarSubtipos();
          this.carregarStatus();
        }
        else {
          this.app.getRootNav().setRoot(LoginPage);
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
      }
    )
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
    this.chamadosProvider.retornarStatus(this.portal).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.opcoesStatus = _objetoRetorno;
      }
    )
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
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

      if (!this.origemOffline) {
        this.carregarDadosFormOnline();
      }
      else {
        this.carregarDadosFormOffline();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarDadosFormOnline() {
    this.chamadosProvider.retornarChamadoDetalhes(this.username, this.portal, this.chamadoId).subscribe(
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
        }

        this.alertsProvider.fecharCarregando();
      }
    )
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

  carregarHabilitarChamado() {
    try {
      this.chamadosProvider.retornarChamadoDetalhes(this.username, this.portal, this.chamadoId).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.chamado = _objetoRetorno;

          if (this.chamado) {
            this.habilitarChamado = this.chamado.HabilitarChamado;
          }
        }
      )
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarAtualizarMovimentacao() {
    try {
      let _titulo = `${this.alertsProvider.msgTituloAtualizar} ${this.chamadoId}`;

      let _botoes: any = [{ text: this.alertsProvider.msgBotaoCancelar },
      { text: this.alertsProvider.msgBotaoConfirmar, handler: this.confirmarMovimentacaoClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.alertsProvider.msgConfirmacao, _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }

  atualizarMovimentacao() {
    try {
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

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
        DescricaoAtendimento: this.descricaoAtendimento
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
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  atualizarMovimentacaoOnline(_parametros: any) {
    this.chamadosProvider.salvarRegistroMovimentacoes(this.username, this.portal, this.chamadoId, _parametros).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.respostaApi = _objetoRetorno;

        if (this.respostaApi) {
          if (this.respostaApi.sucesso) {
            //this.carregarHabilitarChamado();
            //this.navParams.get("ChamadoDetalhesPage").carregarDetalhesChamado();
            this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
          }
          else {
            this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }
        }
        else {
          this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        }
        this.alertsProvider.fecharCarregando();

      });
  }

  atualizarMovimentacaoOffline(_parametros: any) {
    this.offlineProvider.salvarMovimentacaoOffline(this.portal, this.chamadoId, _parametros).then(data => {
      if (data) {
        //this.navParams.get("ChamadoDetalhesPage").carregarDetalhesChamado();
        this.alertsProvider.exibirToast(this.alertsProvider.msgSucesso, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      }
      else {
        this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }

      this.alertsProvider.fecharCarregando();
    });
  }
  //Eventos
  atualizarMovimentacaoClick() {
    //this.carregarAtualizarMovimentacao();
    this.atualizarMovimentacao();
  }

  confirmarMovimentacaoClick = () => {
    this.atualizarMovimentacao();
  }

  redimencionarPagina() {
    this.renderer.invokeElementMethod(event.target, 'blur');
  }
}