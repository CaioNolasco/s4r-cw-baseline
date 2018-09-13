import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadosOfflinePage } from './chamados-offline';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadosOfflinePage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadosOfflinePage),
    TranslateModule
  ],
})
export class ChamadosOfflinePageModule { }
