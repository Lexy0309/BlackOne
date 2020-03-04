import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ActionSheetController, NavController, Events, IonSlides, ModalController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { storage, firestore } from 'firebase';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { NotifyService } from 'src/app/services/notify.service';
import { SettingService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-buddy-message',
  templateUrl: './buddy-message.page.html',
  styleUrls: ['./buddy-message.page.scss'],
})
export class BuddyMessagePage implements OnInit {

  @ViewChild('IonContent') content: IonContent;

  isLoading = false;
  myProfile: any;
  buddyInfo: any;
  isSending = false;
  base64Image = '';
  new_message: string = '';
  newmessage;
  allmessages = [];
  buddyOnlineState = false;

  backpage = '';
  originBuddy: any;
  parentBackPage = '';
  @ViewChild('slides') slides: IonSlides;
  slide_opts = {
    zoom: false
  }
  strPlcHld = '';
  constructor(
    public activRoute: ActivatedRoute,
    private router: Router,
    private notifyService: NotifyService,
    private camera: Camera, private http: HttpClient, private webview: WebView,
    private navController: NavController,
    public events: Events, public zone: NgZone,
    private userService: UserService,
    public settingService: SettingService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {

  }
  async ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    // init trans
    this.initTranslate();

    this.activRoute.paramMap.subscribe(async params => {
      this.buddyInfo = JSON.parse(params.get('buddy'));
      this.backpage = params.get('backpage');
      this.originBuddy = JSON.parse(params.get('originBuddy'));
      this.parentBackPage = params.get('parentBackPage');

      this.isLoading = true;
      this.messageService.getAllMessages(this.myProfile.uid, this.buddyInfo.uid).then((messages: []) => {
        this.isLoading = false;
        this.allmessages = messages;

        this.scrollDown();
      }).catch((err) => {
        this.isLoading = false;
        return [];
      });

      // get buddy state
      this.userService.getOnlineStateOfBuddy(this.buddyInfo.uid);
      this.events.subscribe('buudy_onlinestate', (onlinestate) => {
        this.zone.run(() => {
          this.buddyOnlineState = onlinestate;
        });
      });
    });
  }

  ionViewWillEnter() {
    // save my online state in chat room to server
    this.userService.saveMyOnlineState(true, this.myProfile.uid, this.buddyInfo.uid);

    // get new message
    this.messageService.getbuddymessages(this.myProfile.uid, this.buddyInfo.uid);
    this.events.subscribe('newmessage', (newBuddyMessages) => {
      this.zone.run(() => {
        if (newBuddyMessages.length > 0) {
          newBuddyMessages.forEach(chat => {
            if (!chat.timestamp) { return; }
            if (this.allmessages.length == 0) {
              this.allmessages.push(chat);
            } else {
              const lasttime = this.settingService.getDateFromModel(this.allmessages[this.allmessages.length - 1].timestamp);
              const newtime = this.settingService.getDateFromModel(chat.timestamp);
              // if (lasttime.getTime() != newtime.getTime()) {
              if (lasttime.getTime() < newtime.getTime()) {
                this.allmessages.push(chat);
              }
            }
          });
          this.scrollDown();
          console.log('message:', this.allmessages);
        }
      });
    });
  }
  initTranslate() {
    this.translate.get('message.chat_placeholder').subscribe(result => {
      this.strPlcHld = result;
    });
  }
  ionViewDidLeave() {
    this.userService.saveMyOnlineState(false, this.myProfile.uid, this.buddyInfo.uid);
    //   this.messageService.unsubscribebuddymessages();
    //   console.log("leave chat details page.");
  }

  goback() {
    if (this.backpage == 'tab-messages') {
      // this.navController.navigateBack('tabs/tab-messages');
    } else if (this.backpage == 'view-profile') {
      // console.log(">>>>>>>>>>>", this.originBuddy);
      // this.router.navigate(['view-profile', { buddyInfo: JSON.stringify(this.originBuddy), from: this.parentBackPage }]);
      // this.navController.navigateBack('/tabs/tabs/tab-miscellaneous/friends');
    } else if (this.backpage == 'tab-home') {
      // this.navController.navigateBack('/tabs/tabs/tab-home');
    }
    this.navController.back();
  }
  doRefresh(event) {
    const lasttimestamp = this.allmessages[0].timestamp;
    this.messageService.getLatestMessages(this.myProfile.uid, this.buddyInfo.uid, lasttimestamp).then((newMessages: []) => {
      this.allmessages.reverse();
      newMessages.reverse();
      newMessages.forEach(article => {
        this.allmessages.push(article);
      })
      this.allmessages.reverse();
      event.target.complete();
    }).catch((err) => {
      event.target.complete();
    })
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async sendMsg() {
    if (!this.new_message.trim()) { return; }
    var message = this.new_message.trim();
    this.new_message = '';
    console.log('buddy online state:', this.buddyOnlineState);
    this.messageService.addnewmessage(this.myProfile.uid, this.buddyInfo.uid, message, this.buddyOnlineState).then(() => {
      this.scrollDown();
    }).catch((err) => {
      this.notifyService.modalMsg(err, 'Error');
    })
  }
  scrollDown() {
    this.content.scrollToBottom(1500);
  }

  userTyping(event: any) {
    if (event.keyCode == 13) {
      this.sendMsg()
    }
    this.scrollDown()
  }
  // // uploading image
  // async selectImage() {
  //   let actionSheet = await this.actionSheetController.create({
  //     header: 'Select Image Source',
  //     buttons: [
  //       {
  //         text: 'Load from Library',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //         }
  //       },
  //       {
  //         text: 'Use Camera',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.CAMERA);
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  // takePicture(sourceType: PictureSourceType) {
  //   var options = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     correctOrientation: true,
  //     sourceType: sourceType,
  //   }
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.base64Image = 'data:image/jpeg;base64,' + imageData;
  //     // uploading image
  //     this.sendImage(this.base64Image);
  //   }, (err) => {
  //     this.notify.toastMsg('Error while selecting image.', "", "", "danger");
  //   });

  // }

  // sendImage(base64Image) {
  //   this.isSending = true;
  //   this.scrollDown();
  //   let uploadTask = this.dataProvider.uploadToStorage(base64Image, "messages");
  //   uploadTask.on(storage.TaskEvent.STATE_CHANGED,
  //     (snapshot: UploadTaskSnapshot) => {
  //       // this.uploadProgress = Math.floor((snapshot.bytesTransferred /snapshot.totalBytes) * 100);
  //     },
  //     (error) => {
  //       // this.notify.closeLoading();
  //       // this.uploadingMsg = "";
  //     },
  //     () => {
  //       uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
  //         if (uploadTask.snapshot.state) {
  //           this.messageService.addnewmessage(downloadURL, true, this.buddyOnlineState).then(() => {
  //             this.scrollDown();
  //             this.isSending = false;
  //           }).catch((err) => {
  //             this.isSending = false;
  //             this.notify.showLoading(err);
  //           })
  //         }
  //       }).catch(err => {
  //         this.isSending = false;
  //       })
  //     }
  //   );
  // }
}
