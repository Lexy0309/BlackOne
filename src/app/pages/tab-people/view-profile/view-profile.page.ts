import { NewsService } from 'src/app/services/news.service';
import { NotifyService } from 'src/app/services/notify.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { NavController, Events, ActionSheetController } from '@ionic/angular';
import { MediaService } from 'src/app/services/media.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {
  defaultAvatar = this.settingService.default_avatar;
  demoPhoto = this.settingService.demo_photo;
  demoVideo = this.settingService.demo_video;
  newsList = [];

  myProfile: any;
  buddyInfo: any;
  from: any;
  buddyNews = [];
  isLoadedAllBuddyNews = false;
  blankItems = ['1', '2', '3'];
  slideOpts = {
    effect: 'flip'
  };
  isFollowing = false;
  isOwner = true;
  isPostingLike = false;
  sharing_title = 'Select sharing type';
  sharing_via_whatsapp_title = 'Sharing this via WhatsApp';
  sharing_via_email_title = 'Sharing this via email';
  cancel_text = 'Cancel';
  constructor(
    private router: Router,
    private navController: NavController,
    public settingService: SettingService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private newsService: NewsService,
    private notifyService: NotifyService,
    public mediaService: MediaService,
    public events: Events,
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
      this.buddyInfo = JSON.parse(params.get('buddyInfo'));
      this.from = params.get('from');
      this.isOwner = this.myProfile.uid == this.buddyInfo.userInfo.uid;

      this.getMyFollowersCount(this.buddyInfo.userInfo.uid);
      this.getIsFollowing(this.buddyInfo.userInfo.uid);
      this.getBuddyNews(this.buddyInfo.userInfo.uid, this.myProfile.uid);
    });
  }
  viewNewsDetails(item) {
    this.navController.navigateForward(['details', {
      newsType: item.newsInfo.newsType,
      newsId: item.id,
      timestamp: this.settingService.getDateFromModel(item.newsInfo.timestamp),
      newsInfo: JSON.stringify(item.newsInfo),
      userInfo: JSON.stringify(this.buddyInfo.userInfo),
      from: 'view-profile'
    }]);
  }
  getMyFollowersCount(buddy_uid) {
    this.userService.getFollowers(buddy_uid).then((result) => {
      this.buddyInfo.followerCount = result.length;
    });
  }

  getIsFollowing(buddy_uid) {
    this.userService.isFollowing(this.myProfile.uid, buddy_uid).then((result) => {
      this.buddyInfo.isFollow = result;
    });
  }
  getBuddyNews(buddyId, myUid) {
    this.buddyNews = [];
    this.isLoadedAllBuddyNews = false;
    this.newsService.getBuddyNewsWithId(buddyId, myUid).then((result) => {
      this.buddyNews = result;
      this.isLoadedAllBuddyNews = true;
    }).catch(err => {
      this.isLoadedAllBuddyNews = true;
      this.notifyService.modalMsg(err, 'Error');
    });
  }
  goBack() {
    // this.navController.navigateBack('tabs/tab-people');
    if (this.from == 'news') {
      this.events.publish('refresh_news', true);
    } else if (this.from == 'people') {
      this.events.publish('refresh_people', true);
    } else if (this.from == 'my-network') {
      this.events.publish('refresh_my_network', true);
    }
    this.navController.back();
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
              newsType: ''
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

  doFollow() {
    if (this.isOwner) {
      this.notifyService.toastMsg('request is not possible', '', '', 'danger');
      return;
    }
    if (this.isFollowing) { return; }
    this.buddyInfo.followerCount++;
    this.buddyInfo.isFollow = true;
    this.isFollowing = true;
    this.userService.sendFollow(this.myProfile.uid, this.buddyInfo.userInfo.uid).then(state => {
      this.isFollowing = false;
    }).catch(err => {
      this.isFollowing = false;
      this.buddyInfo.isFollow = false;
      this.buddyInfo.followerCount--;
      this.notifyService.modalMsg(err, 'Error');
    });
  }
  doUnfollow() {
    if (this.isOwner) {
      this.notifyService.toastMsg('request is not possible', '', '', 'danger');
      return;
    }
    if (this.isFollowing) { return; }
    this.buddyInfo.followerCount--;
    this.buddyInfo.isFollow = false;
    this.isFollowing = true;
    this.userService.sendUnfollow(this.myProfile.uid, this.buddyInfo.userInfo.uid).then(state => {
      this.isFollowing = false;
    }).catch(err => {
      this.isFollowing = false;
      this.buddyInfo.isFollow = true;
      this.buddyInfo.followerCount++;
      this.notifyService.modalMsg(err, 'Error');
    });
  }
  goMessage(buddy) {
    // this.router.navigate(['buddy-message']);
    this.router.navigate(['/buddy-message', { buddy: JSON.stringify(buddy.userInfo), backpage: 'view-profile', originBuddy: JSON.stringify(buddy), parentBackPage: this.from }]);
  }
  postLike(newsItem) {
    if (newsItem.uid == this.myProfile.uid) {
      this.notifyService.modalMsg('you couldn\'t like yours yourself.', 'Notice');
      return;
    }
    if (this.isPostingLike) { return; }
    newsItem.isLike = !newsItem.isLike;
    if (newsItem.isLike) {
      newsItem.newsInfo.likeCount++;
    } else {
      newsItem.newsInfo.likeCount--;
    }

    this.isPostingLike = true;
    this.newsService.postLike(newsItem.id, newsItem.isLike, this.myProfile.uid, newsItem.newsInfo.likeCount).then(() => {
      this.isPostingLike = false;
    }).catch(err => {
      this.isPostingLike = false;
      this.notifyService.toastMsg(err, '', '', 'danger');
    })
  }
}
