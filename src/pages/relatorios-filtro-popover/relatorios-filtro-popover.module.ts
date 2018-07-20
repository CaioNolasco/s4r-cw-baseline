import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RelatoriosFiltroPopoverPage } from './relatorios-filtro-popover';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RelatoriosFiltroPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(RelatoriosFiltroPopoverPage),
    TranslateModule 
  ],
})
export class RelatoriosFiltroPopoverPageModule {}
