import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { NotifyService } from 'src/app/services/notify.service';
import { SettingService } from 'src/app/services/setting.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {
  segmentTab = 'no';
  myProfile: any;
  constructor(
    private router: Router,
    private notifyService: NotifyService,
    private userServe: UserService,
    private settingService: SettingService,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
  }
  async segmentChanged(segment) {
    if (segment == 'yes') {
      this.notifyService.showLoading();
      firebase.auth().currentUser.delete().then(async () => {
        await this.userServe.deleteUserTransaction(this.myProfile.uid);
        localStorage.removeItem(this.settingService.KEY_USER);
        this.notifyService.closeLoading();
        this.navController.navigateRoot("/authentication");
      }).catch(err => {
        this.notifyService.closeLoading();
        this.notifyService.modalMsg(err, "Error");
      });
    } else {
      this.navController.back();
    }
  }
}
