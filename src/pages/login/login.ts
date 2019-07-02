import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { snapshotToArray } from '../../app/app.firebase.config';

import { PrincipalPage } from '../principal/principal';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [
    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0,2000px,0' }),
        animate('2000ms ease-in-out')
      ])
    ]),

    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0,2000px,0)' }),
        animate('1000ms ease-in-out')
      ])
    ]),

    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({ transform: 'translate3d(0,2000px,0)', offset: 0 }),
          style({ transform: 'translate3d(0,-20px,0)', offset: 0.9 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ])
    ]),

    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})

export class LoginPage {
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  splash = true;

  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  ref = firebase.database().ref('usuarios/');
  users: any[];

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
    this.ref.on('value', resp => {
      this.users = snapshotToArray(resp);
    });
  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }

  // Attempt to login in through our User service
  async doLogin() {
    let usuarioLogueado = this.users.find(elem => (elem.correo == this.account.email && elem.clave == this.account.password));

    if (usuarioLogueado !== undefined) {
      sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
      this.navCtrl.setRoot(PrincipalPage);
    } else {
      this.toastCtrl.create({
        message: "Usuario o password incorrecto.",
        duration: 3000,
        position: 'top'
      }).present();
    }
  }

  cargarUsuario(usuario: string) {
    switch (usuario) {
      case "admin":
        this.account.email = "admin@gmail.com";
        this.account.password = "1111";
        break;
      case "invitado":
        this.account.email = "invitado@gmail.com";
        this.account.password = "2222";
        break;
      case "usuario":
        this.account.email = "usuario@gmail.com";
        this.account.password = "3333";
        break;
      case "anonimo":
        this.account.email = "anonimo@gmail.com";
        this.account.password = "4444";
        break;
      case "tester":
        this.account.email = "tester@gmail.com";
        this.account.password = "5555";
        break;
      default:
        this.account.email = "";
        this.account.password = "";
        break;
    }
  }
}
