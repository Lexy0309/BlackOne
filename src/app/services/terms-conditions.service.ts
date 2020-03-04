import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {

  termsConditionsRef: firebase.firestore.CollectionReference;
  constructor(private events: Events) {
    this.termsConditionsRef = firebase.firestore().collection('terms-conditions');
  }
  async getPrivacyPolicy() {
    const p1 = await this.termsConditionsRef.doc('privacy-policy').get();
    const [pp1] = await Promise.all([p1]);
    return pp1.data();

  }

  async getTermsConditions() {
    const t1 = this.termsConditionsRef.doc('terms-conditions').get();
    const [tt1] = await Promise.all([t1]);
    return tt1.data();
  }
  subscribePrivacyPolicy() {
    this.termsConditionsRef.doc('privacy-policy').onSnapshot((snapshot) => {
      this.events.publish('subscribe_privacy_policy', snapshot.data());
    });
  }
  subscribeTermsOfConditions() {
    this.termsConditionsRef.doc('terms-conditions').onSnapshot((snapshot) => {
      this.events.publish('subscribe_terms_conditions', snapshot.data());
    });
  }
}
