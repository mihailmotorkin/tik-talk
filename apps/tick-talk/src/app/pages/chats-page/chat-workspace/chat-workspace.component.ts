import { Component, inject } from '@angular/core';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatMessagesWrapperComponent } from './chat-messages-wrapper/chat-messages-wrapper.component';
import { MessageInputComponent } from '../../../common/message-input/message-input.component';
import { ActivatedRoute } from '@angular/router';
import { ChatsService } from '../../../data/services/chats.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [ChatHeaderComponent, ChatMessagesWrapperComponent, AsyncPipe],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  chatService = inject(ChatsService);

  activeChat$ = this.route.params.pipe(
    switchMap(({ id }) => this.chatService.getChatsById(id))
  );
}
