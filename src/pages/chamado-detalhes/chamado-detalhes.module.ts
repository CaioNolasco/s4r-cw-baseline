import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoDetalhesPage } from './chamado-detalhes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoDetalhesPage
  ],
  imports: [
    IonicPageModule.forChild(ChamadoDetalhesPage),
    TranslateModule 
  ],
})
export class ChamadoDetalhesPageModule {}
