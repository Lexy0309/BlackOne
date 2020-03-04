import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.page.html',
  styleUrls: ['./tab-profile.page.scss'],
})
export class TabProfilePage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goMyProfile() {
    this.router.navigate(['my-profile']);
  }
  goMyNetwork() {
    this.router.navigate(['my-network']);
  }
  goMyCredentials() {
    this.router.navigate(['my-credentials']);
  }
  goLanguage() {
    this.router.navigate(['language']);
  }
  goShareFeedback() {
    this.router.navigate(['share-feedback']);
  }
  goReportAbuse() {
    this.router.navigate(['report-abuse']);
  }
  goDeleteAccount() {
    this.router.navigate(['delete-account']);
  }
  goTermsConditions() {
    this.router.navigate(['terms-conditions']);
  }
  goPrivacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }
  goAboutus() {
    this.router.navigate(['about-us']);
  }
  goLicense() {
    // this.router.navigate(['tabs/tab-profile/license']);
  }
  goLogout() {
    this.router.navigate(['logout']);
  }

}
