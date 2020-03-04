import { SettingService } from 'src/app/services/setting.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userRef: firebase.firestore.CollectionReference;
  newsRef: firebase.firestore.CollectionReference;
  myUserInfo: any;
  constructor(
    private settingService: SettingService,
    public events: Events,
  ) {
    this.userRef = firebase.firestore().collection("user");
    this.newsRef = firebase.firestore().collection("news");
    this.myUserInfo = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
  }

  /**
   * add new user
   */
  addNewUser(newUser: any) {
    return new Promise((resolve, reject) => {
      this.userRef.doc(newUser.uid).set(newUser).then(() => {
        resolve();
      }).catch((error) => {
        console.error(error);
        reject();
      });
    });
  }

  async deleteUserTransaction(uid) {
    // remove comments, likes of news
    const n1 = await this.newsRef.where("uid", "==", uid).get();
    // remove following and followers
    const f1 = await this.userRef.doc(uid).collection("followers").get();
    const f2 = await this.userRef.doc(uid).collection("following").get();
    // remove all messages
    const m1 = await firebase.firestore().collection("messages").doc(uid).collection("buddymessages").get();
    const [nn1, ff1, ff2, mm2] = await Promise.all([n1, f1, f2, m1]);
    await nn1.docs.map(async (snapshot) => {
      const n2 = await snapshot.ref.collection("comments").get();
      const n3 = await snapshot.ref.collection("likes").get();
      const [nn2, nn3] = await Promise.all([n2, n3]);
      snapshot.ref.delete();
      await nn2.docs.map(async (commentSnapshot) => { await commentSnapshot.ref.delete(); });
      await nn3.docs.map(async (likeSnapshot) => { await likeSnapshot.ref.delete(); });
    });
    await ff1.docs.map(async (snapshot) => { await snapshot.ref.delete(); });
    await ff2.docs.map(async (snapshot) => { await snapshot.ref.delete(); });
    await this.userRef.doc(uid).delete();
  }
  /**
   * get User information with uid
   */
  getUserInfoWithId(uid: any) {
    return new Promise((resolve, reject) => {
      this.userRef.doc(uid).get().then((snapshot) => {
        resolve(snapshot.data());
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // get online state of buddy.
  getOnlineStateOfBuddy(buddy_uid) {
    this.userRef.doc(buddy_uid).onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const onlinestate = snapshot.data() ? snapshot.data().onlinestate : false;
        this.events.publish('buudy_onlinestate', onlinestate);
      }
    });
  }

  async saveMyOnlineState(state, my_uid, buddy_uid) {
    const u1 = await this.userRef.doc(my_uid).set({ onlinestate: state }, { merge: true });
    // unread message count set 0    
    // if (state) {
    //   const u2 = await this.userRef.doc(my_uid).collection("last_messages").doc(buddy_uid).set({
    //     newMessage: false
    //   }, { merge: true });
    //   let [uu2] = await Promise.all([u2]);
    // }
    const [uu1] = await Promise.all([u1]);
    return true;
  }
  /**
   * update user's presentation
   */
  updatePresentation(data: any) {
    return new Promise((resolve, reject) => {
      this.userRef.doc(data.uid).set({
        presentation: data.presentation
      }, { merge: true }).then((snapshot) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  updatePhotoURL(data: any) {
    return new Promise((resolve, reject) => {
      this.userRef.doc(data.uid).set({
        photoURL: data.photoURL
      }, { merge: true }).then((snapshot) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  updateEmail(uid, email) {
    return new Promise((resolve, reject) => {
      this.userRef.doc(uid).set({
        email: email
      }, { merge: true }).then((snapshot) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async getDirectionExperts(newsType, uid) {
    const experts = [];
    let u1;
    if (newsType == this.settingService.KEY_NEWS_TYPE_BUSINESS) {
      u1 = await this.userRef.where('expert.isBusiness', '==', true).get();
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_LADY) {
      u1 = await this.userRef.where('expert.isLady', '==', true).get();
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_AGROECOLOGY) {
      u1 = await this.userRef.where('expert.isAgroecology', '==', true).get();
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_CULTURE) {
      u1 = await this.userRef.where('expert.isCulture', '==', true).get();
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_KIDS) {
      u1 = await this.userRef.where('expert.isKids', '==', true).get();
    } else if (newsType == this.settingService.KEY_NEWS_TYPE_SCIENCES) {
      u1 = await this.userRef.where('expert.isSciences', '==', true).get();
    }
    const [uu1] = await Promise.all([u1]);
    return Promise.all(uu1.docs.map(async snapshot => {
      if (snapshot.data().uid != uid) {
        // check follow or not
        const f0 = await this.userRef.doc(snapshot.data().uid).collection("followers").get();
        const f1 = await this.userRef.doc(uid).collection("following").doc(snapshot.data().uid).get();
        const [ff0, ff1] = await Promise.all([f0, f1]);
        await experts.push({
          userInfo: snapshot.data(),
          followerCount: ff0.size,
          isFollow: ff1.exists
        });
      }
    })).then(() => {
      return Promise.resolve(experts);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  async getFollowers(uid) {
    const followers = [];
    const f1 = await this.userRef.doc(uid).collection("followers").get();
    const [ff1] = await Promise.all([f1]);
    return Promise.all(ff1.docs.map(async snapshot => {
      const u1 = await this.userRef.doc(snapshot.id).get();
      const [uu1] = await Promise.all([u1]);
      // check follow or not
      const f0 = await this.userRef.doc(uu1.id).collection("followers").get();
      const f1 = await this.userRef.doc(uid).collection("following").doc(uu1.id).get();
      const [ff0, ff1] = await Promise.all([f0, f1]);
      followers.push({
        userInfo: uu1.data(),
        followerCount: ff0.size,
        isFollow: ff1.exists
      });
    })).then(() => {
      return Promise.resolve(followers);
    }).catch(err => {
      return Promise.reject(err);
    })
  }

  async isFollowing(uid, buddy_uid) {
    const f1 = await this.userRef.doc(uid).collection("following").doc(buddy_uid).get();
    const [ff1] = await Promise.all([f1]);
    return ff1.exists;
  }

  async getFollowings(uid) {
    const followings = [];
    const f1 = await this.userRef.doc(uid).collection("following").get();
    const [ff1] = await Promise.all([f1]);
    return Promise.all(ff1.docs.map(async snapshot => {
      const u1 = await this.userRef.doc(snapshot.id).get();
      const [uu1] = await Promise.all([u1]);
      // check follow or not
      const f0 = await this.userRef.doc(uu1.id).collection("followers").get();
      const f1 = await this.isFollowing(uid, uu1.id);
      // const f1 = await this.userRef.doc(uid).collection("following").doc(uu1.id).get();
      const [ff0, ff1] = await Promise.all([f0, f1]);
      followings.push({
        userInfo: uu1.data(),
        followerCount: ff0.size,
        isFollow: f1
      });
    })).then(() => {
      return Promise.resolve(followings);
    }).catch(err => {
      return Promise.reject(err);
    })
  }
  async sendUnfollower(myuid, buddyuid) {
    const t1 = await this.userRef.doc(buddyuid).collection("following").doc(myuid).delete();
    const t2 = await this.userRef.doc(myuid).collection("followers").doc(buddyuid).delete();
    return await Promise.all([t1, t2]).then(() => {
      return Promise.resolve(true);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
  async sendFollow(myuid, buddyuid) {
    const t1 = await this.userRef.doc(myuid).collection("following").doc(buddyuid).set({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    const t2 = await this.userRef.doc(buddyuid).collection("followers").doc(myuid).set({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });

    return await Promise.all([t1, t2]).then(() => {
      return Promise.resolve(true);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
  async sendUnfollow(myuid, buddyuid) {
    const t1 = await this.userRef.doc(myuid).collection("following").doc(buddyuid).delete();
    const t2 = await this.userRef.doc(buddyuid).collection("followers").doc(myuid).delete();

    return await Promise.all([t1, t2]).then(() => {
      return Promise.resolve(true);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  async getBuddyList(uid) {
    const buddylist = [];
    const u1 = await this.userRef.get();
    const [uu1] = await Promise.all([u1]);
    return Promise.all(uu1.docs.map(async (snapshot) => {
      if (snapshot.id !== uid) {
        buddylist.push(snapshot.data());
      }
    })).then(() => {
      return Promise.resolve(buddylist);
    }).catch((err) => {
      return Promise.reject(err);
    })
  }

  updateBuddyInfo(uid) {
    this.userRef.doc(uid).collection('last_messages').onSnapshot((snapshots) => {
      const buddyLastMessages = [];
      snapshots.docs.map(snapshot => {
        buddyLastMessages.push({
          buddy_uid: snapshot.id,
          lastmessage_info: snapshot.data()
        })
      })
      this.events.publish('subscribe_lastmessages', buddyLastMessages);
    });
  }

  getChangedMyUserInfo() {
    if (this.myUserInfo.uid) {
      const uid = this.myUserInfo.uid;
      this.userRef.doc(uid).onSnapshot((snapshot) => {
        console.log("My User info changed.");        
        localStorage.setItem(this.settingService.KEY_USER, JSON.stringify(snapshot.data()));
        this.events.publish('subscribe_myuser_info', snapshot.data());
      });
    }
  }
}
