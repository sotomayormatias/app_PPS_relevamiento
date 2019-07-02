import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Tab1Root, Tab2Root } from '../';

@Component({
  selector: 'page-listado-tabs',
  templateUrl: 'listado-tabs.html',
})
export class ListadoTabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;

  tab1Title = "Cosas lindas";
  tab2Title = "Cosas feas";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListadoTabsPage');
  }

}
