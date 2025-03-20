import { Post, PostComment } from '../interfaces/post.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './actions';

export interface PostState {
  posts: Post[];
  comments: PostComment[];
}

export const initialState: PostState = {
  posts: [],
  comments: []
}

export const postFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialState,
    on(postActions.loadedPosts, (state, payload) => {
      return {
        ...state,
        posts: payload.posts,
      }
    }),
    on(postActions.loadedComments, (state, payload) => {
      return {
        ...state,
        comments: payload.comments,
      }
    }),
  )
})
