import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {AvatarCircleComponent} from '../../../common/avatar-circle/avatar-circle.component';
import {ProfileService} from '../../../data/services/profile.service';
import {SvgIconComponent} from '../../../common/svg-icon/svg-icon.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  @Output() created = new EventEmitter();
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput()
  }

  profile = inject(ProfileService).me;
  r2 = inject(Renderer2);
  isCommentInput = input<boolean>(false);

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
