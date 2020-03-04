import { Component, OnInit, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  selectedLanguage: string = "en";
  constructor(
    private navController: NavController,
    private translate: TranslateService,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.selectedLanguage = localStorage.getItem(this.settingService.KEY_DEFAULT_LANGUAGE);
    if (!this.selectedLanguage) {
      this.selectedLanguage = "en";
      localStorage.setItem(this.settingService.KEY_DEFAULT_LANGUAGE, this.selectedLanguage);
    }
  }

  goBack() {
    this.navController.back();
  }

  selectLanguage(language) {
    this.selectedLanguage = language;
    localStorage.setItem(this.settingService.KEY_DEFAULT_LANGUAGE, this.selectedLanguage);
    this.translate.setDefaultLang(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);    
  }
}
