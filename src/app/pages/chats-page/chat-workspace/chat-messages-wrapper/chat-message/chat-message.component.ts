import {Component, input} from '@angular/core';
import {Message} from '../../../../../data/interfaces/chats.interface';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  message = input.required<Message>()
}
