import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadoNovoPage } from './chamado-novo';

@NgModule({
  declarations: [
    ChamadoNovoPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadoNovoPage),
  ],
})
export class ChamadoNovoPageModule {}
