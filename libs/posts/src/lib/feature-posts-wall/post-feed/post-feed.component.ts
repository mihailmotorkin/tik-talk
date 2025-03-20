import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { PostInputComponent } from '../../ui';
import { postActions } from '../../data';
import { debounceTime, fromEvent } from 'rxjs';
import { PostComponent } from '../post/post.component';
import { GlobalStoreService } from '@tt/shared';
import { Store } from '@ngrx/store';
import { selectAllPosts } from '../../data/store/selectors';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit {
  profile = inject(GlobalStoreService).me;
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  store = inject(Store);

  feed = this.store.selectSignal(selectAllPosts);

  constructor() {
    this.store.dispatch(postActions.getPosts({posts: []}));
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.resizeFeed());
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  onCreatedPost(postText: string) {
    if (!postText) return;

    this.store.dispatch(postActions.createPost({
      post: {
        title: 'Пост',
        content: postText,
        authorId: this.profile()!.id,
      }
    }));
  }
}
