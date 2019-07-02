import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-fotos-feas',
  templateUrl: 'fotos-feas.html',
})
export class FotosFeasPage {
  captureDataUrl: Array<string>;
  hayFotos: boolean = false;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public camera: Camera
  ) {
    this.captureDataUrl = new Array<string>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FotosFeasPage');
  }

  tomarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.captureDataUrl.push('data:image/jpeg;base64,' + imageData);
      this.hayFotos = true;
    }, (err) => {
      this.alertCtrl.create({
        title: 'Error!',
        subTitle: err,
        buttons: ['OK']
      }).present();
    });
  }

  guardarFotos() {
    let usuario = JSON.parse(sessionStorage.getItem('usuario'));
    let storageRef = firebase.storage().ref();
    let errores: number = 0;

    this.captureDataUrl.forEach(foto => {
      let filename: string = Date.now() + "_" + usuario.correo;
      const imageRef = storageRef.child(`images/${filename}.jpg`);

      let datos: any = { 'usuario': usuario.correo, 'foto': filename, 'fecha': (new Date()).toLocaleDateString(), 'votos': 0 };
      this.guardardatosDeFoto(datos);

      imageRef.putString(foto, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      })
        .catch(() => {
          errores++;
        });
    });

    if (errores == 0)
      this.subidaExitosa();
    else
      this.subidaErronea("Error en al menos una foto");
  }

  guardardatosDeFoto(datos) {
    let storageRef = firebase.database().ref('fotosfeas/');
    let imageData = storageRef.push();
    imageData.set(datos);
  }

  subidaExitosa() {
    this.alertCtrl.create({
      title: 'Éxito!',
      subTitle: 'La imagen fue subida correctamente',
      buttons: ['OK']
    }).present();

    // clear the previous photo data in the variable
    this.captureDataUrl.length = 0;
  }

  subidaErronea(mensaje: string) {
    this.alertCtrl.create({
      title: 'Error!',
      subTitle: mensaje,
      buttons: ['OK']
    }).present();
  }
}
