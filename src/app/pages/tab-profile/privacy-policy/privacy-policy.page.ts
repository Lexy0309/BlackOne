import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TermsConditionsService } from 'src/app/services/terms-conditions.service';
import { Events, NavController } from '@ionic/angular';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  privacyPolicyForm: any;
  constructor(
    private router: Router,
    private tcService: TermsConditionsService,
    private events: Events,
    private zone: NgZone,
    private navController: NavController,
    private notifyService: NotifyService,
  ) { }

  ngOnInit() {
    this.notifyService.showLoading();
    this.tcService.getPrivacyPolicy().then((tcInfo) => {
      this.privacyPolicyForm = tcInfo;
      this.notifyService.closeLoading();
      console.log(this.privacyPolicyForm);
    }).catch((err) => {
      this.notifyService.closeLoading();
      console.error(JSON.stringify(err));
    });
    this.tcService.subscribePrivacyPolicy();
    this.events.subscribe('subscribe_privacy_policy', (tcInfo) => {
      this.zone.run(() => {
        console.log('changed tcinfo:', tcInfo);
        this.privacyPolicyForm = tcInfo;
      });
    });
  }

  goSetting() {
    this.navController.back();
  }
}
