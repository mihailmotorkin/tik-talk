import {Component, input} from '@angular/core';
import {PostComment} from '../../../../data/interfaces/post.interface'
import {AvatarCircleComponent} from '../../../../common/avatar-circle/avatar-circle.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  comment = input<PostComment>();

}
