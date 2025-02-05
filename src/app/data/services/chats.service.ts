import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat, LastMessageResponse, Message} from '../interfaces/chats.interface';
import {ProfileService} from './profile.service';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageResponse[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatsById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`)
      .pipe(
        map(chat => {
          return {
            ...chat,
            companion: chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          }
        })
      )
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(`${this.messageUrl}send/${chatId}`, {}, {
      params: {
        message
      }
    });
  }

}
