import {Component} from '@angular/core';
import {NgClass, TitleCasePipe} from '@angular/common';
import {MenuDrawer} from '../menu-drawer/menu-drawer';
import {ChatBox} from './drawers/chat-box/chat-box';

@Component({
  selector: 'app-profile-drawer',
  imports: [
    NgClass,
    MenuDrawer,
    TitleCasePipe,
    ChatBox,
  ],
  templateUrl: './profile-drawer.html',
  standalone: true,
  styleUrl: './profile-drawer.scss'
})
export class ProfileDrawer {

  isNotificationsOpen = false;
  isMessagingOpen = false;


  isChatOpen: boolean = false;
  chatWith: string;

  toggleChat(chatWith: string) {
    this.isChatOpen = !this.isChatOpen;
    if (this.chatWith !== chatWith) this.isChatOpen = true;
    if (this.isChatOpen) this.chatWith = chatWith;
  }


}
