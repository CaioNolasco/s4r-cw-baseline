import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { ConstantesProvider } from '../../providers/constantes/constantes';

@IonicPage()
@Component({
  selector: 'page-relatorios-consumiveis',
  templateUrl: 'relatorios-consumiveis.html',
  providers: [
    ConstantesProvider
  ]
})
export class RelatoriosConsumiveisPage {
  //Propriedades
  @ViewChild('consumiveis') consumiveis;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverController: PopoverController,
    public constantesProvider: ConstantesProvider) {
  }

  ionViewDidLoad() {
    this.carregarConsumiveis();
  }

  //Ações
  carregarConsumiveis() {
    // try {
    //   if (!this.isRefreshing) {
    //     this.alertsProvider.exibirCarregando('');
    //   }

    //   this.relatoriosProvider.retornarChamadosAbertosFechados(this.username, this.portal,
    //     this.mes, this.ano, this.idioma).subscribe(
    //       data => {
    //         let _resposta = (data as any);
    //         let _objetoRetorno = JSON.parse(_resposta._body);

    //         let _corretivosMesLabels = [];
    //         let _corretivosMesData = [];

    //         if (_objetoRetorno) {
    //           for (let _relatorio of _objetoRetorno) {
    //             _corretivosMesLabels.push(_relatorio.StatusChamado);
    //             _corretivosMesData.push(_relatorio.Percentual);
    //           }

 
    //Relatório
    new Chart(this.consumiveis.nativeElement, {
      type: 'line',
      data: {
        labels: ["12/09/2018", "13/09/2018", "14/09/2018"],
        datasets: [{ label: 'DCN Lado A', fill: false, lineTension: 0.1, data: [12, 19, 3], backgroundColor: this.constantesProvider.backgroundColors[0], borderColor: this.constantesProvider.backgroundColors[0]},
         { label: 'DCN Lado B', fill: false, lineTension: 0.1, data: [7, 11, 5], backgroundColor: this.constantesProvider.backgroundColors[1], borderColor: this.constantesProvider.backgroundColors[1] },
         { label: 'DCS Lado A', fill: false, lineTension: 0.1, data: [6, 1, 5], backgroundColor: this.constantesProvider.backgroundColors[2], borderColor: this.constantesProvider.backgroundColors[2] },
         { label: 'DCS Lado B', fill: false, lineTension: 0.1, data: [8, 2, 4], backgroundColor: this.constantesProvider.backgroundColors[3], borderColor: this.constantesProvider.backgroundColors[3] }]
      },

      options: { showAllTooltips: false, responsive: true }
      //options: { showAllTooltips: true, responsive: true, onClick: this.chartClick.bind(this) }
    });


    //       }

    //         if (this.isRefreshing) {
    //           this.refresher.complete();
    //           this.isRefreshing = false;
    //         }
    //         else {
    //           this.alertsProvider.fecharCarregando();
    //         }
    //       }, e => {
    //         console.log(e);
    //         this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);

    //         if (this.isRefreshing) {
    //           this.refresher.complete();
    //           this.isRefreshing = false;
    //         }
    //         else {
    //           this.alertsProvider.fecharCarregando();
    //         }
    //       });
    // }
    // catch (e) {
    //   console.log(e);
    //   this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);

    //   if (this.isRefreshing) {
    //     this.refresher.complete();
    //     this.isRefreshing = false;
    //   }
    //   else {
    //     this.alertsProvider.fecharCarregando();
    //   }
    // }

  }

  //Eventos
  popoverClick(evento) {
    let _popover = this.popoverController.create("RelatoriosFiltroPopoverPage");
    _popover.present({
      ev: evento
    });
  }

}
