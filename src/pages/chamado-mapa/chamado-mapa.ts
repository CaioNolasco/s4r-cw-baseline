import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';

declare var google;

@IonicPage({name: 'ChamadoMapaPage'})
@Component({
  selector: 'page-chamado-mapa',
  templateUrl: 'chamado-mapa.html',
  providers: [AlertsProvider,
    ConstantesProvider,
    UteisProvider]
})
export class ChamadoMapaPage {
  //Propriedades
  mapa: any;
  endereco: string;
  cidade: string;
  estado: string;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertsProvider: AlertsProvider,
  public uteisProvider: UteisProvider, public constantesProvider: ConstantesProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.carregarMapa();
  }

  //Ações
  carregarDados() {
    this.endereco = this.navParams.get("Endereco");
    this.cidade = this.navParams.get("Cidade");
    this.estado = this.navParams.get("Estado");
  }

  carregarMapa() {
    try {
      let _endereco = `${this.endereco}, ${this.cidade} - ${this.estado}`;

      if (_endereco) {
        let _posicao: any;
        let _geocoder = new google.maps.Geocoder();

        _geocoder.geocode({
          'address': _endereco
        },
          function (_resultado, _status) {
            if (_status == google.maps.GeocoderStatus.OK) {
              _posicao = _resultado[0].geometry.location;

              let _opcoesMapa = {
                zoom: 15,
                center: _posicao
              }

              this.mapa = new google.maps.Map(document.getElementById('mapa'), _opcoesMapa);

              new google.maps.Marker({
                position: _posicao,
                map: this.mapa,
                animation: google.maps.Animation.DROP
              });
            }
            else {
              this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
              this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }
          });
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgNenhumItem), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  //Eventos
  fecharClick() {
    this.navCtrl.pop();
  }
}
