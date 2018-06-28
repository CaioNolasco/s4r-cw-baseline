import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadosConsumiveisPage } from './chamados-consumiveis';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChamadosConsumiveisPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadosConsumiveisPage),
    TranslateModule 
  ],
})
export class ChamadosConsumiveisPageModule {}
