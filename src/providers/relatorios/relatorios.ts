import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

import { ConstantesProvider } from '../constantes/constantes';

 @Injectable()

export class RelatoriosProvider {
 //Propriedades
 private urlApiRelatorios: string = "/api/relatorios";

  //Load
  constructor(public http: Http, public constantesProvider: ConstantesProvider) {
    this.urlApiRelatorios = this.constantesProvider.urlApiBaseline + this.urlApiRelatorios;
  }

  //Ações
  exibirTooltipFixo(){
    Chart.pluginService.register({
      beforeRender: function(chart) {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = [];
          chart.config.data.datasets.forEach(function(dataset, i) {
            chart.getDatasetMeta(i).data.forEach(function(sector, j) {
              chart.pluginTooltips.push(new Chart.Tooltip({
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [sector]
              }, chart));
            });
          });
    
          // turn off normal tooltips
          chart.options.tooltips.enabled = false;
        }
      },
      afterDraw: function(chart, easing) {
        if (chart.config.options.showAllTooltips) {
          // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
          if (!chart.allTooltipsOnce) {
            if (easing !== 1)
              return;
            chart.allTooltipsOnce = true;
          }
    
          // turn on tooltips
          chart.options.tooltips.enabled = true;
          Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
            tooltip.initialize();
            tooltip.update();
            // we don't actually need this since we are not animating tooltips
            tooltip.pivot();
            tooltip.transition(easing).draw();
          });
          chart.options.tooltips.enabled = false;
        }
      }
    });
  }

  //Retornos
  retornarChamadosAbertosFechados(usuario: string, portal: string, mes: number, ano: number, idioma: string) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosAbertosFechados/${usuario}/${portal}/${mes}/${ano}/${idioma}`);
  }

  retornarChamadosDentroForaPrazo(usuario: string, portal: string, idioma: string) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosDentroForaPrazo/${usuario}/${portal}/${idioma}`);
  }

  retornarChamadosEvolucao(usuario: string, portal: string, idioma: string) {
    return this.http.get(this.urlApiRelatorios + `/RetornarChamadosEvolucao/${usuario}/${portal}/${idioma}`);
  }
}
