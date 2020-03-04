import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { NotifyService } from 'src/app/services/notify.service';
import * as firebase from 'firebase';
import { NewsService } from 'src/app/services/news.service';
import { MediaService } from 'src/app/services/media.service';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { DeactivableComponent } from 'src/app/utils/deactivable-component';
import { Observable } from 'rxjs';


const MEDIA_FILES_KEY = 'mediaFiles';

@Component({
  selector: 'app-add-new-share',
  templateUrl: './add-new-share.page.html',
  styleUrls: ['./add-new-share.page.scss'],
})
export class AddNewSharePage implements OnInit, DeactivableComponent {
  newsType = '';
  fromPage = '';
  selectedTab = '';
  newsTypeInfo: any;

  myProfile: any;
  news_img = '';
  news_video = '';
  news_video_path = '';
  news_video_filename = '';
  news_video_thumbnail = '';
  news_title = '';
  news_content = '';
  isMyExpertState: boolean;
  postedNewsAlert = '';

  cancel_text = 'Cancel';

  mediaFiles = [];
  uploadingStateStr = '';

  use_camera_text = 'Use Camera';
  select_image_source_text = 'Select Image Source';
  load_from_library_text = 'Load from Library';
  constructor(
    private activatedRoute: ActivatedRoute,
    public settingService: SettingService,
    private authService: AuthService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private notifyService: NotifyService,
    private newsService: NewsService,
    private alertController: AlertController,
    public mediaService: MediaService,
    private mediaCapture: MediaCapture,
    private storage: Storage,
    private file: File,
    private navController: NavController,
    private translate: TranslateService,
    private videoEditor: VideoEditor
  ) {
    this.translate.get('message.added_news').subscribe(result => {
      this.postedNewsAlert = result;
    });
    this.translate.get('cancel').subscribe(result => {
      this.cancel_text = result;
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
    this.activatedRoute.paramMap.subscribe(params => {
      this.newsType = params.get('newsType');
      this.fromPage = params.get('fromPage');
      this.selectedTab = params.get('selectedTab');
      this.newsTypeInfo = this.settingService.getNewsTypeInfo(this.newsType);
      this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // For simplicity we use a flag. You should implement the logic to figure out if there are any unsaved changes or not
    // const areUnsavedChanges = true;

    // let canDeactivate = true;
    // if (areUnsavedChanges) {
    //   canDeactivate = window.confirm('Are you sure you want to leave this page?');
    // }

    // return canDeactivate;
    return true;
  }

  ionViewWillEnter() {
    this.isMyExpertState = this.getMyExpertState(this.newsType);
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
    })
  }
  getMyExpertState(newsType) {
    if (newsType == 'business') {
      return this.myProfile.expert.isBusiness;
    } else if (newsType == 'lady') {
      return this.myProfile.expert.isLady;
    } else if (newsType == 'agroecology') {
      return this.myProfile.expert.isAgroecology;
    } else if (newsType == 'culture') {
      return this.myProfile.expert.isCulture;
    } else if (newsType == 'kids') {
      return this.myProfile.expert.isKids;
    } else if (newsType == 'sciences') {
      return this.myProfile.expert.isSciences;
    }
    return false;
  }

  goBack() {
    if (this.fromPage == 'tab-news') {
      // this.router.navigate(['tabs/tab-news']);
    } else if (this.fromPage == 'tab-share') {
      // this.router.navigate(['tabs/tab-share']);
    }
    this.navController.back();
  }

  async sendNews() {
    if (this.authService.isBannedState()) {
      this.notifyService.modalMsg('you cannot post any news. banned by the administrator.');
      return;
    }
    if (!this.isValidForm()) {
      this.notifyService.modalMsg('Please input a news.', 'Notice');
      return;
    }
    this.uploadingStateStr = '';
    if (this.news_video) {
      this.mediaService.isUploading = true;
      this.translate.get('message.preparing_news').subscribe(result => {
        this.uploadingStateStr = result;
      });

      await this.makeFileIntoBlob(this.news_video_path, this.news_video_filename, 'video/mp4').then((blob: Blob) => {
        const uploadTask = this.mediaService.uploadVideoToStorage(blob);
        uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
          this.translate.get('message.video_uploading').subscribe(result => {
            this.uploadingStateStr = result + '(' + Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%)';
          });
        }, (error) => {
          this.mediaService.isUploading = false;
          this.notifyService.modalMsg(error, 'Notice');
        }, () => {
          this.uploadingStateStr = 'waiting...';
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            if (this.news_img) {
              this.uploadingStateStr = 'uploading image...';
              const uploadTask = this.mediaService.uploadToStorage(this.news_img, 'news');
              uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
                this.translate.get('message.image_uploading').subscribe(result => {
                  this.uploadingStateStr = result + '(' + Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%)';
                });
              },
                (error) => {
                  this.mediaService.isUploading = false;
                  this.notifyService.modalMsg(error, 'Notice');
                },
                () => {
                  uploadTask.snapshot.ref.getDownloadURL().then(async (img_downloadURL) => {
                    if (uploadTask.snapshot.state) {
                      const news_data = {
                        title: this.news_title, content: this.news_content, newsType: this.newsType,
                        uid: this.myProfile.uid, isExpert: this.isMyExpertState, newsImage: img_downloadURL,
                        newsVideo: downloadURL, newsVideoThumbnail: this.news_video_thumbnail, commentCount: 0, likeCount: 0,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                      }
                      this.newsService.addNews(news_data).then(() => {
                        this.initNewsForm();
                        setTimeout(() => {
                          this.mediaService.isUploading = false;
                          this.notifyService.modalMsg(this.postedNewsAlert);
                        }, 1000);
                      }).catch(err => {
                        this.mediaService.isUploading = false;
                        this.notifyService.modalMsg(err.message, 'Error');
                      });
                    }
                  }).catch(err => {
                    this.mediaService.isUploading = false;
                    this.notifyService.modalMsg(err, 'blob make Error');
                  })
                }
              );
            } else {
              const news_data = {
                title: this.news_title, content: this.news_content, newsType: this.newsType,
                uid: this.myProfile.uid, isExpert: this.isMyExpertState, newsImage: this.news_img,
                newsVideo: downloadURL, newsVideoThumbnail: this.news_video_thumbnail, commentCount: 0, likeCount: 0,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              }
              this.newsService.addNews(news_data).then(() => {
                this.initNewsForm();
                setTimeout(() => {
                  this.mediaService.isUploading = false;
                  this.notifyService.modalMsg(this.postedNewsAlert);
                }, 1000);
              }).catch(err => {
                this.mediaService.isUploading = false;
                this.notifyService.modalMsg(err.message, 'Error');
              });
            }
          }).catch(err => {
            this.mediaService.isUploading = false;
            this.notifyService.modalMsg(err, 'Error');
          });
        });
      }).catch((err) => {
        this.mediaService.isUploading = false;
        this.notifyService.modalMsg(err, 'blob make Error');
      });
    } else {
      this.mediaService.isUploading = true;
      this.uploadingStateStr = 'waiting...';
      if (this.news_img) {
        this.uploadingStateStr = 'uploading image...';
        const uploadTask = this.mediaService.uploadToStorage(this.news_img, 'news');
        uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
          this.translate.get('message.image_uploading').subscribe(result => {
            this.uploadingStateStr = result + '(' + Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%)';
          });
        },
          (error) => {
            this.mediaService.isUploading = false;
            this.notifyService.modalMsg(error, 'Notice');
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(async (img_downloadURL) => {
              if (uploadTask.snapshot.state) {
                const news_data = {
                  title: this.news_title, content: this.news_content, newsType: this.newsType,
                  uid: this.myProfile.uid, isExpert: this.isMyExpertState, newsImage: img_downloadURL,
                  newsVideo: this.news_video, newsVideoThumbnail: this.news_video_thumbnail, commentCount: 0, likeCount: 0,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }
                this.newsService.addNews(news_data).then(() => {
                  this.initNewsForm();

                  setTimeout(() => {
                    this.mediaService.isUploading = false;
                    this.notifyService.modalMsg(this.uploadingStateStr);
                  }, 1000);
                }).catch(err => {
                  this.mediaService.isUploading = false;
                  this.notifyService.modalMsg(err.message, 'Error');
                });
              }
            }).catch(err => {
              this.mediaService.isUploading = false;
              this.notifyService.modalMsg(err, 'blob make Error');
            })
          }
        );
      } else {
        const news_data = {
          title: this.news_title, content: this.news_content, newsType: this.newsType,
          uid: this.myProfile.uid, isExpert: this.isMyExpertState, newsImage: this.news_img,
          newsVideo: this.news_video, newsVideoThumbnail: this.news_video_thumbnail, commentCount: 0, likeCount: 0,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        this.newsService.addNews(news_data).then(() => {
          this.initNewsForm();
          setTimeout(() => {
            this.mediaService.isUploading = false;
            this.notifyService.modalMsg(this.postedNewsAlert);
          }, 1000);
        }).catch(err => {
          this.mediaService.isUploading = false;
          this.notifyService.modalMsg(err.message, 'Error');
        });
      }
    }
  }
  initNewsForm() {
    this.news_img = '';
    this.news_video = '';
    this.news_title = '';
    this.news_content = '';
    this.news_video_thumbnail = '';
  }

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
  takePicture(sourceType: PictureSourceType) {
    const options = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.news_img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.notifyService.toastMsg('Error while selecting image.', '', '', 'danger');;
    });

  }
  async deleteImage() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you confirm this action?',
      buttons: [
        {
          text: this.cancel_text,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.news_img = '';
          }
        }
      ]
    });
    await alert.present();
  }
  async deleteVideo() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you confirm this action?',
      buttons: [
        {
          text: this.cancel_text,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.news_video = '';
            this.news_video_thumbnail = '';
          }
        }
      ]
    });
    await alert.present();
  }

  captureVideo() {
    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30,
      quality: 10
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      try {
        const capturedFile = res[0];
        const fileName = capturedFile.name;
        const dir = capturedFile['localURL'].split('/');
        dir.pop();
        const fromDirectory = dir.join('/');
        const toDirectory = this.file.dataDirectory;
        this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then((res) => {
          this.news_video_path = toDirectory;
          this.news_video_filename = fileName;
          this.news_video = this.news_video_path + '/' + this.news_video_filename;
        }, err => {
          console.log('err: ', err);
        });

        // let numstr = new Date().getUTCMilliseconds();

        // let filedir = this.file.dataDirectory;
        // const path = res[0].fullPath.replace('/private', 'file://');
        // const ind = (path.lastIndexOf('/') + 1);
        // const orgFilename = path.substring(ind);
        // const orgFilePath = path.substring(0, ind);

        // this.file.copyFile(orgFilePath, orgFilename, filedir + 'recordvideo', 'sample' + numstr + '.mov').then(() => {
        //   const option: CreateThumbnailOptions = { fileUri: filedir + 'recordvideo/sample' + numstr + '.mov', width: 160, height: 206, atTime: 1, outputFileName: 'sample' + numstr, quality: 50 };
        //   this.videoEditor.createThumbnail(option).then(result => {
        //     //result-path of thumbnail
        //     console.log("thumbnail result:", result);
        //     this.notifyService.modalMsg(JSON.stringify(result), "thumbnail result:");
        //   }).catch(e => {
        //     this.notifyService.modalMsg(JSON.stringify(e), "thumbnail result error:");
        //     // alert('fail video editor');
        //   });

        // });
      } catch (z) {
        this.notifyService.modalMsg(z, 'Error');
      }
    },
      (err: CaptureError) => console.error(err));
  }
  isValidForm() {
    if (!this.news_title) { return false; }
    if (!this.news_content) { return false; }
    return true;
  }
  async makeFileIntoBlob(filepath, fileName, fileType) {
    return new Promise((resolve, reject) => {
      this.file.readAsArrayBuffer(filepath, fileName).then((res) => {
        const blob = new Blob([res], { type: fileType });
        return resolve(blob);
      }).catch(err => {
        return reject(err);
      });
    });
  }
}
