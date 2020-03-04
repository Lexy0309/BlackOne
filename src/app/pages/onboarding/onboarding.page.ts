import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  slide_opts = {
    initialSlide: 0,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets'
    }
  }
  selectedLanguage = 'en';
  dot_img = '../../../assets/icon/onboarding/dot3.png';
  slideData = [
    {
      img: '../../../assets/icon/onboarding/onboarding_img1_',
      description: 'Achieve your Goals'
    },
    {
      img: '../../../assets/icon/onboarding/onboarding_img2_',
      description: 'Rethink Equality'
    },
    {
      img: '../../../assets/icon/onboarding/onboarding_img3_',
      description: 'Respect Nature'
    },
    {
      img: '../../../assets/icon/onboarding/onboarding_img4_',
      description: 'Strengthen your Knowledge'
    },
    {
      img: '../../../assets/icon/onboarding/onboarding_img5_',
      description: 'Accompany the Future'
    },
    {
      img: '../../../assets/icon/onboarding/onboarding_img6_',
      description: 'Rediscover the World'
    },
  ];
  constructor(
    private navController: NavController,
    private authService: AuthService,
    private settingService: SettingService,
  ) {
    this.selectedLanguage = localStorage.getItem(this.settingService.KEY_DEFAULT_LANGUAGE);
   }

  ngOnInit() {
  }

  skip() {
    this.navController.navigateRoot('authentication');
  }
  next() {
    this.slides.getActiveIndex().then(index => {
      if (index == 5) {
        localStorage.setItem(this.settingService.KEY_ONBOARDING_STATE, 'true');
        this.skip();
      } else {
        this.slides.slideNext();
      }
    })
  }

}
