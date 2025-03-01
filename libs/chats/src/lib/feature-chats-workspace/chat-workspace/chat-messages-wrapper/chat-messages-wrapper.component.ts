import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatsService, Chat } from '../../../data';
import { debounceTime, firstValueFrom, fromEvent, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageInputComponent } from '../../../ui';

@Component({
  selector: 'app-chat-messages-wrapper',
  standalone: true,
  imports: [ChatMessageComponent, MessageInputComponent],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss',
})
export class ChatMessagesWrapperComponent implements AfterViewInit {
  chatService = inject(ChatsService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  destroyRef = inject(DestroyRef);

  chat = input.required<Chat>();
  messages = this.chatService.activeChatMessages;

  ngAfterViewInit() {
    this.resizeChat();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resizeChat());

    timer(0, 5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async () => {
        await this.refreshMessages();
      });
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatService.sendMessage(this.chat().id, messageText)
    );
    await this.refreshMessages(true);
  }

  async refreshMessages(scrollBottom = false) {
    await firstValueFrom(this.chatService.getChatsById(this.chat().id));

    if (scrollBottom) {
      this.scrollBottom();
    }
  }

  private resizeChat() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  private scrollBottom() {
    const element = this.hostElement.nativeElement;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth',
    });
  }
}
