import {Component, EventEmitter, HostBinding, inject, input, Input, Output, Renderer2} from '@angular/core';
import {AvatarCircleComponent} from '../../../common/avatar-circle/avatar-circle.component';
import {ProfileService} from '../../../data/services/profile.service';
import {SvgIconComponent} from '../../../common/svg-icon/svg-icon.component';
import {PostService} from '../../../data/services/post.service';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

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
  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput()
  }

  @Output() created = new EventEmitter();

  r2 = inject(Renderer2);
  postService = inject(PostService);
  profile = inject(ProfileService).me;
  isCommentInput = input<boolean>(false);
  postId = input<number>(0);

  postText = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatePost() {
    if (!this.postText) return;

    if (this.isCommentInput()) {
      firstValueFrom(this.postService.createComment({
        text: this.postText,
        authorId: this.profile()!.id,
        postId: this.postId()
      })).then(() => {
        this.postText = '';
        this.created.emit();
      })

      return;
    }

    firstValueFrom(this.postService.createPost({
      title: 'Пост',
      content: this.postText,
      authorId: this.profile()!.id
    })).then(() => this.postText = '')

  }
}
