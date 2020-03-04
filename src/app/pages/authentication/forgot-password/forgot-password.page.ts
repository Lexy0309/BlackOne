import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { NotifyService } from 'src/app/services/notify.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public nav: NavController, public alertCtrl: AlertController,
    private notify: NotifyService,
  ) {

  }
  validate_form: FormGroup;
  isSending = false;
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please wnter a valid email.' }
    ]
  };

  ngOnInit() {
    this.validate_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }
  async forgotPassword() {
    if (this.validate_form.valid) {
      let values = this.validate_form.value;
      this.isSending = true;
      await firebase.auth().sendPasswordResetEmail(values.email).then(res => {
        this.notify.modalMsg('Please check your email.', 'notice');
        this.isSending = false;
        this.validate_form.setValue({email: ''});
      }, err => {
        if (err.code == 'auth/user-not-found') {
          this.notify.modalMsg('It is not a registered email.', 'notice');
        } else {
          this.notify.modalMsg(err.message, 'notice');
        }
        this.isSending = false;
      });
    }
  }
  userTypingSingin(event) {
    if (event.keyCode == 13) {
      this.forgotPassword();
    }
  }
  goLogin() {
    this.nav.back();
  }
}
