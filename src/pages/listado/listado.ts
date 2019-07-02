import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage, Slides } from 'ionic-angular';
import firebase from "firebase";
import { Observable } from 'rxjs';
import { snapshotToArray } from '../../app/app.firebase.config';
import { DeviceMotion, DeviceMotionAccelerationData } from "@ionic-native/device-motion";

@IonicPage()
@Component({
  selector: 'page-listado',
  templateUrl: 'listado.html',
})
export class ListadoPage {

  @ViewChild(Slides) slides: Slides;

  imagenes: Array<{
    key: any,
    fecha: string,
    foto: string,
    usuario: string,
    urlCompleta: string,
    votos: number
  }>;

  ListadoObservable: Observable<any[]>;
  votadas: Array<string>;

  flagVertical: boolean = true;
  flagDerecha: boolean = true;
  flagIzquierda: boolean = true;
  subscriptionMotion: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public deviceMotion: DeviceMotion
  ) {
    this.downloadImageUrls();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListadoPage');

    this.subscriptionMotion = this.deviceMotion.watchAcceleration({ frequency: 200 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        if (acceleration.x < -3.0 && this.flagDerecha) {
          this.flagDerecha = false;
          this.slides.slideNext();
        } else if (acceleration.x > -3.0 && !this.flagDerecha) {
          this.flagDerecha = true;
        }

        if (acceleration.x > 3.0 && this.flagIzquierda) {
          this.flagIzquierda = false;
          this.slides.slidePrev();
        } else if (acceleration.x < 3.0 && !this.flagIzquierda) {
          this.flagIzquierda = true;
        }

        if (acceleration.y > 3.0 && this.flagVertical) {
          this.flagVertical = false;
          this.slides.slideTo(0);
        } else if (acceleration.y < 3.0 && !this.flagVertical) {
          this.flagVertical = true;
        }
      },
        (err) => console.log(err));
  }

  downloadImageUrls() {
    this.imagenes = new Array();
    let ref = firebase.database().ref('fotoslindas/');

    ref.on('value', resp => {
      snapshotToArray(resp).forEach(element => {
        // console.log(element);
        let foto: { key, fecha, foto, usuario, urlCompleta, votos } =
        {
          key: element.key,
          fecha: element.fecha,
          usuario: element.usuario,
          foto: element.foto,
          votos: element.votos,
          urlCompleta: ""
        };
        let promise = this.traerFotos('images/' + foto.foto + '.jpg');
        Promise.resolve(promise)
          .then(url => {
            foto.urlCompleta = url;
          });
        this.imagenes.push(foto);
      });
    });
  }

  traerFotos(path): any {
    let storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(path);
    return imageRef.getDownloadURL();
  }

  votar(key: string, votos: number) {
    let objeto: { key, fecha, foto, usuario, urlCompleta, votos } = this.imagenes.find(elem => elem.key == key);
    objeto.votos = votos + 1;
    firebase.database().ref('fotoslindas/' + key).update(objeto);
    this.downloadImageUrls();
  }

}
