import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import * as firebase from 'firebase';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { NavController } from '@ionic/angular';
import { MailService } from 'src/app/services/mail.service';

@Component({
  selector: 'app-report-abuse',
  templateUrl: './report-abuse.page.html',
  styleUrls: ['./report-abuse.page.scss'],
})
export class ReportAbusePage implements OnInit {

  report: string;
  constructor(
    private router: Router,
    private emailComposer: EmailComposer,
    private notify: NotifyService,
    private navController: NavController,
    private mailService: MailService
  ) { }

  ngOnInit() {
  }

  goSetting() {
    this.navController.back();
  }

  onConfirm() {
    if (!this.report.trim()) {
      this.notify.modalMsg('please input your thoughts');
      return;
    }
    const firstname = firebase.auth().currentUser.displayName;
    const emailStr = firebase.auth().currentUser.email;
    const email = {
      to: this.mailService.support_email,
      from: emailStr,
      subject: firstname + '\'s report',
      content: this.report,
      isHtml: true
    };
    let reqOpts;
    reqOpts = this.mailService._initializeReqOpts(reqOpts);
    reqOpts = this.mailService._addStandardHeaders(reqOpts.headers);

    this.mailService.post(this.mailService.share_a_feedback_url, email, reqOpts).subscribe(result => {
      this.report = '';
      this.notify.modalMsg(JSON.stringify(result), 'Mail');
    }, err => {
      this.notify.modalMsg(JSON.stringify(err), 'Mail Error');
    });
  }
}
