import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { RelatoriosPage } from './relatorios';

@NgModule({
  declarations: [
    RelatoriosPage,
  ],
  imports: [
    IonicPageModule.forChild(RelatoriosPage),
    TranslateModule 
  ],
})
export class RelatoriosPageModule {}
