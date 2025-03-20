import { inject, Injectable } from '@angular/core';
import { PostService } from '../services/post.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { postActions } from './actions';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsEffects {
  postService = inject(PostService);
  actions$ = inject(Actions);

  fetchPosts = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.getPosts),
      switchMap(() => {
        return this.postService.fetchPosts()
      }),
      map((posts) => postActions.loadedPosts({posts}))
    )
  })

  createPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createPost),
      switchMap(({ post }) => {
        return this.postService.createPost({
          title: post.title,
          content: post.content,
          authorId: post.authorId,
        });
      }),
      map(() => postActions.getPosts({posts: []}))
    )
  })

  getCommentsByPostId = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.getCommentsByPostId),
      switchMap(({ postId }) => {
        return this.postService.getCommentsByPostId(postId)
      }),
      map(comments => postActions.loadedComments({ comments }))
    )
  })

  createComment = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createComment),
      switchMap(({ comment }) => {
        return this.postService.createComment({
          text: comment.text,
          authorId: comment.authorId,
          postId: comment.postId,
        });
      }),
      map((postId) => postActions.getCommentsByPostId(postId))
    )
  })

}
