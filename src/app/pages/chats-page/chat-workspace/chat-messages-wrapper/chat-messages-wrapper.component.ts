import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {MessageInputComponent} from '../../../../common/message-input/message-input.component';
import {ChatsService} from '../../../../data/services/chats.service';
import {Chat} from '../../../../data/interfaces/chats.interface';
import {debounceTime, firstValueFrom, fromEvent, timer} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-messages-wrapper',
  standalone: true,
  imports: [
    ChatMessageComponent,
    MessageInputComponent,
  ],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss'
})
export class ChatMessagesWrapperComponent implements AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLElement>;

  chatService = inject(ChatsService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  destroyRef = inject(DestroyRef);

  chat = input.required<Chat>();
  messages = this.chatService.activeChatMessages;

  ngAfterViewInit() {
    this.resizeChat()

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.resizeChat())

    timer(0, 5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.messages.set(this.chatService.activeChatMessages()));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  resizeChat() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  // Прокручиваем контейнер сообщений в самый низ
  private scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText));

    await firstValueFrom(this.chatService.getChatsById(this.chat().id));
  }
}
