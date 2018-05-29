import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoMovimentacaoPage } from './chamado-movimentacao';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoMovimentacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoMovimentacaoPage),
    TranslateModule 
  ],
})
export class ChamadoMovimentacaoPageModule {}
