import { Component, inject } from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatsService } from '../../data';
import { AsyncPipe } from '@angular/common';
import { SvgIconComponent } from '@tt/common-ui';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs';
import { isEmptyString } from '@tt/shared';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent {
  chatService = inject(ChatsService);
  filterChatsControl = new FormControl('');

  chats$ = this.chatService.getMyChats().pipe(
    switchMap((chats) => {
      return this.filterChatsControl.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map((inputValue) => {
          if (!inputValue || isEmptyString(inputValue)) return chats;

          return chats.filter((chat) => {
            return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          });
        })
      );
    })
  );
}
