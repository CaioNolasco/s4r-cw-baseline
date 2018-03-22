import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoHistoricoPage } from './chamado-historico';

@NgModule({
  declarations: [
    ChamadoHistoricoPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoHistoricoPage),
  ],
})
export class ChamadoHistoricoPageModule {}
