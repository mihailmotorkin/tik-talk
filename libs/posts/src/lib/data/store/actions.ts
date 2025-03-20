import { createActionGroup, props } from '@ngrx/store';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface';

export const postActions = createActionGroup({
  source: 'posts',
  events: {
    'get posts': props<{ posts: Post[] }>(),
    'loaded posts': props<{ posts: Post[] }>(),
    'create post': props<{ post: PostCreateDto }>(),

    'get comments by post id': props<{ postId: number }>(),
    'loaded comments': props<{ comments: PostComment[] }>(),
    'create comment': props<{ comment: CommentCreateDto }>(),
  }
})
