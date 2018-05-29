import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoAnexosPage } from './chamado-anexos';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoAnexosPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoAnexosPage),
    TranslateModule 
  ],
})
export class ChamadoAnexosPageModule {}
