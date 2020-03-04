import { NavController, Events } from '@ionic/angular';
import { NotifyService } from 'src/app/services/notify.service';
import { UserService } from 'src/app/services/user.service';
import { SettingService } from 'src/app/services/setting.service';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-people',
  templateUrl: './tab-people.page.html',
  styleUrls: ['./tab-people.page.scss'],
})
export class TabPeoplePage implements OnInit, OnDestroy {
  slideOpts = {
    effect: 'flip',
    slidesPerView: 2,
    loop: true,
    loopedSlides: 10,
    loopAdditionalSlides: 1,
    // centeredSlides: true,
  };
  myProfile: any;
  experts = [];
  isLoadedAllExperts = false;
  blankItems = ['1', '2', '3'];
  newsType: string = this.settingService.KEY_NEWS_TYPE_BUSINESS;
  defaultAvatar = this.settingService.default_avatar;
  constructor(
    public settingService: SettingService,
    private router: Router,
    private userService: UserService,
    private notifyService: NotifyService,
    private navController: NavController,
    private events: Events, private zone: NgZone,
  ) { }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    this.events.subscribe('refresh_people', (state) => {
      this.zone.run(() => {
        if (state == true) {
          this.getDirectionExperts(this.newsType, this.myProfile.uid);
        }
      });
    });
  }
  slideTab(event) {
    console.log("slide tab!!!", JSON.stringify(event));
  }

  ionViewWillEnter() {
    this.getDirectionExperts(this.newsType, this.myProfile.uid);
  }
  ngOnDestroy() {
  }
  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }

  onChangeNewsType(newsType) {
    this.newsType = newsType;
    this.getDirectionExperts(this.newsType, this.myProfile.uid);
    // this.getAllNewsWithType(this.newsType, this.newsType, this.myProfile.uid);
  }

  getDirectionExperts(newsType, uid) {
    this.experts = [];
    this.isLoadedAllExperts = false;
    this.userService.getDirectionExperts(newsType, uid).then((result) => {
      this.experts = result;
      this.isLoadedAllExperts = true;
    }).catch(err => {
      this.isLoadedAllExperts = true;
      this.notifyService.modalMsg(err, "Error");
    })
  }
  viewProfileInfo(buddy) {
    console.log("buddy info:", buddy);
    // this.navController.navigateForward(['view-profile', { buddyInfo: JSON.stringify(buddy), from: 'people' }]);
    this.router.navigate(['view-profile', { buddyInfo: JSON.stringify(buddy), from: 'people' }]);
  }
  doFollow(buddy) {
    if (!this.isFollowable(buddy.userInfo.uid)) {
      this.notifyService.modalMsg("Follow is not possible.");
      return;
    }
    buddy.isFollow = true;
    buddy.followerCount++;
    this.userService.sendFollow(this.myProfile.uid, buddy.userInfo.uid).then(() => {

    }).catch((err) => {
      buddy.isFollow = false;
      buddy.followerCount--;
      this.notifyService.modalMsg(err, "Error");
    })
  }
  isFollowable(uid) {
    if (uid == this.myProfile.uid) {
      return false;
    }
    return true;
  }
}
