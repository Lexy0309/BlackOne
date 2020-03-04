import { UserService } from './services/user.service';
import { NotifyService } from './services/notify.service';
import { Component, ViewChildren, QueryList } from '@angular/core';
import { Platform, NavController, ToastController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { SettingService } from './services/setting.service';
import { FcmService } from './services/fcm.service';
import { MediaService } from './services/media.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  constructor(
    private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar,
    private authSerice: AuthService, private navController: NavController, private translate: TranslateService,
    private fcm: FcmService, private router: Router, public toastController: ToastController,
    private mediaService: MediaService, private notifyService: NotifyService,
    private settingService: SettingService, private userService: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    let selectedLanguage = localStorage.getItem(this.settingService.KEY_DEFAULT_LANGUAGE);
    if (!selectedLanguage) {
      selectedLanguage = "en";
      localStorage.setItem(this.settingService.KEY_DEFAULT_LANGUAGE, selectedLanguage);
    }
    this.translate.setDefaultLang(selectedLanguage);
    this.translate.use(selectedLanguage);

    this.platform.ready().then(() => {
      // this.statusBar.hide();
      this.statusBar.styleDefault();
      // this.notificationSetup();
      this.registerBackButtonAction();
      // localStorage.removeItem(this.settingService.KEY_USER);

      if (this.authSerice.isLoggedIn()) {
        this.navController.navigateRoot('/tabs/tab-share');
        this.splashScreen.hide();
        this.userService.getChangedMyUserInfo();
      } else {
        if (this.authSerice.isOnBoardingState()) {
          this.navController.navigateRoot('authentication');
          this.splashScreen.hide();
        } else {
          this.navController.navigateRoot('onboarding');
          this.splashScreen.hide();
        }
      }
    });
  }

  /**
   * push notification setup
   */
  private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
        }
      });
  }
  registerBackButtonAction() {
    this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        // alert("router url:" + this.router.url);
        if (this.router.url.indexOf("add-new-share") > -1 && this.mediaService.isUploading) {
          this.notifyService.toastMsg("You cannot back, you are busy uploading.", "", "", "warning");
          return;
        }
      });
    });
  }
  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }
}
