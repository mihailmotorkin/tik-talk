import { Component } from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';

@Component({
  selector: 'app-chat-messages-wrapper',
  standalone: true,
  imports: [
    ChatMessageComponent
  ],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss'
})
export class ChatMessagesWrapperComponent {

}
