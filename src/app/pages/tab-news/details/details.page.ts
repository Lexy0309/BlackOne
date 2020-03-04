import { NewsService } from 'src/app/services/news.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { MediaService } from 'src/app/services/media.service';
import { NotifyService } from 'src/app/services/notify.service';
import { NavController, Events, ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { MailService } from 'src/app/services/mail.service';
import { firestore } from 'firebase';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  myProfile: any;
  newsType = '';
  newsId: any;
  from = '';
  timestamp: any;
  newsInfo: any;
  userInfo: any;
  newsComments = [];
  commentCount = 0;
  isLike: any = false;
  isPostingLike = false;
  isNewsOwner: boolean;
  newsTypeInfo: any;

  isShowReportDialog = false;
  isShowDeleteDialog = false;
  slideOpts = {
    effect: 'flip'
  };
  comment = '';
  warning_selected = false;
  isLoading = false;
  sharing_title = 'Select sharing type';
  sharing_via_whatsapp_title = 'Sharing this via WhatsApp';
  sharing_via_email_title = 'Sharing this via email';
  cancel_text = 'Cancel';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private navController: NavController,
    public settingService: SettingService,
    private newsService: NewsService,
    public mediaService: MediaService,
    private notifyService: NotifyService,
    private events: Events,
    private mailService: MailService,
    private actionSheetController: ActionSheetController,
    private translate: TranslateService,
  ) {
    this.translate.get('message.select_sharing_type').subscribe(result => {
      this.sharing_title = result;
    });
    this.translate.get('cancel').subscribe(result => {
      this.cancel_text = result;
    });
    this.translate.get('message.sharing_via_whatsapp').subscribe(result => {
      this.sharing_via_whatsapp_title = result;
    });
    this.translate.get('message.sharing_via_email').subscribe(result => {
      this.sharing_via_email_title = result;
    });
  }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    this.activatedRoute.paramMap.subscribe(async params => {
      this.isLoading = true;
      this.newsType = params.get('newsType');
      this.newsInfo = JSON.parse(params.get('newsInfo'));
      this.timestamp = params.get('timestamp');
      this.userInfo = JSON.parse(params.get('userInfo'));
      this.newsId = params.get('newsId');
      this.from = params.get('from');
      this.newsTypeInfo = this.settingService.getNewsTypeInfo(this.newsType);
      this.isNewsOwner = this.userInfo.uid === this.myProfile.uid;
      this.newsComments = await this.newsService.getNewsCommentsWithId(this.newsId);
      this.isLike = await this.newsService.getNewsLikeWithId(this.newsId, this.myProfile.uid);
      this.isLoading = false;
    });
  }
  goNewsList() {
    if (this.from === 'news') {
      this.events.publish('refresh_news', true);
    } else if (this.from === 'people') {
      this.events.publish('refresh_people', true);
    } else if (this.from === 'my-network') {
      this.events.publish('refresh_my_network', true);
    }
    this.navController.back();
  }
  onShowReportDialog() {
    this.warning_selected = true;
    this.isShowReportDialog = true;
  }
  onCancelReport() {
    this.isShowReportDialog = false;
  }
  onConfirmReport() {
    this.isShowReportDialog = false;
    this.notifyService.showLoading();
    const report = {
      to: this.mailService.support_email,
      from: this.myProfile.email,
      subject: this.myProfile.name + '\'s report',
      title: this.newsInfo.title,
      content: this.newsInfo.content,
      newsImage: this.newsInfo.newsImage,
      newsVideo: this.newsInfo.newsVideo
    };
    let reqOpts;
    reqOpts = this.mailService._initializeReqOpts(reqOpts);
    reqOpts = this.mailService._addStandardHeaders(reqOpts.headers);

    this.mailService.post(this.mailService.report_url, report, reqOpts).subscribe(result => {
      this.notifyService.closeLoading();
      this.notifyService.modalMsg(JSON.stringify(result), 'Report');
      console.log(JSON.stringify(result));
    }, err => {
      this.notifyService.closeLoading();
      this.notifyService.modalMsg(JSON.stringify(err), 'Report Error');
      console.log(JSON.stringify(err));
    });
  }

  onShowDeleteDialog() {
    this.isShowDeleteDialog = true;
  }
  onCancelDelete() {
    this.isShowDeleteDialog = false;
  }
  onConfirmDelete() {
    this.notifyService.showLoading();
    this.newsService.removeNewsWithId(this.newsId).then(() => {
      this.isShowDeleteDialog = false;
      this.notifyService.closeLoading();
      this.events.publish('refresh_news', true);
      this.goNewsList();
      // this.notifyService.modalMsg("removed selected news.");
    }).catch((err) => {
      this.notifyService.modalMsg(err, 'Error');
    });
  }
  async sharing(newsInfo) {
    const actionSheet = await this.actionSheetController.create({
      header: this.sharing_title,
      buttons: [
        {
          text: this.sharing_via_email_title,
          handler: () => {
            this.router.navigate(['share-news', {
              newsInfo: JSON.stringify(newsInfo),
              newsType: this.newsType
            }]);
          }
        },
        {
          text: this.sharing_via_whatsapp_title,
          handler: () => {
            this.mediaService.shareViaWhatsApp(newsInfo);
          }
        },
        {
          text: this.cancel_text,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }


  isCommentable(newsType) {
    if (newsType == this.settingService.KEY_NEWS_TYPE_BUSINESS) {
      return this.myProfile.expert.isBusiness;
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_LADY) {
      return this.myProfile.expert.isLady;
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_AGROECOLOGY) {
      return this.myProfile.expert.isAgroecology;
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_CULTURE) {
      return this.myProfile.expert.isCulture;
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_KIDS) {
      return this.myProfile.expert.isKids;
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_SCIENCES) {
      return this.myProfile.expert.isSciences;
    }
  }
  postComment() {
    if (this.authService.isBannedState()) {
      this.notifyService.modalMsg('you cannot post any news. banned by the administrator.');
      return;
    }
    if (!this.comment.trim()) { return; }
    if (!this.isCommentable(this.newsType)) {
      this.notifyService.modalMsg('you need to be an expert to be able to comment this');
      return;
    }
    this.notifyService.showLoading();
    let data = {
      uid: this.myProfile.uid,
      comment: this.comment
    }
    this.newsService.postComment(this.newsId,  this.newsComments.length, data).then(() => {
      this.newsComments.reverse();
      this.newsComments.push({
        commentInfo: {
          comment: this.comment,
          timestamp: this.settingService.toModel(new Date())
        },
        userInfo: this.myProfile
      });
      this.newsComments.reverse();
      this.comment = '';
      this.notifyService.closeLoading();
    }).catch((err) => {
      this.notifyService.closeLoading();
      this.notifyService.modalMsg(err, 'Error');
    });
  }
  postLike() {
    if (this.isNewsOwner) {
      this.notifyService.modalMsg('you couldn\'t like yours yourself.', 'Notice');
      return;
    }
    if (this.isPostingLike) { return; }
    this.isLike = !this.isLike;
    if (this.isLike) {
      this.newsInfo.likeCount++;
    } else {
      this.newsInfo.likeCount--;
    }

    this.isPostingLike = true;
    this.newsService.postLike(this.newsId, this.isLike, this.myProfile.uid, this.newsInfo.likeCount).then(() => {
      this.isPostingLike = false;
    }).catch(err => {
      this.isPostingLike = false;
      this.notifyService.toastMsg(err, '', '', 'danger');
    })
  }
}
