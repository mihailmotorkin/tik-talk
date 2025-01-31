import {AfterViewInit, Component, ElementRef, inject, input, Renderer2} from '@angular/core';
import {PostInputComponent} from '../post-input/post-input.component';
import {PostComponent} from '../post/post.component';
import {PostService} from '../../../data/services/post.service';
import {debounceTime, firstValueFrom, fromEvent} from 'rxjs';
import {ProfileService} from '../../../data/services/profile.service';
import {Post} from '../../../data/interfaces/post.interface';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit {
  postService = inject(PostService);
  profile = inject(ProfileService).me;
  post = input<Post>();
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  feed = this.postService.posts;

  constructor() {
    firstValueFrom(this.postService.fetchPosts())
  }

  ngAfterViewInit() {
    this.resizeFeed()

    fromEvent(window, 'resize').pipe(
      debounceTime(300)
    ).subscribe( () => this.resizeFeed())
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  onCreatedPost(postText: string) {
    if (!postText) return;

    firstValueFrom(this.postService.createPost({
      title: 'Пост',
      content: postText,
      authorId: this.profile()!.id
    }))

  }
}
