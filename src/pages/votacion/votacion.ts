import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from "firebase";
import { snapshotToArray } from '../../app/app.firebase.config';
import { Chart } from "chart.js";

/**
 * Generated class for the VotacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-votacion',
  templateUrl: 'votacion.html',
})
export class VotacionPage {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  imagenesLindas: Array<{
    key: any,
    fecha: string,
    foto: string,
    usuario: string,
    urlCompleta: string,
    votos: number
  }>;
  imagenesFeas: Array<{
    key: any,
    fecha: string,
    foto: string,
    usuario: string,
    urlCompleta: string,
    votos: number
  }>;
  votosLindas: number[] = [];
  votosFeas: number[] = [];

  barChart: any;
  doughnutChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  // ngOnInit() {
  //   this.traerDatosLindas()
  //   this.traerDatosFeas()
  // }

  ionViewDidLoad() {
    this.traerDatosLindas();
    this.traerDatosFeas();

    setTimeout(() => {
      this.crearGraficoDona();
      this.crearGraficoBarra();
    }, 1000);

  }

  traerDatosLindas() {
    this.imagenesLindas = new Array();
    let ref = firebase.database().ref('fotoslindas/');

    ref.on('value', resp => {
      snapshotToArray(resp).forEach(element => {
        let foto: { key, fecha, foto, usuario, urlCompleta, votos } =
        {
          key: element.key,
          fecha: element.fecha,
          usuario: element.usuario,
          foto: element.foto,
          votos: element.votos,
          urlCompleta: element.urlCompleta
        };
        let promise = this.traerFotos('images/' + foto.foto + '.jpg');
        Promise.resolve(promise)
          .then(url => {
            foto.urlCompleta = url;
          });
        this.imagenesLindas.push(foto);
      });
      sessionStorage.setItem("lindas", JSON.stringify(this.imagenesLindas));
    });
  }

  traerDatosFeas() {
    this.imagenesFeas = new Array();
    let ref = firebase.database().ref('fotosfeas/');

    ref.on('value', resp => {
      snapshotToArray(resp).forEach(element => {
        let foto: { key, fecha, foto, usuario, urlCompleta, votos } =
        {
          key: element.key,
          fecha: element.fecha,
          usuario: element.usuario,
          foto: element.foto,
          votos: element.votos,
          urlCompleta: element.urlCompleta
        };
        let promise = this.traerFotos('images/' + foto.foto + '.jpg');
        Promise.resolve(promise)
          .then(url => {
            foto.urlCompleta = url;
          });
        this.imagenesFeas.push(foto);
        sessionStorage.setItem("feas", JSON.stringify(this.imagenesFeas));
      });
    });
  }

  traerFotos(path): any {
    let storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(path);
    return imageRef.getDownloadURL();
  }

  crearGraficoDona() {
    this.imagenesLindas.forEach(elem => {
      this.votosLindas.push(elem.votos);
    });

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Votos',
          data: this.votosLindas, // [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
      },
      options: {
        tooltips: {
          enabled: false,

          custom: function (tooltipModel) {
            // Tooltip Element
            var tooltipEl = document.getElementById('chartjs-tooltip');

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<table></table>';
              document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = '0';
              return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
              return bodyItem.lines;
            }

            // Set Text
            if (tooltipModel.body) {
              // var titleLines = tooltipModel.title || [];
              var bodyLines = tooltipModel.body.map(getBody);
              var votos = bodyLines[0][0].split(':')[1].trim();
              var url = JSON.parse(sessionStorage.getItem('lindas')).find(elem => elem.votos == votos).urlCompleta;
              var innerHtml = votos > 1 ? '<h3>' + votos + ' votos</h3>' : '<h3>' + votos + ' voto</h3>';
              innerHtml += '<img style="width:80px" src="' + url + '">';

              var tableRoot = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
            }

            // `this` will be the overall tooltip
            var position = this._chart.canvas.getBoundingClientRect();

            // Display, position, and set styles for font
            tooltipEl.style.opacity = '1';
            tooltipEl.style.position = 'absolute';
            // let offsetX = position.left + window.pageXOffset + tooltipModel.caretX - 40;
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            // tooltipEl.style.left = offsetX + 'px';
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
            tooltipEl.style.pointerEvents = 'none';
          }
        }

      }
    });
  }

  crearGraficoBarra() {
    this.imagenesFeas.forEach(elem => {
      this.votosFeas.push(elem.votos);
    });

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['foto 1', 'foto 2', 'foto 3'],
        datasets: [{
          label: 'Votos',
          data: this.votosFeas, // [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          enabled: false,

          custom: function (tooltipModel) {
            // Tooltip Element
            var tooltipEl = document.getElementById('chartjs-tooltip');

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<table></table>';
              document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = '0';
              return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
              return bodyItem.lines;
            }

            // Set Text
            if (tooltipModel.body) {
              // var titleLines = tooltipModel.title || [];
              var bodyLines = tooltipModel.body.map(getBody);
              var votos = bodyLines[0][0].split(':')[1].trim();
              var url = JSON.parse(sessionStorage.getItem('feas')).find(elem => elem.votos == votos).urlCompleta;
              var innerHtml = votos > 1 ? '<h3>' + votos + ' votos</h3>' : '<h3>' + votos + ' voto</h3>';
              innerHtml += '<img style="width:80px" src="' + url + '">';

              var tableRoot = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
            }

            // `this` will be the overall tooltip
            var position = this._chart.canvas.getBoundingClientRect();

            // Display, position, and set styles for font
            tooltipEl.style.opacity = '1';
            tooltipEl.style.position = 'absolute';
            let offsetX = position.left + window.pageXOffset + tooltipModel.caretX - 40;
            // tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            tooltipEl.style.left = offsetX + 'px';
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
            tooltipEl.style.pointerEvents = 'none';
          }
        }

      }
    });
  }

}
