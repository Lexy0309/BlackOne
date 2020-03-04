import { SettingService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';
import { NotifyService } from './../../../services/notify.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Events, NavController } from '@ionic/angular';

@Component({
  selector: 'app-my-network',
  templateUrl: './my-network.page.html',
  styleUrls: ['./my-network.page.scss'],
})
export class MyNetworkPage implements OnInit {

  segmentTab = 'followers';
  isLoading = false;
  followers = [];
  isLoadedFollowers = false;
  followings = [];
  isLoadedFollwoings = false;
  blankItems = ['1', '2', '3', '4'];
  actionFollow: any;

  isShowAlert = false;
  isActionFlag = 0;
  myProfile: any;
  constructor(
    private router: Router,
    public alertController: AlertController,
    private userService: UserService,
    public notifyService: NotifyService,
    public settingService: SettingService,
    private events: Events, private zone: NgZone,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    this.getFollowers();
    this.getFollowings();
    this.events.subscribe('refresh_my_network', (state) => {
      this.zone.run(() => {
        if (state == true) {
          this.getFollowers();
          // this.getFollowings();
        }
      });
    });
  }
  ionViewWillEnter() {
    console.log("ionview will enter!!!");
  }
  goBack() {
    this.navController.back();
  }

  getFollowers() {
    this.followers = [];
    this.isLoadedFollowers = false;
    this.userService.getFollowers(this.myProfile.uid).then((followers) => {
      this.followers = followers;
      this.isLoadedFollowers = true;
    }).catch(err => {
      this.isLoadedFollowers = true;
      this.notifyService.modalMsg(err, "Error");
    });
  }

  getFollowings() {
    this.followings = [];
    this.isLoadedFollwoings = false;
    this.userService.getFollowings(this.myProfile.uid).then((followings) => {
      this.followings = followings;
      this.isLoadedFollwoings = true;
    }).catch(err => {
      this.isLoadedFollwoings = true; 
      this.notifyService.modalMsg(err, "Error");
    });
  }

  viewProfile(buddy) {
    this.router.navigate(['view-profile', { buddyInfo: JSON.stringify(buddy), from: 'my-network' }]);
  }

  segmentChanged(segment) {
    this.segmentTab = segment;
    if (this.segmentTab == 'followers') {
      this.getFollowers();
    } else {
      this.getFollowings();
    }
  }

  async onBlocking(follower) {
    this.isActionFlag = 0;
    this.isShowAlert = true;
    this.actionFollow = follower;
  }

  onReject() {
    this.isShowAlert = false;
  }

  onAccept() {
    this.notifyService.showLoading();
    if (this.isActionFlag == 0) {
      this.userService.sendUnfollower(this.myProfile.uid, this.actionFollow.uid).then(() => {
        this.isShowAlert = false;
        var deleteIndex = this.followers.findIndex(x => x.userInfo.uid == this.actionFollow.uid);
        if (deleteIndex > -1) {
          this.followers.splice(deleteIndex, 1);
        }
        this.notifyService.closeLoading();
      }).catch((err) => {
        this.isShowAlert = false;
        this.notifyService.closeLoading();
        this.notifyService.modalMsg(err, "Error");
      });
    } else {
      this.userService.sendUnfollow(this.myProfile.uid, this.actionFollow.uid).then(() => {
        this.isShowAlert = false;
        var deleteIndex = this.followings.findIndex(x => x.userInfo.uid == this.actionFollow.uid);
        if (deleteIndex > -1) {
          this.followings.splice(deleteIndex, 1);
        }
        this.notifyService.closeLoading();
      }).catch((err) => {
        this.isShowAlert = false;
        this.notifyService.closeLoading();
        this.notifyService.modalMsg(err, "Error");
      })
    }
  }

  async onUnfollow(following) {
    this.isActionFlag = 1;
    this.isShowAlert = true;
    this.actionFollow = following;
  }

}
