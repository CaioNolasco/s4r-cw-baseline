import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeOfflinePage } from './home-offline';

@NgModule({
  declarations: [
    HomeOfflinePage,
  ],
  imports: [
    IonicPageModule.forChild(HomeOfflinePage),
  ],
})
export class HomeOfflinePageModule {}
