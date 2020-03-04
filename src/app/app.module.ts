import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// firebase Modules-------------------
import * as firebase from 'firebase';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from './../environments/environment';
// firebase Modules-------------------

// other Modules-------------------
import { IonicStorageModule } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';
// other Modules-------------------
// import { Facebook } from '@ionic-native/facebook/ngx';

// custom services
import { AuthService } from './services/auth.service';

// custom components
import { ComponentsModule } from './components/components.module';
import { VideoModalPageModule } from './pages/modal/video-modal/video-modal.module';
import { PhotoViewModalPageModule } from './pages/modal/photo-view-modal/photo-view-modal.module';

firebase.initializeApp(environment.firebase);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    // RelativeTimePipe
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    ComponentsModule,
    AppRoutingModule,
    VideoModalPageModule,
    PhotoViewModalPageModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Keyboard, EmailComposer, Camera, Crop, PhotoViewer, Base64, File,
    MediaCapture, Media, WebView, VideoEditor, Firebase, SocialSharing,
    // Facebook,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
