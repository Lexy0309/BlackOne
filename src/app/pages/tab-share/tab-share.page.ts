import { SettingService } from './../../services/setting.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-tab-share',
  templateUrl: './tab-share.page.html',
  styleUrls: ['./tab-share.page.scss'],
})
export class TabSharePage implements OnInit {
  myProfile: any;
  constructor(
    private router: Router, private events: Events, private zone: NgZone,
    private authService: AuthService,
    private settingService: SettingService,
    private notifyService: NotifyService,
  ) { }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
  }
  goAddNewShare(newsType) {
    if (this.authService.isBannedState()) {
      this.notifyService.modalMsg('you cannot post any news. banned by the administrator.');
      return;
    }
    this.router.navigate(['add-new-share', {
      newsType: newsType,
      selectedTab: "experts",
      fromPage: "tab-share"
    }]);
  }
}
