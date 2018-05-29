import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoHistoricoPage } from './chamado-historico';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoHistoricoPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoHistoricoPage),
    TranslateModule 
  ],
})
export class ChamadoHistoricoPageModule {}
