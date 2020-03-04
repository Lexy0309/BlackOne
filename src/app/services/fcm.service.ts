import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  deviceRef: firebase.firestore.CollectionReference;
  constructor(
    private firebaseOrg: Firebase,
    private platform: Platform
  ) {
    this.deviceRef = firebase.firestore().collection("devcies")
  }
  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseOrg.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseOrg.getToken();
      await this.firebaseOrg.grantPermission();
    }

    this.saveToken(token);
  }

  private saveToken(token) {
    if (!token) return;
    const data = {
      token,
      userId: 'testUserId'
    };

    return this.deviceRef.doc(token).set(data);
  }

  onNotifications() {
    return this.firebaseOrg.onNotificationOpen();
  }

}
