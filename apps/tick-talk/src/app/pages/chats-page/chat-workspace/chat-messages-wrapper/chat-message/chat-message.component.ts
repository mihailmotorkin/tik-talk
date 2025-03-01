import { Component, HostBinding, input } from '@angular/core';
import { Message } from '../../../../../data/interfaces/chats.interface';
import { AvatarCircleComponent } from '../../../../../../../../../libs/common-ui/src/lib/components/avatar-circle/avatar-circle.component';
import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  message = input.required<Message>();

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }

  getLocalTime(utcDate: string): string {
    return DateTime.fromISO(utcDate, { zone: 'utc' })
      .toLocal()
      .toFormat('HH:mm');
  }
}
