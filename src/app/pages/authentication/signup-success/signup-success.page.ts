import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.page.html',
  styleUrls: ['./signup-success.page.scss'],
})
export class SignupSuccessPage implements OnInit {

  constructor(
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  doContinue() {
    this.navController.navigateRoot('/tabs/tab-share');
  }

}
