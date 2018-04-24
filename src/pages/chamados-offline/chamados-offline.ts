import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, Events } from 'ionic-angular';

import { OfflineProvider } from './../../providers/offline/offline';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { UteisProvider } from './../../providers/uteis/uteis';
import { ChamadosProvider } from './../../providers/chamados/chamados';

import { ChamadoHistoricoPage } from '../chamado-historico/chamado-historico';
import { ChamadoDetalhesPage } from '../chamado-detalhes/chamado-detalhes';
import { HomeOfflinePage } from '../home-offline/home-offline';


@IonicPage()
@Component({
  selector: 'page-chamados-offline',
  templateUrl: 'chamados-offline.html',
  providers: [
    OfflineProvider,
    ConfigLoginProvider,
    AlertsProvider,
    UteisProvider,
    ChamadosProvider
  ]
})
export class ChamadosOfflinePage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string;
  msgNenhumItem: string;
  chamados: any;
  chamado: any;
  refresher: any;
  respostaApi: any;
  exibirMsg: boolean = false;
  isRefreshing: boolean = false;
  origemOffline: boolean = false;
  homeOffline: boolean = false;
  syncOffline: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public offlineProvider: OfflineProvider,
    public events: Events, public configLoginProvider: ConfigLoginProvider, public alertsProvider: AlertsProvider,
    public viewCtrl: ViewController, public uteisProvider: UteisProvider, public chamadosProvider: ChamadosProvider,
    public app: App) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    if (!this.homeOffline) {
      this.carregarChamados();
    }
  }

  ionViewDidEnter() {
    if (this.offlineProvider.retornarConfigBadgesOffline() && !this.homeOffline) {
      this.carregarChamados();
    }

    this.syncOffline = this.offlineProvider.validarInternetOffline();
    this.carregarBadge();
  }

  //Ações
  carregarDados() {
    try {
      //Verificar se está online ou offline
      this.origemOffline = this.navParams.get("OrigemOffline");

      if (this.offlineProvider.validarInternetOffline() && !this.origemOffline) {
        this.app.getRootNav().setRoot(HomeOfflinePage);
        this.homeOffline = true;
      }
      else {
        this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
        this.exibirMsg = false;

        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

        if (_configLoginProvider) {
          this.username = _configLoginProvider.username;
          this.nomePortal = _configLoginProvider.nomePortal;
          this.portal = _configLoginProvider.portal;
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarChamados() {
    try {
      if (!this.isRefreshing) {
        this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);
      }

      this.exibirMsg = false;

      this.offlineProvider.retornarChamadosOffline(this.portal).then(data => {
        this.chamados = data;

        if (!this.chamados[0]) {
          this.exibirMsg = true;
          this.chamados = null;
        }
      }).catch((e) => {
        this.exibirMsg = true;
        this.chamados = null;
      });

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
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

  carregarBadge() {
    try {
      this.offlineProvider.removerConfigBadgesOffline();
      this.events.publish('badge:exibir');
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarEstruturaOffline() {
    try {
      let _titulo = this.alertsProvider.msgTituloPadrao;

      let _botoes: any = [{ text: this.alertsProvider.msgBotaoCancelar },
      { text: this.alertsProvider.msgBotaoConfirmar, handler: this.confirmarDownloadClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(_titulo, this.alertsProvider.msgConfirmarAtualizarEstrutura, _botoes);
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  sincronizarChamado(chamado: any) {
    try {
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);
      let _fotos;

      this.offlineProvider.retornarFotosOffline(this.portal, chamado.ChamadoID, true).then(data => {
        _fotos = data;
      }).catch((e) => {
        _fotos = null;
        console.log(e);
      });

      this.offlineProvider.retornarDetalhesChamadoOffline(this.portal, chamado.ChamadoID).then(data => {
        this.chamado = data;

        if (this.chamado) {
          let _parametros = {
            ChamadoID: this.chamado.ChamadoID,
            StatusChamadoID: this.chamado.StatusChamadoID,
            TipoChamado: this.chamado.TipoChamado,
            Acao: this.chamado.Acao,
            DataAtendimento: this.uteisProvider.retornarDataApi(this.chamado.DataInicialEfetivaAtendimento, true),
            InicioAtendimento: this.uteisProvider.retornarHoraApi(this.chamado.DataInicialEfetivaAtendimento, true),
            FinalAtendimento: this.uteisProvider.retornarHoraApi(this.chamado.DataFinalEfetivaAtendimento, true),
            DataSolucao: this.uteisProvider.retornarDataApi(this.chamado.DataInicialEfetivaSolucao, true),
            InicioSolucao: this.uteisProvider.retornarHoraApi(this.chamado.DataInicialEfetivaSolucao, true),
            FinalSolucao: this.uteisProvider.retornarHoraApi(this.chamado.DataFinalEfetivaSolucao, true),
            DataProgramacao: this.uteisProvider.retornarDataApi(this.chamado.DataProgramacaoAtendimento, true),
            Justificativa: this.chamado.TextoJustificativa,
            DescricaoAtendimento: this.chamado.DescricaoAtendimento,
            Anexos: _fotos
          };

          this.chamadosProvider.salvarSincronizacao(this.username, this.portal, chamado.ChamadoID, false, _parametros).subscribe(
            data => {
              let _resposta = (data as any);
              let _objetoRetorno = JSON.parse(_resposta._body);

              this.respostaApi = _objetoRetorno;

              if (this.respostaApi) {
                if (this.respostaApi.sucesso) {
                  let _index = this.chamados.indexOf(chamado);

                  if (_index > -1) {
                    this.chamados.splice(_index, 1);
                  }

                  if (!this.chamados[0]) {
                    this.exibirMsg = true;
                    this.chamados = null;
                  }

                  this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
                  this.offlineProvider.excluirChamadoOffline(this.portal, chamado.ChamadoID);
                }
                else {
                  this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
                }
              }
              else {
                this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
              }

              this.alertsProvider.fecharCarregando();
            }, e => {
              console.log(e);
              this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
              this.alertsProvider.fecharCarregando();
            });
        }
      }).catch((e) => {
        this.exibirMsg = true;
        this.chamado = null;
        this.alertsProvider.fecharCarregando();
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  salvarEstruturaOffline(){
    try{
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

      this.offlineProvider.removerConfigEstruturaSQLite();
      let _sqlite = this.offlineProvider.salvarBancoSQLite();
      this.offlineProvider.salvarEstruturaSQLite(_sqlite);

      this.alertsProvider.exibirToast(this.alertsProvider.msgSucesso, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
      this.alertsProvider.fecharCarregando();
    }
    catch(e){
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  //Eventos
  atualizarClick() {
    this.carregarChamados();
  }

  historicoClick(chamado) {
    this.navCtrl.push(ChamadoHistoricoPage, { ChamadoID: chamado.ChamadoID, OrigemOffline: true });
  }

  abrirDetalhesClick(chamado) {
    this.navCtrl.push(ChamadoDetalhesPage, { ChamadoID: chamado.ChamadoID, OrigemOffline: true });
  }

  estruturaClick() {
    this.carregarEstruturaOffline();
  }

  confirmarDownloadClick = () => {
    this.salvarEstruturaOffline();
  }

  sincronizarClick(chamado) {
    this.sincronizarChamado(chamado);
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarChamados();
  }
}
