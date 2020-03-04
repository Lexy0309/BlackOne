import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.page.html',
  styleUrls: ['./video-modal.page.scss'],
})
export class VideoModalPage implements OnInit {
  clipSrc = "";
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.clipSrc = this.navParams.get('src');
  }
  closeModal() {
    this.modalController.dismiss();
  }

}
