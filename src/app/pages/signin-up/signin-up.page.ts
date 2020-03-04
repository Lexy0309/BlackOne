import { SettingService } from 'src/app/services/setting.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-signin-up',
  templateUrl: './signin-up.page.html',
  styleUrls: ['./signin-up.page.scss']
})
export class SigninUpPage implements OnInit {
  validate_signinform: FormGroup;
  validate_signupform: FormGroup;
  segmentBtn = 'signin';
  isAuthSignin = false;
  errorMessage = "";

  constructor(
    public formBuilder: FormBuilder,
    public keyboard: Keyboard,
    private authService: AuthService,
    public navController: NavController,
    private userService: UserService,
    private settingService: SettingService,
    private notifyService: NotifyService,
  ) { }

  ngOnInit() {
    this.validate_signinform = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    });
    this.validate_signupform = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    });
  }
  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please wnter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' },
      // { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
  };
  onSegmentBtn(activeBtn) {
    this.segmentBtn = activeBtn;
    this.validate_signinform.clearValidators();
    this.validate_signupform.clearValidators();
  }
  onSinginSubmit() {
    if (this.validate_signinform.valid) {
      this.isAuthSignin = true;
      this.authService.loginUser(this.validate_signinform.value)
        .then(res => {
          this.userService.getUserInfoWithId(res.user.uid).then((userinfo) => {
            localStorage.setItem(this.settingService.KEY_USER, JSON.stringify(userinfo));
            this.errorMessage = "";
            this.isAuthSignin = false;
            this.navController.navigateRoot('/tabs/tab-share');
          }).catch(err => {
            console.error(err.message);
          });
        }, err => {
          this.isAuthSignin = false;
          this.errorMessage = err.message;
          this.notifyService.modalMsg(err.message, "notice");
        });
    }
  }
  onSingupSubmit() {
    if (this.validate_signupform.valid) {
      this.isAuthSignin = true;
      this.authService.registerUser(this.validate_signupform.value)
        .then(res => {
          let formInfo = this.validate_signupform.value;
          let newUser = {
            name: formInfo.name,
            email: formInfo.email,
            uid: res.user.uid,
            photoURL: "",
            presentation: "",
            expert: {
              isBusiness: true,
              isLady: false,
              isAgroecology: false,
              isCulture: false,
              isKids: false,
              isSciences: false
            },
            isBaned: false
          }
          this.authService.updateProfile(newUser);
          localStorage.setItem(this.settingService.KEY_USER, JSON.stringify(newUser));
          this.userService.addNewUser(newUser);

          this.errorMessage = "";
          this.isAuthSignin = false;
          this.navController.navigateRoot('/signup-success');
        }, err => {
          this.isAuthSignin = false;
          this.errorMessage = err.message;
          this.notifyService.modalMsg(err.message, "notice");
          console.error(err);
        });
    }
  }
  userTypingSingin(event) {
    if (event.keyCode == 13) {
      this.onSinginSubmit();
    }
  }
  goForgotPassword() {
    this.navController.navigateForward('forgot-password');
  }
  onContinue() {
    if (this.segmentBtn == 'signin') {
      this.navController.navigateRoot('tabs/tab-news');
    } else {
      this.navController.navigateRoot('signup-success');
    }
  }

  /**
   * FB Login
   */
  doFBLogin() {
    // this.authService.doFacebookLogin().then((result) => {

    //   console.log("browser fb login result:", JSON.stringify(result));
    // }).catch(err => {

    //   console.log("browser fb login err:", JSON.stringify(err));
    // })
  }
}
