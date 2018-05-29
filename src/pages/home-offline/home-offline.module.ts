import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeOfflinePage } from './home-offline';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HomeOfflinePage,
  ],
  imports: [
    IonicPageModule.forChild(HomeOfflinePage),
    TranslateModule 
  ],
})
export class HomeOfflinePageModule {}
