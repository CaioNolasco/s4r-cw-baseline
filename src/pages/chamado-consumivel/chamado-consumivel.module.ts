import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoConsumivelPage } from './chamado-consumivel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoConsumivelPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoConsumivelPage),
    TranslateModule
  ],
})
export class ChamadoConsumivelPageModule {}
