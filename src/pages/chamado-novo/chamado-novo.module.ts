import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoNovoPage } from './chamado-novo';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadoNovoPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoNovoPage),
    TranslateModule 
  ],
})
export class ChamadoNovoPageModule {}
