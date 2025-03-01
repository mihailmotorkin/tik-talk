import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { PostInputComponent } from '../../ui';
import { PostService } from '../../data';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { Post } from '../../data';
import { PostComponent } from '../post/post.component';
import { GlobalStoreService } from '@tt/shared';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit {
  postService = inject(PostService);
  profile = inject(GlobalStoreService).me;
  post = input<Post>();
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  feed = this.postService.posts;

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.resizeFeed());
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  onCreatedPost(postText: string) {
    if (!postText) return;

    firstValueFrom(
      this.postService.createPost({
        title: 'Пост',
        content: postText,
        authorId: this.profile()!.id,
      })
    );
  }
}
