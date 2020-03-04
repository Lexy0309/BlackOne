import { ActionSheetController, Events, NavController, Platform } from '@ionic/angular';
import { MediaService } from 'src/app/services/media.service';
import { NewsService } from 'src/app/services/news.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { NotifyService } from 'src/app/services/notify.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { MailService } from 'src/app/services/mail.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab-news',
  templateUrl: './tab-news.page.html',
  styleUrls: ['./tab-news.page.scss'],
})
export class TabNewsPage implements OnInit {
  newsType: string = this.settingService.KEY_NEWS_TYPE_BUSINESS;
  newsTypeInfo: any;
  selectedTab: string = this.settingService.KEY_TYPE_EXPERTS;
  myProfile: any;
  slideOpts = {
    effect: 'flip'
  };
  isLoadedAllNews = false;
  allNews = [];
  blankItems = ['1', '2', '3', '4'];
  demoVideo = this.settingService.demo_video;
  clipSrc = '';
  isPostingLike = false;
  sharing_title = 'Select sharing type';
  sharing_via_whatsapp_title = 'Sharing this via WhatsApp';
  sharing_via_email_title = 'Sharing this via email';
  cancel_text = 'Cancel';
  constructor(
    public settingService: SettingService,
    public mediaService: MediaService,
    public mailService: MailService,
    private router: Router,
    private navController: NavController,
    private notifyService: NotifyService,
    private newsService: NewsService,
    private actionSheetController: ActionSheetController,
    private events: Events, private zone: NgZone,
    private platform: Platform,
    private photoViewer: PhotoViewer,
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
    this.events.subscribe('refresh_news', (state) => {
      this.zone.run(() => {
        if (state == true) {
          this.getAllNewsWithType(this.newsType, this.selectedTab, this.myProfile.uid);
        }
      });
    });
  }
  ionViewWillEnter() {
    this.newsTypeInfo = this.settingService.getNewsTypeInfo(this.newsType);
    this.getAllNewsWithType(this.newsType, this.selectedTab, this.myProfile.uid);
  }
  getAllNewsWithType(newsType, selectedTab, uid) {
    this.allNews = [];
    this.isLoadedAllNews = false;
    this.newsService.getAllNewsWithType(newsType, selectedTab === this.settingService.KEY_TYPE_EXPERTS, uid).then(allNews => {
      this.allNews = allNews;
      this.isLoadedAllNews = true;
    }).catch(err => {
      this.isLoadedAllNews = true;
      this.notifyService.modalMsg(err, 'Error');
    });
  }
  doRefresh(event) {
    let lasttimestamp = this.settingService.toModel(new Date());
    if (this.allNews.length) {
      lasttimestamp = this.allNews[0].newsInfo.timestamp;
    }
    this.newsService.getLatestNewsWithType(this.newsType, this.selectedTab === this.settingService.KEY_TYPE_EXPERTS, this.myProfile.uid, lasttimestamp).then((result: []) => {
      const latestNews = result;
      this.allNews.reverse();
      latestNews.reverse();
      latestNews.forEach(article => {
        this.allNews.push(article);
      });
      this.allNews.reverse();
      setTimeout(() => {
        event.target.complete();
      }, 500);
    }).catch((err) => {
      event.target.complete();
    });
  }
  loadPreviousData(event) {
    let lasttimestamp = this.settingService.toModel(new Date());
    if (this.allNews.length) {
      // lasttimestamp = this.allNews[0].newsInfo.timestamp;
      lasttimestamp = this.allNews[this.allNews.length - 1].newsInfo.timestamp;
    }
    this.newsService.getPreviewNewsWithType(this.newsType, this.selectedTab === this.settingService.KEY_TYPE_EXPERTS, this.myProfile.uid, lasttimestamp).then((result) => {
      const oldNews = result;
      oldNews.forEach(article => {
        this.allNews.push(article);
      });
      setTimeout(() => {
        event.target.complete();
      }, 500);
    }).catch((err) => {
      event.target.complete();
    });

  }

  showImage(url) {
    var options = {
      // share: true, // default is false
      closeButton: true, // iOS only: default is true
      copyToReference: true // iOS only: default is false
    };
    if (this.platform.is("ios")) {
      url = decodeURIComponent(url);
    }
    console.log("url:", url);
    // this.photoViewer.show(url, "image viewer", options);
    this.photoViewer.show(url, "image viewer", options);
  }

  async sharing(newsItem) {
    const actionSheet = await this.actionSheetController.create({
      header: this.sharing_title,
      buttons: [
        {
          text: this.sharing_via_email_title,
          handler: () => {
            this.router.navigate(['share-news', {
              newsInfo: JSON.stringify(newsItem.newsInfo),
              newsType: this.newsType
            }]);
          }
        },
        {
          text: this.sharing_via_whatsapp_title,
          handler: () => {
            this.mediaService.shareViaWhatsApp(newsItem);
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

  onSegmentTab(selTab) {
    this.selectedTab = selTab;
    this.getAllNewsWithType(this.newsType, this.selectedTab, this.myProfile.uid);
  }
  onChangeNewsType(newsType) {
    this.newsType = newsType;
    this.getAllNewsWithType(this.newsType, this.selectedTab, this.myProfile.uid);
  }
  viewProfileInfo(buddy) {
    this.navController.navigateForward(['view-profile', { buddyInfo: JSON.stringify(buddy), from: 'news' }]);
  }
  viewNewsDetails(item) {
    console.log(typeof item.newsInfo.timestamp);
    this.navController.navigateForward(['details', {
      newsType: this.newsType,
      newsId: item.id,
      timestamp: this.settingService.getDateFromModel(item.newsInfo.timestamp),
      newsInfo: JSON.stringify(item.newsInfo),
      userInfo: JSON.stringify(item.userInfo),
      from: 'news'
    }]);
  }
  goAddNewShare() {
    this.navController.navigateForward(['add-new-share', {
      newsType: this.newsType,
      selectedTab: this.selectedTab,
      fromPage: 'tab-news'
    }]);
  }
  postLike(newsItem) {
    if (newsItem.userInfo.uid == this.myProfile.uid) {
      this.notifyService.modalMsg('you couldn\'t like yours yourself.', 'Notice');
      return;
    }
    if (this.isPostingLike) { return; }
    newsItem.isLike = !newsItem.isLike;
    // this.isLike = !this.isLike;
    if (newsItem.isLike) {
      newsItem.newsInfo.likeCount++;
    }
    else {
      newsItem.newsInfo.likeCount--;
    }

    this.isPostingLike = true;
    this.newsService.postLike(newsItem.id, newsItem.isLike, this.myProfile.uid, newsItem.newsInfo.likeCount).then(() => {
      this.isPostingLike = false;
    }).catch(err => {
      this.isPostingLike = false;
      this.notifyService.toastMsg(err, '', '', 'danger');
    });
  }
}
