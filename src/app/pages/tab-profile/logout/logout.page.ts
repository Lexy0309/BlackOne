import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  segmentTab = 'no';
  constructor(
    private router: Router,
    private navController: NavController,
    private authService: AuthService,
    private settingService: SettingService,
  ) { }

  ngOnInit() {
  }


  async segmentChanged(segment) {
    this.segmentTab = segment;
    if (this.segmentTab == 'yes') {
      await this.authService.logoutUser();
      localStorage.removeItem(this.settingService.KEY_USER);
      this.navController.navigateRoot('authentication');
    } else {
      this.navController.back();
    }
  }
}
