import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private navController: NavController
  ) { }

  ngOnInit() {
  }
  /**
    * FB Login
    */
  doFBLogin() {
    // this.authService.doFacebookLogin().then((result) => {
    //   console.log("browser fb login result:", JSON.stringify(result));
    // }).catch(err => {
    //   console.log("browser fb login err:", JSON.stringify(err));
    // });
  }
  goLoginPage() {
    this.router.navigate(['login']);
  }
  goSignupPage() {
    this.router.navigate(['signup']);
  }
}
