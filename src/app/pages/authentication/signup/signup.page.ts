import { SettingService } from 'src/app/services/setting.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NotifyService } from 'src/app/services/notify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  passwordType: string = 'password';
  passwordShown: boolean = false;
  validate_signupform: FormGroup;
  isAuthSignin = false;
  isIosPlatform = false;
  errorMessage = '';
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

  togglePassword() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
    } else {
      this.passwordShown = true;
      this.passwordType = 'text';
    }
  }

  ngOnInit() {
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
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    });
  }
  onSingupSubmit() {
    if (this.validate_signupform.valid) {
      this.isAuthSignin = true;
      this.authService.registerUser(this.validate_signupform.value)
        .then(res => {
          const formInfo = this.validate_signupform.value;
          const newUser = {
            name: formInfo.name,
            email: formInfo.email,
            uid: res.user.uid,
            photoURL: '',
            presentation: '',
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

          this.errorMessage = '';
          this.isAuthSignin = false;
          this.navController.navigateRoot('/signup-success');
        }, err => {
          this.isAuthSignin = false;
          this.errorMessage = err.message;
          this.notifyService.modalMsg(err.message, 'notice');
          console.error(err);
        });
    }
  }
  userTypingSingin(event) {
    if (event.keyCode === 13) {
      this.onSingupSubmit();
    }
  }
  goBack() {
    this.navController.back();
  }
}
