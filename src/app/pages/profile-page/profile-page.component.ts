import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ProfileHeaderComponent} from '../../common/profile-header/profile-header.component';
import {ProfileService} from '../../data/services/profile.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {firstValueFrom, map, switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {SvgIconComponent} from '../../common/svg-icon/svg-icon.component';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {PostFeedComponent} from './post-feed/post-feed.component';
import {ChatsService} from '../../data/services/chats.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  chatsService = inject(ChatsService);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersShortList(5);
  isMyPage$$ = signal(false);

  profile$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        this.isMyPage$$.set(id === 'me' || id === this.profileService.me()?.id);
        if (id === 'me') return this.me$;

        return this.profileService.getAccount(id);
      })
    );

  async sendMessage(userId: number) {
    firstValueFrom(this.chatsService.createChat(userId))
      .then((res) => {
        this.router.navigate(['/chats', res.id]);
      })
  }
}
