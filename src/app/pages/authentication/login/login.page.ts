import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, Platform } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { SettingService } from 'src/app/services/setting.service';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validate_signinform: FormGroup;
  isAuthSignin = false;
  isIosPlatform = false;
  errorMessage = '';
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please wnter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
  };

  constructor(
    public formBuilder: FormBuilder,
    public keyboard: Keyboard,
    private authService: AuthService,
    public navController: NavController,
    private userService: UserService,
    private settingService: SettingService,
    private notifyService: NotifyService,
    private platform: Platform,
  ) {
    if (this.platform.is('ios')) { this.isIosPlatform = true; }
  }

  ngOnInit() {
    this.validate_signinform = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    });
  }
  onSinginSubmit() {
    if (this.validate_signinform.valid) {
      this.isAuthSignin = true;
      this.authService.loginUser(this.validate_signinform.value)
        .then(res => {
          this.userService.getUserInfoWithId(res.user.uid).then((userinfo) => {
            localStorage.setItem(this.settingService.KEY_USER, JSON.stringify(userinfo));
            this.errorMessage = '';
            this.isAuthSignin = false;
            this.navController.navigateRoot('/tabs/tab-share');
          }).catch(err => {
            console.error(err.message);
          });
        }, err => {
          this.isAuthSignin = false;
          this.errorMessage = err.message;
          this.notifyService.modalMsg(err.message, 'notice');
        });
    }
  }
  userTypingSingin(event) {
    if (event.keyCode === 13) {
      this.onSinginSubmit();
    }
  }
  goForgotPassword() {
    this.navController.navigateForward('forgot-password');
  }
  goBack() {
    this.navController.back();
  }
}
