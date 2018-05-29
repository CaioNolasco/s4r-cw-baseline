import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadosOfflinePage } from './chamados-offline';

@NgModule({
  declarations: [
    ChamadosOfflinePage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadosOfflinePage),
  ],
})
export class ChamadosOfflinePageModule { }
