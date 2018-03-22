import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ChamadosProvider } from '../../providers/chamados/chamados';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { UteisProvider } from './../../providers/uteis/uteis';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-chamado-movimentacao',
  templateUrl: 'chamado-movimentacao.html',
  providers: [
    ConfigLoginProvider,
    ChamadosProvider,
    AlertsProvider,
    UteisProvider]
})
export class ChamadoMovimentacaoPage {
  //Propriedades
  chamadoId: string;
  portal: string;
  opcoesAcoes: any;
  opcoesStatus: any;
  chamado: any;

  dataAtendimento: any;
  inicioAtendimento: any;
  finalAtendimento: any;
  descricaoAtendimento: any;
  dataSolucao: any;
  inicioSolucao: any;
  finalSolucao: any;
  dataProgramacao: any;
  justificativa: any;
  acoes: any;
  status: any;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
  public configLoginProvider: ConfigLoginProvider, public chamadosProvider: ChamadosProvider, 
  public alertsProvider: AlertsProvider, public uteisProvider: UteisProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    this.carregarDadosForm();
  }

  //Ações
  carregarDados(){
    let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

    if (_configLoginProvider) {
      this.portal = _configLoginProvider.portal;
      this.chamadoId = this.navParams.get("ChamadoID");
      this.carregarAcoes();
      this.carregarStatus();
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  carregarAcoes(){
    this.chamadosProvider.retornarAcoes(this.portal).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.opcoesAcoes = _objetoRetorno;
      }, error => {
        this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        
        console.log(error);
      }
    )
  }

  carregarStatus(){
    this.chamadosProvider.retornarStatus(this.portal).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.opcoesStatus = _objetoRetorno;
      }, error => {
        this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        
        console.log(error);
      }
    )
  }

  carregarDadosForm(){
    this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

    this.chamadosProvider.retornarChamadoPorNumero(this.portal, this.chamadoId).subscribe(
      data => {
        let _resposta = (data as any);
        let _objetoRetorno = JSON.parse(_resposta._body);

        this.chamado = _objetoRetorno;

        if(this.chamado){
          let _dataAtendimentoInicial = this.uteisProvider.retornarIonicDateTime(this.chamado.DataInicialEfetivaAtendimento);
          let _dataAtendimentoFinal = this.uteisProvider.retornarIonicDateTime(this.chamado.DataFinalEfetivaAtendimento);
          let _dataSolucaoInicial = this.uteisProvider.retornarIonicDateTime(this.chamado.DataInicialEfetivaSolucao);
          let _dataSolucaoFinal = this.uteisProvider.retornarIonicDateTime(this.chamado.DataFinalEfetivaSolucao);
          let _dataProgramacao = this.uteisProvider.retornarIonicDateTime(this.chamado.DataProgramacaoAtendimento);

          this.dataAtendimento = _dataAtendimentoInicial;
          this.inicioAtendimento = _dataAtendimentoInicial;
          this.finalAtendimento = _dataAtendimentoFinal;
          this.descricaoAtendimento = this.chamado.DescricaoAtendimento;
          this.dataSolucao =_dataSolucaoInicial;
          this.inicioSolucao =_dataSolucaoInicial;
          this.finalSolucao = _dataSolucaoFinal;
          this.dataProgramacao = _dataProgramacao;
          this.justificativa = this.chamado.TextoJustificativa;
          this.acoes = this.chamado.Acao;
          this.status = this.chamado.StatusChamadoID;
        }

        this.alertsProvider.fecharCarregando();
      }, error => {
        this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        this.alertsProvider.fecharCarregando();

        console.log(error);
      }
    )
  }
}
