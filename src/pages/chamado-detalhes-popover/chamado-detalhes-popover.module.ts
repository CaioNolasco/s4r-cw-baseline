import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoDetalhesPopoverPage } from './chamado-detalhes-popover';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoDetalhesPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoDetalhesPopoverPage),
    TranslateModule 
  ],
})
export class ChamadoDetalhesPopoverPageModule {}
