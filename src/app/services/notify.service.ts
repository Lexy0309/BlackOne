import { Injectable } from '@angular/core';
import { AlertController, ToastController, ModalController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  public toast = null;
  public loading = null;
  isLoading = false;

  public pubMsg: string = "waiting...";
  public isFileUploading: any;
  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    // public soundService: SoundsService,
    // public setting: SettingsService,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ) { }

  async toastMsg(data, duration?, position?, color?) {

    const toast = await this.toastCtrl.create({
      message: data,
      duration: duration ? duration : 2000,
      position: position ? position : 'top',
      color: color ? color : 'success'
    });
    toast.present();
  }
  async modalMsg(msg, header?) {
    console.log("modalMsg called");
    const successalert = await this.alertCtrl.create({
      header: header ? header : '',
      message: msg,
      buttons: ['ok']
    });
    await successalert.present();
  }
  async showLoading(msg?) {
    this.isLoading = true;
    var message = msg ? msg : "waiting...";
    // this.pubMsg = msg ? msg : this.pubMsg;

    return await this.loadingCtrl.create({
      message: message,
      duration: 10000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('load presenting'));
        }
      });
    });
  }

  async closeLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
}
