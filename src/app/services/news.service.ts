import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { resolve } from 'path';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  newsRef: firebase.firestore.CollectionReference;
  userRef: firebase.firestore.CollectionReference;
  constructor() {
    this.newsRef = firebase.firestore().collection('news');
    this.userRef = firebase.firestore().collection('user');
  }

  /**
   * add a news
   * @param news
   */
  addNews(news) {
    return new Promise((resolve, reject) => {
      this.newsRef.add(news).then(() => {
        resolve();
      }).catch((error) => {
        console.error(error);
        reject();
      });
    });
  }

  /**
   * get latest News with newstype and isExperts
   * @param newsType
   * @param isExpert
   * @param uid
   */
  async getLatestNewsWithType(newsType, isExpert, uid, lasttimestamp) {
    const allNews = [];
    const n1 = await this.newsRef.orderBy('timestamp', 'desc').where('newsType', '==', newsType).where('isExpert', '==', isExpert).where('timestamp', '>', lasttimestamp).limit(10).get();
    const [nn1] = await Promise.all([n1]);
    return Promise.all(nn1.docs.map(async newsSnapshot => {
      const u1 = await this.userRef.doc(newsSnapshot.data().uid).get();
      const l1 = await newsSnapshot.ref.collection('likes').doc(uid).get();
      const [uu1, ll1] = await Promise.all([u1, l1]);

      // check follow or not
      const f0 = await this.userRef.doc(uu1.id).collection('followers').get();
      const f1 = await this.userRef.doc(uid).collection('following').doc(uu1.id).get();
      const [ff0, ff1] = await Promise.all([f0, f1]);
      if (uu1.exists) {
        allNews.push({
          id: newsSnapshot.id,
          uid: uu1.id,
          userInfo: uu1.data(),
          followerCount: ff0.size,
          isFollow: ff1.exists,
          isLike: ll1.exists,
          newsInfo: newsSnapshot.data()
        });
      }
    })).then(() => {
      // allNews.sort((first, second) => {
      //   if (first.newsInfo.timestamp > second.newsInfo.timestamp) return -1;
      //   if (first.newsInfo.timestamp < second.newsInfo.timestamp) return 1;
      //   return 0
      // });
      return Promise.resolve(allNews);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }
  /**
   * get latest News with newstype and isExperts
   * @param newsType
   * @param isExpert
   * @param uid
   */
  async getPreviewNewsWithType(newsType, isExpert, uid, lasttimestamp) {
    const allNews = [];
    const n1 = await this.newsRef.orderBy('timestamp', 'desc').where('newsType', '==', newsType).where('isExpert', '==', isExpert).where('timestamp', '<', lasttimestamp).limit(10).get();
    const [nn1] = await Promise.all([n1]);
    return Promise.all(nn1.docs.map(async newsSnapshot => {
      const u1 = await this.userRef.doc(newsSnapshot.data().uid).get();
      const l1 = await newsSnapshot.ref.collection('likes').doc(uid).get();
      const [uu1, ll1] = await Promise.all([u1, l1]);

      // check follow or not
      const f0 = await this.userRef.doc(uu1.id).collection('followers').get();
      const f1 = await this.userRef.doc(uid).collection('following').doc(uu1.id).get();
      const [ff0, ff1] = await Promise.all([f0, f1]);
      if (uu1.exists) {
        allNews.push({
          id: newsSnapshot.id,
          uid: uu1.id,
          userInfo: uu1.data(),
          followerCount: ff0.size,
          isFollow: ff1.exists,
          isLike: ll1.exists,
          newsInfo: newsSnapshot.data()
        });
      }
    })).then(() => {
      // allNews.sort((first, second) => {
      //   if (first.newsInfo.timestamp > second.newsInfo.timestamp) return -1;
      //   if (first.newsInfo.timestamp < second.newsInfo.timestamp) return 1;
      //   return 0
      // });
      return Promise.resolve(allNews);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }
  /**
   * get all News with newstype and isExperts
   * @param newsType
   * @param isExpert
   * @param uid
   */
  async getAllNewsWithType(newsType, isExpert, uid) {
    const allNews = [];
    // tslint:disable-next-line: max-line-length
    const n1 = await this.newsRef.orderBy('timestamp', 'desc').where('newsType', '==', newsType).where('isExpert', '==', isExpert).limit(10).get();
    const [nn1] = await Promise.all([n1]);
    return Promise.all(nn1.docs.map(async newsSnapshot => {
      const u1 = await this.userRef.doc(newsSnapshot.data().uid).get();
      const l1 = await newsSnapshot.ref.collection('likes').doc(uid).get();
      const [uu1, ll1] = await Promise.all([u1, l1]);
      // check follow or not
      const f0 = await this.userRef.doc(uu1.id).collection('followers').get();
      const f1 = await this.userRef.doc(uid).collection('following').doc(uu1.id).get();
      const [ff0, ff1] = await Promise.all([f0, f1]);
      if (uu1.exists) {
        allNews.push({
          id: newsSnapshot.id,
          uid: uu1.id,
          userInfo: uu1.data(),
          followerCount: ff0.size,
          isFollow: ff1.exists,
          isLike: ll1.exists,
          newsInfo: newsSnapshot.data()
        });
      }
    })).then(() => {
      allNews.sort((first, second) => {
        if (first.newsInfo.timestamp > second.newsInfo.timestamp) { return -1; }
        if (first.newsInfo.timestamp < second.newsInfo.timestamp) { return 1; }
        return 0;
      });
      return Promise.resolve(allNews);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }
  /**
   * get News Info with id
   * @param id
   */
  async getNewsWithId(id) {
    const n1 = await this.newsRef.doc(id).get();
    const [nn1] = await Promise.all([n1]);
    const u1 = await this.userRef.doc(nn1.data().uid).get();
    const [uu1] = await Promise.all([u1]);
    const data = {
      newsInfo: nn1.data(),
      userInfo: uu1.data()
    };
    return Promise.resolve(data);
  }
  async removeNewsWithId(id) {
    const n1 = await this.newsRef.doc(id).delete();
    const n2 = await this.newsRef.doc(id).collection('comments').get();
    const n3 = await this.newsRef.doc(id).collection('likes').get();
    const [nn1, nn2, nn3] = await Promise.all([n1, n2, n3]);

    await nn3.docs.map(async likeSnapshot => {
      await likeSnapshot.ref.delete();
    });
    return await Promise.all(nn2.docs.map(async snapshot => {
      await snapshot.ref.delete();
    })).then(() => {
      return Promise.resolve(true);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }


  /**
   * get buddy's news Information with id
   * @param buddyId
   */
  async getBuddyNewsWithId(buddyId, uid) {
    console.log('buddyid:', buddyId);
    const news = [];
    const n1 = await this.newsRef.where('uid', '==', buddyId).get();
    const [nn1] = await Promise.all([n1]);
    return Promise.all(nn1.docs.map(async snapshot => {
      const l1 = await snapshot.ref.collection('likes').doc(uid).get();
      const [ll1] = await Promise.all([l1]);
      news.push({
        isLike: ll1.exists,
        id: snapshot.id,
        newsInfo: snapshot.data()
      });
    })).then(() => {
      news.sort((first, second) => {
        if (first.newsInfo.timestamp > second.newsInfo.timestamp) { return -1; }
        if (first.newsInfo.timestamp < second.newsInfo.timestamp) { return 1; }
        return 0;
      });
      return Promise.resolve(news);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /**
   * get comments of news with newsid
   * @param id
   */
  async getNewsCommentsWithId(id) {
    const newsComments = [];
    const c1 = await this.newsRef.doc(id).collection('comments').orderBy('timestamp', 'desc').get();
    const [cc1] = await Promise.all([c1]);
    return Promise.all(cc1.docs.map(async commentSnapshot => {
      const u1 = await this.userRef.doc(commentSnapshot.data().uid).get();
      const [uu1] = await Promise.all([u1]);
      newsComments.push({
        commentInfo: commentSnapshot.data(),
        userInfo: uu1.data()
      });
    })).then(() => {
      return Promise.resolve(newsComments);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  async getNewsLikeWithId(newsid, uid) {
    return new Promise((resolve, reject) => {
      this.newsRef.doc(newsid).collection('likes').doc(uid).get().then((snapshot) => {
        resolve(snapshot.exists);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async postComment(newsid, commentCount, commentInfo) {
    commentInfo.timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const c1 = await this.newsRef.doc(newsid).collection('comments').add(commentInfo);
    const c2 = await this.newsRef.doc(newsid).set({ commentCount: commentCount + 1 }, { merge: true });
    await Promise.all([c1, c2]).then(() => {
      return Promise.resolve(true);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
  async postLike(newsid, isLike, uid, likeCount) {
    if (isLike) {
      const a1 = this.newsRef.doc(newsid).collection('likes').doc(uid)
        .set({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      const a2 = this.newsRef.doc(newsid)
        .set({ likeCount: likeCount }, { merge: true });
      return await Promise.all([a1, a2]).then(() => {
        return true;
      }).catch(err => {
        return false;
      });
    } else {
      const a1 = this.newsRef.doc(newsid).collection('likes').doc(uid).delete();
      const a2 = this.newsRef.doc(newsid)
        .set({ likeCount: likeCount }, { merge: true });
      return await Promise.all([a1, a2]).then(() => {
        return true;
      }).catch(err => {
        return false;
      });
    }
  }
}
