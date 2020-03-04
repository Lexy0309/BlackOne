import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { NavController } from '@ionic/angular';
import { MailService } from 'src/app/services/mail.service';
import { MediaService } from 'src/app/services/media.service';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-share-news',
  templateUrl: './share-news.page.html',
  styleUrls: ['./share-news.page.scss'],
})
export class ShareNewsPage implements OnInit {
  slideOpts = {
    effect: 'flip'
  };
  newsInfo: any;
  newsType: string = '';
  myProfile: any;
  report: any;
  toEmails = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService,
    private navController: NavController,
    private mailService: MailService,
    public mediaService: MediaService,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    console.log(this.myProfile);
    this.activatedRoute.paramMap.subscribe(async params => {
      this.newsInfo = JSON.parse(params.get('newsInfo'));
      this.newsType = params.get('newsType');
    });
  }
  goBack() {
    this.navController.back();
  }
  sendShareViaEmail() {
    if (!this.toEmails.toString().trim()) {
      this.notifyService.modalMsg('please input to-email.')
      return;
    }

    this.report = {
      to: this.toEmails,
      from: this.myProfile.email,
      subject: this.myProfile.name + '\'s share',
      title: this.newsInfo.title,
      content: this.newsInfo.content,
      newsImage: this.newsInfo.newsImage,
      newsVideo: this.newsInfo.newsVideo
    };

    let reqOpts;
    reqOpts = this.mailService._initializeReqOpts(reqOpts);
    reqOpts = this.mailService._addStandardHeaders(reqOpts.headers);
    this.notifyService.showLoading();
    this.mailService.post(this.mailService.share_url, this.report, reqOpts).subscribe(result => {
      this.notifyService.closeLoading();
      this.toEmails = '';
      this.notifyService.modalMsg(JSON.stringify(result), 'Share');
      console.log(JSON.stringify(result));
    }, err => {
      this.notifyService.closeLoading();
      this.notifyService.modalMsg(JSON.stringify(err), 'Share Error');
      console.log(JSON.stringify(err));
    });
  }
}
