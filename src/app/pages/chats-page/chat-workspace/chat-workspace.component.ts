import { Component } from '@angular/core';
import {ChatHeaderComponent} from './chat-header/chat-header.component';
import {ChatMessagesWrapperComponent} from './chat-messages-wrapper/chat-messages-wrapper.component';
import {MessageInputComponent} from '../../../common/message-input/message-input.component';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatHeaderComponent,
    ChatMessagesWrapperComponent,
    MessageInputComponent
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {

}
