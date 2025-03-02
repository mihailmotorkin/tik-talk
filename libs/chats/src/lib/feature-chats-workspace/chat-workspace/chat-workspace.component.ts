import { Component, inject } from '@angular/core';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatMessagesWrapperComponent } from './chat-messages-wrapper/chat-messages-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatsService } from '../../data';
import { debounceTime, filter, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-chat-workspace',
    imports: [ChatHeaderComponent, ChatMessagesWrapperComponent, AsyncPipe],
    templateUrl: './chat-workspace.component.html',
    styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  chatsService = inject(ChatsService);

  activeChat$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'new') {
        return this.route.queryParams.pipe(
          filter(({ userId }) => userId),
          switchMap(({ userId }) => {
            return this.chatsService.createChat(userId).pipe(
              switchMap(chat => {
                this.router.navigate(['/chats', chat.id]);
                return of(null);
              })
            );
          }),
        )
      }

      return this.chatsService.getChatsById(id)
    })
  );
}
