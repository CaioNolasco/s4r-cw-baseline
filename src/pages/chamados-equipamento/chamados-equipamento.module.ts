import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadosEquipamentoPage } from './chamados-equipamento';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadosEquipamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadosEquipamentoPage),
    TranslateModule 
  ],
})
export class ChamadosEquipamentoPageModule {}
