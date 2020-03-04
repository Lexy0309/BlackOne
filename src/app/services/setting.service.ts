import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private mainPrefix = 'BLACKSONE_';
  private userprefix = 'USER_';

  public KEY_USER = this.mainPrefix + this.userprefix + 'INFO';
  public KEY_ONBOARDING_STATE = this.mainPrefix + this.userprefix + 'ONBOARDING_STATE';
  public KEY_DEFAULT_LANGUAGE = this.mainPrefix + 'DEFAULT_LANGUAGE';

  public KEY_NEWS_TYPE_BUSINESS = 'business';
  public KEY_NEWS_TYPE_LADY = 'lady';
  public KEY_NEWS_TYPE_AGROECOLOGY = 'agroecology';
  public KEY_NEWS_TYPE_CULTURE = 'culture';
  public KEY_NEWS_TYPE_KIDS = 'kids';
  public KEY_NEWS_TYPE_SCIENCES = 'sciences';

  public KEY_TYPE_EXPERTS = 'experts';
  public KEY_TYPE_GRAND_PUBLIC = 'grand_public';

  public default_avatar = 'assets/png/default_avatar.png';
  public demo_video = '../../assets/media/demo.mp4';
  public demo_photo = '../../assets/media/demo.png';
  public selfie_background = '../../assets/media/selfie_background.png';

  private newsTypeInfoList = {
    'business': {
      header_bgcolor: '#41689E', header_title: 'BUSINESS',
      active_color: '#3D649C',
      body_bgcolor: '#C8D2DA', bottom_btncolor1: '#6E8CB5',
      bottom_btncolor2: '#809abe', bottom_btncolor3: '#99adca'
    },
    'lady': {
      header_bgcolor: '#4e9084', header_title: 'LADIES',
      active_color: '#511849',
      body_bgcolor: '#a2cec8', bottom_btncolor1: '#679585',
      bottom_btncolor2: '#8da693', bottom_btncolor3: '#a7b19d'
    },
    'agroecology': {
      header_bgcolor: '#f68948', header_title: 'AGROECOLOGY',
      active_color: '#910C3F',
      body_bgcolor: '#f6d4a6', bottom_btncolor1: '#f09b4d',
      bottom_btncolor2: '#f4b866', bottom_btncolor3: '#f8ce74'
    },
    'culture': {
      header_bgcolor: '#ff7063', header_title: 'CULTURE',
      active_color: '#C80039',
      body_bgcolor: '#f7d5c9', bottom_btncolor1: '#ec836b',
      bottom_btncolor2: '#f1a382', bottom_btncolor3: '#f4b990'
    },
    'kids': {
      header_bgcolor: '#e84e6f', header_title: 'KIDS',
      active_color: '#FF5733',
      body_bgcolor: '#f5bac7', bottom_btncolor1: '#e96876',
      bottom_btncolor2: '#ed8d8d', bottom_btncolor3: '#f1a69c'
    },
    'sciences': {
      header_bgcolor: '#9b344a', header_title: 'SCIENCES',
      active_color: '#FF8E1A',
      body_bgcolor: '#cc99a4', bottom_btncolor1: '#9d484f',
      bottom_btncolor2: '#aa706a', bottom_btncolor3: '#bf9490'
    }
  };

  constructor(

  ) { }

  saveLanguageStorage(lang) {
    localStorage.setItem(this.KEY_DEFAULT_LANGUAGE, lang);
  }
  /**
   * get news type info like bgcolor, fontcolor, title, ...
   */
  getNewsTypeInfo(newsType) {
    return this.newsTypeInfoList[newsType];
  }

  getDateFromModel(ts: firestore.Timestamp) {
    if (ts instanceof firestore.Timestamp) {
      return ts.toDate();
    }
    return null;
  }
  /**
   * Converts a NgbDateStruct to a Firestore TimeStamp
   */
  toModel(ngbDate): firestore.Timestamp {
    return firestore.Timestamp.fromDate(ngbDate);
  }

  getLimtString(content, length?, tail?) {
    if (isNaN(length)) { length = 150; }
    if (tail === undefined) {
      tail = '...';
    }

    if (content.length <= length || content.length - tail.length <= length) {
      return content;
    } else {
      return String(content).substring(0, length - tail.length) + tail;
    }
  }
}
