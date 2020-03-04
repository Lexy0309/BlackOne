import { PictureSourceType, Camera } from '@ionic-native/camera/ngx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { NotifyService } from 'src/app/services/notify.service';
import { UserService } from 'src/app/services/user.service';
import { MediaService } from 'src/app/services/media.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { storage } from 'firebase';
import { Platform, ActionSheetController, NavController } from '@ionic/angular';
import { NewsService } from 'src/app/services/news.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  demoPhoto = this.settingService.demo_photo;
  demoVideo = this.settingService.demo_video;
  newsList = ['1', '2', '3', '4', '5'];
  slideOpts = {
    effect: 'flip'
  };
  isShowEditPresentation = false;
  myFollowersCount = 0;
  myNews = [];
  blankItems = ['1', '2', '3', '4'];
  isLoadedAllNews = false;
  myProfile: any;
  sharing_title = 'Select sharing type';
  sharing_via_whatsapp_title = 'Sharing this via WhatsApp';
  sharing_via_email_title = 'Sharing this via email';
  cancel_text = 'Cancel';
  use_camera_text = 'Use Camera';
  select_image_source_text = 'Select Image Source';
  load_from_library_text = 'Load from Library';
  constructor(
    private router: Router,
    public settingService: SettingService,
    private userService: UserService,
    private notifyService: NotifyService,
    public mediaService: MediaService,
    private newsService: NewsService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    private crop: Crop,
    private base64: Base64,
    private navController: NavController,
    private webview: WebView,
    private translate: TranslateService,
  ) {
    this.translate.get('message.select_sharing_type').subscribe(result => {
      this.sharing_title = result;
    });
    this.translate.get('cancel').subscribe(result => {
      this.cancel_text = result;
    });
    this.translate.get('message.sharing_via_whatsapp').subscribe(result => {
      this.sharing_via_whatsapp_title = result;
    });
    this.translate.get('message.sharing_via_email').subscribe(result => {
      this.sharing_via_email_title = result;
    });
    this.translate.get('message.use_camera').subscribe(result => {
      this.use_camera_text = result;
    });
    this.translate.get('message.select_image_source').subscribe(result => {
      this.select_image_source_text = result;
    });
    this.translate.get('message.load_from_library').subscribe(result => {
      this.load_from_library_text = result;
    });
  }

  ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    this.getMyFollowersCount();
    this.getMyNews(this.myProfile.uid);
  }
  getMyFollowersCount() {
    this.userService.getFollowers(this.myProfile.uid).then((result) => {
      this.myFollowersCount = result.length;
    })
  }
  getMyNews(myUid) {
    this.myNews = [];
    this.isLoadedAllNews = false;
    this.newsService.getBuddyNewsWithId(myUid, myUid).then((result) => {
      this.myNews = result;
      this.isLoadedAllNews = true;
    }).catch(err => {
      this.isLoadedAllNews = true;
      this.notifyService.modalMsg(err, 'Error');
    });
  }

  viewNewsDetails(item) {
    this.navController.navigateForward(['details', {
      newsType: item.newsInfo.newsType,
      newsId: item.id,
      timestamp: this.settingService.getDateFromModel(item.newsInfo.timestamp),
      newsInfo: JSON.stringify(item.newsInfo),
      userInfo: JSON.stringify(this.myProfile),
      from: 'my-profile'
    }]);
  }
  goBack() {
    this.navController.back();
  }
  doFollow() {

  }
  goMessage() {
    this.router.navigate(['tabs/tab-messages/buddy-message']);
  }
  showEditPresentation() {
    this.isShowEditPresentation = true;
  }
  cancelUpdatePresentation() {
    this.isShowEditPresentation = false;
  }
  doUpdatePresentation() {
    const data = {
      uid: this.myProfile.uid,
      presentation: this.myProfile.presentation
    }
    this.userService.updatePresentation(data).then(() => {
      this.isShowEditPresentation = false;
      localStorage.setItem(this.settingService.KEY_USER, JSON.stringify(this.myProfile));
    }).catch((err) => {
      this.notifyService.modalMsg(err.message, 'error');
    });
  }
  async sharing(newsItem) {
    const actionSheet = await this.actionSheetController.create({
      header: this.sharing_title,
      buttons: [
        {
          text: this.sharing_via_email_title,
          handler: () => {
            this.router.navigate(['share-news', {
              newsInfo: JSON.stringify(newsItem.newsInfo),
              newsType: ''
            }]);
          }
        },
        {
          text: this.sharing_via_whatsapp_title,
          handler: () => {
            this.mediaService.shareViaWhatsApp(newsItem);
          }
        },
        {
          text: this.cancel_text,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }
  // show ActionSheet to load image.
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: this.select_image_source_text,
      buttons: [
        {
          text: this.load_from_library_text,
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.use_camera_text,
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.cancel_text,
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async takePicture(sourceType: PictureSourceType) {
    var options = {
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.ALLMEDIA,
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    }
    await this.camera.getPicture(options).then((imageData) => {
      if (this.platform.is('android')) {
        imageData = 'file://' + imageData;
      }
      return this.crop.crop(imageData, { quality: 100 });
    }, (err) => {
      this.notifyService.modalMsg(err.message, 'Notice');
    }).then(async (crop_path: string) => {
      let url = crop_path;
      if (this.platform.is('android')) {
        url = crop_path;
      } else if (this.platform.is('ios')) {
        url = this.webview.convertFileSrc(crop_path);
      }
      this.base64.encodeFile(url).then((base64File: string) => {
        const original = base64File.split(',');
        this.myProfile.photoURL = 'data:image/jpeg;base64,' + original[1];
        this.updateAvatar(this.myProfile.photoURL);
      }, (err) => {
        this.notifyService.modalMsg(err.message, 'Notice');
      });
    }, (err) => {
      this.notifyService.modalMsg(err.message, 'Notice');
    });
  }

  updateAvatar(img) {
    // uploading avatar
    this.notifyService.showLoading();
    const uploadTask = this.mediaService.uploadToStorage(img);
    uploadTask.on(storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        // this.editButtonStr = (Math.floor((snapshot.bytesTransferred /snapshot.totalBytes) * 100)).toString();
      },
      (error) => {
        this.notifyService.closeLoading();
        this.notifyService.modalMsg(error, 'Notice');
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          if (uploadTask.snapshot.state) {
            this.myProfile.photoURL = downloadURL;
            const data = {
              uid: this.myProfile.uid,
              photoURL: this.myProfile.photoURL
            }
            this.userService.updatePhotoURL(data).then(() => {
              localStorage.setItem(this.settingService.KEY_USER, JSON.stringify(this.myProfile));
            }).catch(err => {
              this.notifyService.modalMsg(err, 'Notice');
            });
          }
        }).catch(err => {

        })
      }
    );
  }
}
