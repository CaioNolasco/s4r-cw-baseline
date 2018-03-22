import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoDetalhesPage } from './chamado-detalhes';


@NgModule({
  declarations: [
    ChamadoDetalhesPage
  ],
  imports: [
    IonicPageModule.forChild(ChamadoDetalhesPage),
  ],
})
export class ChamadoDetalhesPageModule {}
