import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../../../../../libs/common-ui/src/lib/components/avatar-circle/avatar-circle.component';
import { LastMessageResponse } from '../../../data/interfaces/chats.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageResponse>();
}
