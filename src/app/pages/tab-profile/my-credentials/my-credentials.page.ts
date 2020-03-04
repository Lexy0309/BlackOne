import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';
import { NotifyService } from 'src/app/services/notify.service';
import * as firebase from 'firebase';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-my-credentials',
  templateUrl: './my-credentials.page.html',
  styleUrls: ['./my-credentials.page.scss'],
})
export class MyCredentialsPage implements OnInit {

  myProfile: any;
  isShowEditEmail = false;
  isShowEditPassword = false;
  email = '';
  confirm_email = '';
  password = '';
  confirm_password = '';
  constructor(
    private navController: NavController,
    public settingService: SettingService,
    private userService: UserService,
    private notifyService: NotifyService,
  ) {
  }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    this.email = this.myProfile.email;
    this.confirm_email = this.myProfile.email;
  }

  goBack() {
    this.navController.back();
  }
  showEditEmail() {
    this.isShowEditEmail = true;
  }
  showEditPassword() {
    this.isShowEditPassword = true;
  }
  cancelEditEmail() {
    this.isShowEditEmail = false;
  }
  doUpdateEmail() {
    if (this.email != this.confirm_email) {
      this.notifyService.modalMsg('new email and confirm email not match.', 'Notice');
      return;
    }
    this.notifyService.showLoading();
    firebase.auth().currentUser.updateEmail(this.email).then(() => {
      this.userService.updateEmail(this.myProfile.uid, this.email).then(() => {
        this.myProfile.email = this.email;
        localStorage.setItem(this.settingService.KEY_USER, JSON.stringify(this.myProfile));
        this.isShowEditEmail = false;
        this.notifyService.closeLoading();
        this.notifyService.modalMsg('changed your email', 'Notice');
      }).catch(err => {
        this.notifyService.closeLoading();
        this.notifyService.modalMsg(err, 'Notice');
      });
    }).catch((error) => {
      this.notifyService.modalMsg(error, 'Notice');
    });
  }

  cancelEditPassword() {
    this.isShowEditPassword = false;
  }
  doUpdatePassword() {
    if (this.password != this.confirm_password) {
      this.notifyService.modalMsg('new password and confirm password not match.', 'Notice');
      return;
    }
    this.notifyService.showLoading();
    firebase.auth().currentUser.updatePassword(this.password).then(() => {
      this.isShowEditPassword = false;
      this.notifyService.closeLoading();
      this.notifyService.modalMsg('changed your password.', 'Notice');
    }).catch((err) => {
      this.notifyService.closeLoading();
      this.notifyService.modalMsg(err, 'Notice');
    })
  }
}
