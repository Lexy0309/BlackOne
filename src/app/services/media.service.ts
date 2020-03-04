import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import { storage } from 'firebase';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { VideoModalPage } from '../pages/modal/video-modal/video-modal.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NotifyService } from './notify.service';
import { PhotoViewModalPage } from '../pages/modal/photo-view-modal/photo-view-modal.page';
import { File } from '@ionic-native/file/ngx';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  base64ImageData = '';
  public isUploading = false;
  public shareText = 'Shared by one of our members';
  public shareUrl = 'https://www.blacks.one';
  constructor(
    private photoViewer: PhotoViewer,
    private emailComposer: EmailComposer,
    public modalController: ModalController,
    private platform: Platform,
    private socialSharing: SocialSharing,
    private notifyService: NotifyService,
    private file: File, private zone: NgZone,
    private http: HttpClient
  ) { }

  openVideoModal(src) {
    this.modalController.create({
      component: VideoModalPage,
      componentProps: {
        src: src
      }
    }).then(modal => {
      modal.present();
    });
  }

  openPhotoViewModal(src) {
    this.modalController.create({
      component: PhotoViewModalPage,
      componentProps: {
        src: src
      }
    }).then(modal => {
      modal.present();
    });
  }

  uploadToStorage(base64image, path?) {
    const uniqkey = 'pic' + Math.floor(Math.random() * 1000000);
    const metadata = {
      contentType: 'image/jpeg'
    };
    const pathUrl = (path ? path : 'avatars') + '/' + uniqkey;

    const storageRef = firebase.storage().ref(pathUrl);

    // let storageRef = this.storage.storage.ref(pathUrl);
    return storageRef.putString(base64image, 'data_url');
  }

  uploadVideoToStorage(blobData: Blob) {
    const uniqkey = 'selfie' + Math.floor(Math.random() * 1000000);
    const pathUrl = 'video/' + uniqkey;
    const storageRef = firebase.storage().ref(pathUrl);
    return storageRef.put(blobData);
  }


  async uploadToStorage1(base64image, path?) {
    const uniqkey = 'pic' + Math.floor(Math.random() * 1000000);
    const pathUrl = (path ? path : 'avatars') + '/' + uniqkey;
    const storageRef = firebase.storage().ref(pathUrl);
    const uploadTask = storageRef.putString(base64image, 'data_url');

    return new Promise((resolve, reject) => {
      uploadTask.on(storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => { },
        (error) => { },
        () => {
          return uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            resolve(downloadURL);
          }).catch(err => {
            reject(err);
          });
        }
      );
    });
  }
  sendMail(email) {
    // Send a text message using default options
    this.emailComposer.open(email).then(() => {
      return true;
    }).catch(err => {
      return err;
    });
  }
  async resolveLocalFile() {
    // tslint:disable-next-line: max-line-length
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/png/`, 'logo_label.png', this.file.cacheDirectory, `${new Date().getTime()}.png`);
  }
  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name);
  }
  // async shareViaEmail(newsItem) {
  //   const file = await this.resolveLocalFile();
  //   const subject = newsItem.newsInfo.title;
  //   const message = '<div><p style="color: red;">'
  //     + newsItem.newsInfo.content + '</p><br/></br>'
  //     + 'www.blacks.one click here!!!'
  //     + '</div>';

  //   this.socialSharing.shareViaEmail(message, subject, [], null, null, file.nativeURL).then(() => {
  //     this.removeTempFile(file.name);
  //     this.notifyService.toastMsg('Shared via Email');
  //   }).catch((e) => {
  //     // Error!
  //     this.notifyService.toastMsg('Not able to be shared via Email');
  //   });
  // }
  // shareEmail(newsItem) {
  //   console.log(newsItem);
  //   const message = newsItem.newsInfo.content;
  //   const subject = newsItem.newsInfo.title;
  //   const sendTo = [];
  //   this.platform.ready()
  //     .then(() => {
  //       this.socialSharing.canShareViaEmail()
  //         .then(() => {
  //           this.socialSharing.shareViaEmail(message, subject, sendTo)
  //             .then((data) => {
  //               this.notifyService.toastMsg('Shared via Email');
  //             })
  //             .catch((err) => {
  //               this.notifyService.toastMsg('Not able to be shared via Email');
  //             });
  //         })
  //         .catch((err) => {
  //           this.notifyService.toastMsg('Sharing via Email NOT enabled');
  //         });
  //     });
  // }
  async shareViaWhatsApp(newsItem) {

    const subject = newsItem.newsInfo.title
      + '\n\n' + newsItem.newsInfo.content 
      + '\n\n' + 'Shared by a member of Blacks One';
    console.log(subject);
    this.socialSharing.shareViaWhatsApp(subject, null, this.shareUrl).then(() => {
      // Success
      this.notifyService.toastMsg('Shared via WhatsApp');
    }).catch((e) => {
      // Error!
      this.notifyService.toastMsg(JSON.stringify(e), '', '', 'warning');
    });
  }

  // shareWhatsApp(newsItem) {
  //   const message = newsItem.newsInfo.content;
  //   const subject = newsItem.newsInfo.title;
  //   const uri = newsItem.userInfo.photoURL;
  //   const url = '';
  //   this.platform.ready()
  //     .then(() => {
  //       this.socialSharing.shareViaWhatsApp(message, null, url).then(() => {
  //         this.notifyService.toastMsg('Shared via WhatsApp');
  //       }).catch((e) => {
  //         this.notifyService.toastMsg('Was not shared via WhatsApp', '', '', 'warning');
  //       });
  //     });
  // }

  // async shareViaFacebook(newsItem) {
  //   const file = await this.resolveLocalFile();

  //   // Image or URL works
  //   this.socialSharing.shareViaFacebook(null, file.nativeURL, null).then(() => {
  //     this.removeTempFile(file.name);
  //   }).catch((e) => {
  //     // Error!
  //   });
  // }
  // shareFacebook(newsItem) {
  //   const message = newsItem.newsInfo.content;
  //   const subject = newsItem.newsInfo.title;
  //   const uri = newsItem.userInfo.photoURL;
  //   this.platform.ready()
  //     .then(() => {
  //       this.socialSharing.canShareVia('com.apple.social.facebook', message, 'image', uri)
  //         .then((data) => {

  //           this.socialSharing.shareViaFacebook(message, 'image', uri)
  //             .then((data) => {
  //               this.notifyService.toastMsg('hared via Facebook');
  //             })
  //             .catch((err) => {
  //               this.notifyService.toastMsg('Was not shared via Facebook', '', '', 'warning');
  //             });

  //         })
  //         .catch((err) => {
  //           this.notifyService.toastMsg('Not able to be shared via Facebook', '', '', 'warning');
  //         });

  //     });
  // }

  // async shareViaTwitter(newsItem) {
  //   // Either URL or Image
  //   this.socialSharing.shareViaTwitter(null, null, this.shareUrl).then(() => {
  //     // Success
  //     this.notifyService.toastMsg('Shared via Twitter');
  //   }).catch((e) => {
  //     // Error!
  //     this.notifyService.toastMsg('Was not shared via Twitter', '', '', 'warning');
  //   });
  // }
  // shareTwitter(newsItem) {
  //   const message = newsItem.newsInfo.content;
  //   const subject = newsItem.newsInfo.title;
  //   const uri = newsItem.userInfo.photoURL;
  //   this.platform.ready()
  //     .then(() => {

  //       this.socialSharing.canShareVia('com.apple.social.twitter', message, 'image', uri)
  //         .then((data) => {

  //           this.socialSharing.shareViaTwitter(message, 'image', uri)
  //             .then((data) => {
  //               this.notifyService.toastMsg('Shared via Twitter');
  //             })
  //             .catch((err) => {
  //               this.notifyService.toastMsg('Was not shared via Twitter', '', '', 'warning');
  //             });

  //         });

  //     })
  //     .catch((err) => {
  //       this.notifyService.toastMsg('Was not shared via Twitter', '', '', 'warning');
  //     });
  // }

}
