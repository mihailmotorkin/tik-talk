import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Post, PostComment} from '../../../data/interfaces/post.interface';
import {AvatarCircleComponent} from '../../../common/avatar-circle/avatar-circle.component';
import {SvgIconComponent} from '../../../common/svg-icon/svg-icon.component';
import {PostInputComponent} from '../post-input/post-input.component';
import {CommentComponent} from './comment/comment.component';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom} from 'rxjs';
import {TimeAgoPipe} from '../../../helpers/pipes/time-ago.pipe';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    TimeAgoPipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  postService = inject(PostService);

  post = input<Post>();
  comments = signal<PostComment[]>([])

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated() {
    const postComments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id));
    this.comments.set(postComments);
  }
}
