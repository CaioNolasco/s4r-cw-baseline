import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoDetalhesPopoverPage } from './chamado-detalhes-popover';

@NgModule({
  declarations: [
    ChamadoDetalhesPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoDetalhesPopoverPage),
  ],
})
export class ChamadoDetalhesPopoverPageModule {}
