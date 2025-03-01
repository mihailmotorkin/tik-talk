import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Chat,
  LastMessageResponse,
  Message,
  SortedMessageByDate,
} from '../interfaces/chats.interface';
import { map } from 'rxjs';
import { DateTime } from 'luxon';
import { ProfileService } from '@tt/profile';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<SortedMessageByDate[]>([]);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

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

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }

  private sortedMessagesByDate(messages: Message[]): SortedMessageByDate[] {
    // const groupedMessages: { [key: string]: Message[] } = {};
    // messages.forEach((message) => {
    //   const messagesDate = this.formatMessageDate(message.createdAt)
    //
    //   if(!groupedMessages.hasOwnProperty(messagesDate)) {
    //     groupedMessages[messagesDate] = [];
    //   }
    //   groupedMessages[messagesDate].push(message);
    // })

    const groupedMessages = messages.reduce<Record<string, Message[]>>(
      (acc, message) => {
        const messagesDate = this.formatMessageDate(message.createdAt);
        acc[messagesDate] = acc[messagesDate] || [];
        acc[messagesDate].push(message);
        return acc;
      },
      {}
    );

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
