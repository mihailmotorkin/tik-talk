import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { Chat, LastMessageResponse, Message, SortedMessageByDate } from '../../../lib/data';
import { GlobalStoreService } from '@tt/shared';
import { ChatWSService } from '../interfaces/chat-ws-service.interface';
import { AuthService } from '@tt/auth';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatWSRxjsService } from './chat-ws-rxjs.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  #authService = inject(AuthService);
  me = inject(GlobalStoreService).me;

  wsAdapter: ChatWSService = new ChatWSRxjsService();

  unreadMessages = signal<number>(0);
  activeChatMessages = signal<SortedMessageByDate[]>([]);
  activeChat = signal<Chat | null>(null);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;

  connectWS() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWSMessage>;
  }

  handleWSMessage = (message: ChatWSMessage) => {
    console.log(message);
    if (!('action' in message)) { return; }

    if (isUnreadMessage(message)) {
      this.unreadMessages.set(message.data.count);
    }

    if (isNewMessage(message)) {
      const me = this.me();
      const activeChat = this.activeChat();
      const isoDate = DateTime.fromFormat(
        message.data.created_at, 'yyyy-MM-dd HH:mm:ss', { zone: 'utc' }
      ).toISO()!;

      if (!me || !activeChat) { return; }

      const newMessage = {
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: isoDate,
        isRead: false,
        isMine: message.data.author === me.id,
        user: activeChat.userFirst.id === message.data.author
          ? activeChat.userFirst
          : activeChat.userSecond,
      };
      const newGropedMessages = this.sortedMessagesByDate([
        ...this.activeChatMessages().flatMap(group => group.messages),
        newMessage
      ]);

      this.activeChatMessages.set(newGropedMessages);
    }
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageResponse[]>(
      `${this.chatsUrl}get_my_chats/`
    );
  }

  getChatsById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        this.activeChat.set(chat);

        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        this.activeChatMessages.set(this.sortedMessagesByDate(patchedMessages));

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  private sortedMessagesByDate(messages: Message[]): SortedMessageByDate[] {

    const groupedMessages = messages.reduce<Record<string, Message[]>>(
      (acc, message) => {
        const messagesDate = this.formatMessageDate(message.createdAt);
        acc[messagesDate] = acc[messagesDate] || [];
        acc[messagesDate].push(message);
        return acc;
      }, {});

    return Object.keys(groupedMessages).map((date) => ({
      messagesDate: date,
      messages: groupedMessages[date],
    }));
  }

  private formatMessageDate(createdAt: string): string {
    const messageDate = DateTime.fromISO(createdAt, { zone: 'utc' }).toLocal();
    const now = DateTime.local();

    if (messageDate.hasSame(now, 'day')) {
      return 'Сегодня';
    } else if (messageDate.hasSame(now.minus({ days: 1 }), 'day')) {
      return 'Вчера';
    } else {
      return messageDate.toFormat('dd.MM.yyyy');
    }
  }
}
