import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoMateriaisNovoPage } from './chamado-materiais-novo';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoMateriaisNovoPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoMateriaisNovoPage),
    TranslateModule 
  ],
})
export class ChamadoMateriaisNovoPageModule {}
