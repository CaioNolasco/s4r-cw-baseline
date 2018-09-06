import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, MenuController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { OfflineProvider } from '../../providers/offline/offline';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { RelatoriosProvider } from './../../providers/relatorios/relatorios';
import { UteisProvider } from './../../providers/uteis/uteis';

@IonicPage({name: 'RelatoriosPage'})
@Component({
  selector: 'page-relatorios',
  templateUrl: 'relatorios.html',
  providers: [
    OfflineProvider,
    ConfigLoginProvider,
    ConstantesProvider,
    AlertsProvider,
    RelatoriosProvider
  ]
})
export class RelatoriosPage {
  //Propriedades
  @ViewChild('corretivosMes') corretivosMes;
  @ViewChild('corretivosPendentes') corretivosPendentes;
  @ViewChild('evolucao') evolucao;
  nomeMes: string;
  username: string;
  portal: string;
  idioma: string;
  mes: number;
  ano: number;
  isRefreshing: boolean = false;
  refresher: any;
  tipoCorretivo: any;

  homeOffline: boolean = false;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public offlineProvider: OfflineProvider,
    public app: App, public configLoginProvider: ConfigLoginProvider, public constantesProvider: ConstantesProvider,
    public alertsProvider: AlertsProvider, public relatoriosProvider: RelatoriosProvider, public menuController: MenuController,
    public uteisProvider: UteisProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    if (!this.homeOffline) {
      this.carregarCorretivosMes();
      this.carregarCorretivosPendentes();
      this.carregarEvolucao();
      this.relatoriosProvider.exibirTooltipFixo();
      //Menu
      this.menuController.enable(true, 'menu');
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
          this.idioma = _configLoginIdiomasProvider.valor;
          let _dataAtual = new Date();
          this.mes = _dataAtual.getUTCMonth() + 1;
          this.ano = _dataAtual.getUTCFullYear();

          this.nomeMes = this.constantesProvider.nomesMeses[_dataAtual.getUTCMonth()];
          this.tipoCorretivo = "mes";

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

  carregarCorretivosMes() {
    try {
      if (!this.isRefreshing) {
        this.alertsProvider.exibirCarregando('');
      }

      this.relatoriosProvider.retornarChamadosAbertosFechados(this.username, this.portal,
        this.mes, this.ano, this.idioma).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            let _corretivosMesLabels = [];
            let _corretivosMesData = [];

            if (_objetoRetorno) {
              for (let _relatorio of _objetoRetorno) {
                _corretivosMesLabels.push(_relatorio.StatusChamado);
                _corretivosMesData.push(_relatorio.Percentual);
              }

              //Relatório
              new Chart(this.corretivosMes.nativeElement, {
                type: 'pie',
                data: {
                  labels: _corretivosMesLabels,
                  datasets: [{ data: _corretivosMesData, backgroundColor: this.constantesProvider.backgroundColors }]
                },
                
                options: { showAllTooltips: true, responsive: true }
                //options: { showAllTooltips: true, responsive: true, onClick: this.chartClick.bind(this) }
              });

              
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
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);

            if (this.isRefreshing) {
              this.refresher.complete();
              this.isRefreshing = false;
            }
            else {
              this.alertsProvider.fecharCarregando();
            }
          });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);

      if (this.isRefreshing) {
        this.refresher.complete();
        this.isRefreshing = false;
      }
      else {
        this.alertsProvider.fecharCarregando();
      }
    }
  }

  carregarCorretivosPendentes() {
    try {
      this.relatoriosProvider.retornarChamadosDentroForaPrazo(this.username, this.portal, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          let _corretivosPendentesLabels = [];
          let _corretivosPendentesData = [];

          if (_objetoRetorno) {
            for (let _relatorio of _objetoRetorno) {
              _corretivosPendentesLabels.push(_relatorio.StatusChamado);
              _corretivosPendentesData.push(_relatorio.Percentual);
            }

            //Relatório
            new Chart(this.corretivosPendentes.nativeElement, {
              type: 'pie',
              data: {
                labels: _corretivosPendentesLabels,
                datasets: [{ data: _corretivosPendentesData, backgroundColor: this.constantesProvider.backgroundColors }]
              },
              options: { showAllTooltips: true, responsive: true }
            });
          }
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  carregarEvolucao() {
    try {
      this.relatoriosProvider.retornarChamadosEvolucao(this.username, this.portal, this.idioma).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          let _evolucaoLabels = [];
          let _evolucaoData = [];

          if (_objetoRetorno) {
            for (let _relatorio of _objetoRetorno) {
              _evolucaoLabels.push(_relatorio.Mes);
              _evolucaoData.push(_relatorio.Quantidade);
            }

            //Relatório
            new Chart(this.evolucao.nativeElement, {
              type: 'line',
              data: {
                labels: _evolucaoLabels,
                datasets: [{ data: _evolucaoData, backgroundColor: this.constantesProvider.backgroundColors }]
              },
              options: { showAllTooltips: true, responsive: true, legend: false }
            });
          }
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  // Eventos
  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarCorretivosMes();
    this.carregarCorretivosPendentes();
    this.carregarEvolucao();
  }

  // public chartClick(evento): void {
  //   console.log(evento);
  //   alert('1');
  // }

  // public chartHover(evento): void {
  //   console.log(evento);
  // }

  //  chartClick(event, array) {
  //    console.log(event);
  //    console.log(array);
  // }
}
