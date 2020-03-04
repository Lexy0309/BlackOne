import { Component, OnInit, NgZone } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-photo-view-modal',
  templateUrl: './photo-view-modal.page.html',
  styleUrls: ['./photo-view-modal.page.scss'],
})
export class PhotoViewModalPage implements OnInit {

  clipSrc = "";
  isImgDidLoad = false;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private zone: NgZone,
  ) { }

  ngOnInit() {
    this.zone.run(() => {
      try {
        this.isImgDidLoad = true;
        this.clipSrc = this.navParams.get('src');
      } catch (error) {
        console.log(">>>>>>>>>>", JSON.stringify(error));
      }
    });
  }
  closeModal() {
    this.modalController.dismiss();
  }
  imgDidLoad() {
    this.isImgDidLoad = false;
  }

}
