import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-report-news',
  templateUrl: './report-news.page.html',
  styleUrls: ['./report-news.page.scss'],
})
export class ReportNewsPage implements OnInit {
  report: any;
  newsType: string = '';
  myProfile: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    console.log(this.myProfile);
    this.activatedRoute.paramMap.subscribe(async params => {
      this.report = params.get('report');
      this.newsType = params.get('newsType');
      console.log("report:", this.report);
    });
  }
  goBack() {
    this.navController.back();
  }


}
