import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoMateriaisPage } from './chamado-materiais';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoMateriaisPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoMateriaisPage),
    TranslateModule 
  ],
})
export class ChamadoMateriaisPageModule {}
