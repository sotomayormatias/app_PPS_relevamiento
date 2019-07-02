import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoFeasPage } from './listado-feas';

@NgModule({
  declarations: [
    ListadoFeasPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoFeasPage),
  ],
})
export class ListadoFeasPageModule {}
