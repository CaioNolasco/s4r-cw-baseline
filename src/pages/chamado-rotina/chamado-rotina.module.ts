import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoRotinaPage } from './chamado-rotina';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoRotinaPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoRotinaPage),
    TranslateModule
  ],
})
export class ChamadoRotinaPageModule {}
