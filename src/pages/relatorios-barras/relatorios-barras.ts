import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-relatorios-barras',
  templateUrl: 'relatorios-barras.html',
})
export class RelatoriosBarrasPage {

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverController: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelatoriosBarrasPage');
  }

  //Eventos
  popoverClick(evento) {
    let _popover = this.popoverController.create("RelatoriosFiltroPopoverPage");
    _popover.present({
      ev: evento
    });
  }

}
