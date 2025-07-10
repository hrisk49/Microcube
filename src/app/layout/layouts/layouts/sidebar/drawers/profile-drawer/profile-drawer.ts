import {Component, signal} from '@angular/core';
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


  isChatOpen = signal(false);
  chatWith: string;

  toggleChat(chatWith: string) {
    this.isChatOpen.set(!this.isChatOpen());
    if (this.chatWith !== chatWith) this.isChatOpen.set(true);
    if (this.isChatOpen()) this.chatWith = chatWith;
  }

  closeChatFromChild() {
    this.isChatOpen.set(false);
  }


}
