import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CommentCreateDto,
  Post,
  PostCreateDto,
  PostComment,
} from '../interfaces/post.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload);
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${this.baseApiUrl}post/`);
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.#http.get<Post>(`${this.baseApiUrl}post/${postId}`)
      .pipe(map((res) => res.comments));
  }
}
