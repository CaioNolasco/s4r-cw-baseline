import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RotinasPage } from './rotinas';

@NgModule({
  declarations: [
    RotinasPage,
  ],
  imports: [
    IonicPageModule.forChild(RotinasPage),
  ],
})
export class RotinasPageModule {}
