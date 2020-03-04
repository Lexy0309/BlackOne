
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { Events } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { NotifyService } from 'src/app/services/notify.service';
import { MessageService } from 'src/app/services/message.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-tab-messages',
  templateUrl: './tab-messages.page.html',
  styleUrls: ['./tab-messages.page.scss'],
})
export class TabMessagesPage implements OnInit {

  isLoading = false;
  myProfile: any;
  buddylist = [];
  isLoadedAllBuddies = false;
  blankItems = ['1', '2', '3', '1', '2', '3'];
  constructor(
    public route: Router,
    private usersService: UserService,
    private notifyService: NotifyService,
    private messageService: MessageService,
    public events: Events, public zone: NgZone,
    public settingService: SettingService,
  ) {
  }

  async ngOnInit() {
    this.myProfile = JSON.parse(localStorage.getItem(this.settingService.KEY_USER));
  }

  ionViewWillEnter() {
    this.getFriends();
  }

  getFriends() {
    this.buddylist = [];
    this.isLoadedAllBuddies = false;
    this.usersService.getBuddyList(this.myProfile.uid).then(buddylist => {
      this.buddylist = buddylist;
      this.isLoadedAllBuddies = true;
      this.updateBuddyInfo();
    }).catch(err => {
      this.isLoadedAllBuddies = true;
      this.notifyService.modalMsg(err, 'Error');
    });
  }
  updateBuddyInfo() {
    this.usersService.updateBuddyInfo(this.myProfile.uid);
    this.events.subscribe('subscribe_lastmessages', (buddyLastMessages) => {
      this.zone.run(() => {
        this.buddylist.map((buddy) => {
          const chagedLastMsg = this.getChagedLastMsg(buddy.uid, buddyLastMessages);
          if (chagedLastMsg.lastmessage) {
            buddy.lastmessage = chagedLastMsg.lastmessage;
            buddy.newMessage = chagedLastMsg.isNew;
          }
        })
      });
    });
  }
  getChagedLastMsg(buddy_uid, buddyLastMessages) {
    let result = {
      lastmessage: '',
      isNew: ''
    };
    buddyLastMessages.forEach(lastchagmsg => {
      if (lastchagmsg.buddy_uid == buddy_uid) {
        result = {
          lastmessage: lastchagmsg.lastmessage_info.lastmessage,
          isNew: lastchagmsg.lastmessage_info.newMessage
        };
      }
    });
    return result;
  }

  goforChat(buddy) {
    this.route.navigate(['/buddy-message', { buddy: JSON.stringify(buddy), backpage: 'tab-messages' }]);
  }

}
