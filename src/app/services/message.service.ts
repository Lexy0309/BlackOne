import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageRef: firebase.firestore.CollectionReference;
  userRef: firebase.firestore.CollectionReference;
  constructor(
    public events: Events
  ) {
    this.messageRef = firebase.firestore().collection("messages");
    this.userRef = firebase.firestore().collection("user");
  }


  async addnewmessage(my_uid, buddy_uid, msg, onlinestate?) {
    let isNewMessage = onlinestate ? onlinestate : false;
    if (buddy_uid) {
      let newMessage = {
        sentby: my_uid,
        message: msg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      let mylastmessage = {
        lastmessage: msg,
        lastmessagetime: firebase.firestore.FieldValue.serverTimestamp(),
        newMessage: false
      }
      let lastmessage = {
        lastmessage: msg,
        lastmessagetime: firebase.firestore.FieldValue.serverTimestamp(),
        newMessage: !isNewMessage
      }
      // save messages A to B
      const c1 = await this.messageRef.doc(my_uid).collection("buddymessages").doc(buddy_uid)
        .collection("chats").add(newMessage);
      // save message B to A
      const c2 = await this.messageRef.doc(buddy_uid).collection("buddymessages").doc(my_uid)
        .collection("chats").add(newMessage);
      // save last message to A, B
      const c3 = await this.userRef.doc(my_uid).collection('last_messages').doc(buddy_uid).set(mylastmessage);
      const c4 = await this.userRef.doc(buddy_uid).collection('last_messages').doc(my_uid).set(lastmessage);

      return Promise.all([c1, c2, c3, c4]).then(() => {
        return Promise.resolve(true);
      }).catch(err => {
        return Promise.reject(err);
      });
    }
  }

  getAllMessages(my_uid, buddy_uid) {
    let temp;
    return new Promise((resolve, reject) => {
      this.messageRef.doc(my_uid).collection("buddymessages").doc(buddy_uid).collection("chats")
        .orderBy("timestamp", "desc").limit(10).get()
        .then((snapshots) => {
          let buddymessages = [];
          if (snapshots.size) {
            snapshots.forEach((snapshot) => {
              temp = snapshot.data();
              buddymessages.push(temp);
            });
            buddymessages.reverse();
          }
          resolve(buddymessages);
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  getLatestMessages(my_uid, buddy_uid, lasttimestamp) {
    let newMessages = [];
    return new Promise((resolve, reject) => {
      this.messageRef.doc(my_uid).collection("buddymessages").doc(buddy_uid).collection("chats")
        .where("timestamp", "<", lasttimestamp)
        .orderBy("timestamp", "desc").limit(10).get().then((snapshots) => {
          if (snapshots.size) {
            snapshots.forEach(snpashot => {
              newMessages.push(snpashot.data());
            });
          }
          resolve(newMessages.reverse());
        }).catch(err => {
          reject(err);
        });
    })
  }

  getbuddymessages(my_uid, buddy_uid) {
    this.messageRef.doc(my_uid).collection("buddymessages").doc(buddy_uid).collection("chats")
      .orderBy("timestamp", "desc").limit(1)
      .onSnapshot((snapshots) => {
        let newBuddyMessages = [];
        if (snapshots.size) {
          snapshots.forEach((snapshot) => {
            newBuddyMessages.push(snapshot.data());
          });
          newBuddyMessages.reverse();
          this.events.publish('newmessage', newBuddyMessages);
        }
      })
  }
}
