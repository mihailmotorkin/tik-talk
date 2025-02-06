import {AfterViewInit, Component, ElementRef, inject, input, Renderer2} from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {MessageInputComponent} from '../../../../common/message-input/message-input.component';
import {ChatsService} from '../../../../data/services/chats.service';
import {Chat} from '../../../../data/interfaces/chats.interface';
import {debounceTime, firstValueFrom, fromEvent} from 'rxjs';

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
export class ChatMessagesWrapperComponent implements AfterViewInit {
  chatService = inject(ChatsService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);

  chat = input.required<Chat>();
  messages = this.chatService.activeChatMessages;

  ngAfterViewInit() {
    this.resizeChat()

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
      )
      .subscribe(() => this.resizeChat())
  }

  resizeChat() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText));

    await firstValueFrom(this.chatService.getChatsById(this.chat().id));
  }
}
