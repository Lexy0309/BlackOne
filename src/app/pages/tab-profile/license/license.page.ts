import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-license',
  templateUrl: './license.page.html',
  styleUrls: ['./license.page.scss'],
})
export class LicensePage implements OnInit {

  constructor(
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.navController.back();
  }
}
