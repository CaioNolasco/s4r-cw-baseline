import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoMapaPage } from './chamado-mapa';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoMapaPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoMapaPage),
    TranslateModule 
  ],
})
export class ChamadoMapaPageModule {}
