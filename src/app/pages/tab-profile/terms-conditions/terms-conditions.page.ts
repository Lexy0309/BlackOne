import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TermsConditionsService } from 'src/app/services/terms-conditions.service';
import { Events, NavController } from '@ionic/angular';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrls: ['./terms-conditions.page.scss'],
})
export class TermsConditionsPage implements OnInit {
  termsconditionsForm: any;
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
    this.tcService.getTermsConditions().then((tcInfo) => {
      this.notifyService.closeLoading();
      this.termsconditionsForm = tcInfo;
    }).catch((err) => {
      this.notifyService.closeLoading();
      console.error(JSON.stringify(err));
    });
    this.tcService.subscribeTermsOfConditions();
    this.events.subscribe('subscribe_terms_conditions', (tcInfo) => {
      this.zone.run(() => {
        console.log('changed tcinfo:', tcInfo);
        this.termsconditionsForm = tcInfo;
      });
    });
  }

  goSetting() {
    this.navController.back();
  }
}
