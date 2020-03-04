import { SettingService } from 'src/app/services/setting.service';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
// import { Facebook } from '@ionic-native/facebook/ngx';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: firebase.User;
  onboardingState = new BehaviorSubject(false);
  constructor(
    private storage: Storage,
    public platform: Platform,
    // public fb: Facebook,
    private settingService: SettingService,
    private notifyService: NotifyService
  ) {
    this.platform.ready().then(() => {

    });
  }
  loginUser(credentials) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(credentials.email.toString().trim(), credentials.password.toString().trim())
        .then(
          res => resolve(res),
          err => reject(err))
    });
  }
  registerUser(credentials) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(
          res => resolve(res),
          err => reject(err))
    });
  }
  logoutUser() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
          .then(() => {
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    })
  }
  userDetails() {
    return firebase.auth().currentUser;
  }
  updateProfile(credentials) {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().currentUser.updateProfile({
          displayName: credentials.name,
          photoURL: credentials.photoURL
        }).then(() => {
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    return user !== null;
  }
  isOnBoardingState(): boolean {
    const onboarding_state = localStorage.getItem(this.settingService.KEY_ONBOARDING_STATE);
    return onboarding_state !== null;
  }

  isBannedState(): boolean {
    const myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    return myProfile.isBaned;
  }

  /**
   * Facebook Login
   */

  doFacebookLogin() {
    // return new Promise((resolve, reject) => {
    //   if (this.platform.is('cordova')) {
    //     //["public_profile"] is the array of permissions, you can add more if you need
    //     this.fb.login(["public_profile"])
    //       .then((response) => {
    //         const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
    //         this.notifyService.modalMsg(JSON.stringify(response.authResponse));
    //         firebase.auth().signInWithCredential(facebookCredential)
    //           .then(user => resolve(user));
    //       }, err => reject(err)
    //       );
    //   }
    //   else {
    //     // this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    //     firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
    //       .then(result => {
    //         this.notifyService.modalMsg(">>>>>>>>>>>>" + JSON.stringify(result));
    //         resolve(result);
    //       }, (err) => {
    //         reject(err);
    //       })
    //   }
    // })
  }
}
