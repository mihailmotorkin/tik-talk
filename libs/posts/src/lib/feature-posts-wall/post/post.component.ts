import { Component, inject, input, OnInit, signal } from '@angular/core';
import { PostInputComponent } from '../../ui';
import { CommentComponent } from '../../ui';
import { firstValueFrom } from 'rxjs';
import { Post, PostComment, PostService } from '../../data';
import { AvatarCircleComponent, SvgIconComponent, TimeAgoPipe } from '@tt/common-ui';
import { ProfileService } from '@tt/profile';

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
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  postService = inject(PostService);
  profile = inject(ProfileService).me;

  post = input<Post>();
  comments = signal<PostComment[]>([]);

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  onCreateComment(commentText: string): void {
    if (!commentText) return;

    firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.profile()!.id,
        postId: this.post()!.id,
      })
    ).then(async () => {
      const postComments = await firstValueFrom(
        this.postService.getCommentsByPostId(this.post()!.id)
      );
      this.comments.set(postComments);
    });
  }
}
