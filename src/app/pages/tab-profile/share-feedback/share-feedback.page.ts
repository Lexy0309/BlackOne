import { MediaService } from 'src/app/services/media.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { NotifyService } from 'src/app/services/notify.service';
import { SettingService } from 'src/app/services/setting.service';
import { NavController } from '@ionic/angular';
import { MailService } from 'src/app/services/mail.service';

@Component({
  selector: 'app-share-feedback',
  templateUrl: './share-feedback.page.html',
  styleUrls: ['./share-feedback.page.scss'],
})
export class ShareFeedbackPage implements OnInit {
  myProfile: any;
  feedback: string;
  constructor(
    private router: Router,
    private emailComposer: EmailComposer,
    private notify: NotifyService,
    private settingService: SettingService,
    private navController: NavController,
    private mediaService: MediaService,
    private mailService: MailService,
  ) { }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
  }

  goSetting() {
    this.navController.back();
  }

  onConfirm() {
    if (!this.feedback.trim()) {
      this.notify.modalMsg('please input your thoughts');
      return;
    }
    const firstname = this.myProfile.name;
    const emailStr = this.myProfile.email;
    const email = {
      to: this.mailService.support_email,
      from: emailStr,
      subject: firstname + '\'s feedback',
      content: this.feedback
    };
    let reqOpts;
    reqOpts = this.mailService._initializeReqOpts(reqOpts);
    reqOpts = this.mailService._addStandardHeaders(reqOpts.headers);

    this.mailService.post(this.mailService.share_a_feedback_url, email, reqOpts).subscribe(result => {
      this.feedback = '';
      this.notify.modalMsg(JSON.stringify(result), 'Mail');
    }, err => {
      this.notify.modalMsg(JSON.stringify(err), 'Mail Error');
    });
  }

}
