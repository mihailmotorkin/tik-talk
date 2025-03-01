import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/profile';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [AvatarCircleComponent, FormsModule, SvgIconComponent],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  @Output() created = new EventEmitter<string>();
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  @HostBinding('class.chat-message-input')
  get isChatInput() {
    return this.isChatMessageInput();
  }

  r2 = inject(Renderer2);
  me = inject(ProfileService).me;
  isChatMessageInput = input<boolean>(false);

  postText = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreate() {
    if (!this.postText) return;

    this.created.emit(this.postText);
    this.r2.setStyle(this.textarea.nativeElement, 'height', 'auto');
    this.postText = '';
  }
}
