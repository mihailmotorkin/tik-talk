import {Component, inject, input, signal} from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {MessageInputComponent} from '../../../../common/message-input/message-input.component';
import {ChatsService} from '../../../../data/services/chats.service';
import {Chat, Message} from '../../../../data/interfaces/chats.interface';
import {firstValueFrom, tap} from 'rxjs';

@Component({
  selector: 'app-chat-messages-wrapper',
  standalone: true,
  imports: [
    ChatMessageComponent,
    MessageInputComponent
  ],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss'
})
export class ChatMessagesWrapperComponent {
  chatService = inject(ChatsService);

  chat = input.required<Chat>();
  messages = signal<Message[]>([]);

  ngOnInit(): void {
    this.messages.set(this.chat().messages);
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText));

    const chat = await firstValueFrom(this.chatService.getChatsById(this.chat().id));
    this.messages.set(chat.messages);
  }
}
