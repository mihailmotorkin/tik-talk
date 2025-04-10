import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { CommonModule } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterModule } from '@angular/router';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { ProfileService } from '@tt/profile';
import { GlobalStoreService } from '@tt/shared';
import { ChatsService, isErrorMessage } from '@tt/chats';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-sidebar',
    imports: [
        SvgIconComponent,
        CommonModule,
        SubscriberCardComponent,
        RouterModule,
        ImgUrlPipe,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  #globalStoreService = inject(GlobalStoreService);
  chatsService = inject(ChatsService);
  destroyRef = inject(DestroyRef);

  subscribers$ = this.profileService.getSubscribersShortList();
  wsSubscribe$!: Subscription;


  me = this.#globalStoreService.me;

  unreadMessages = this.chatsService.unreadMessages;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
    {
      label: 'Заполни форму',
      icon: 'form',
      link: 'form',
    },
  ];

  async reconnect() {
    console.log('reconnecting...');
    await firstValueFrom(this.profileService.getMe());
    await firstValueFrom(timer(2000));
    this.connectWS();
  }

  connectWS() {
    this.wsSubscribe$?.unsubscribe();

    this.wsSubscribe$ = this.chatsService.connectWS()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(message => {
        if (isErrorMessage(message)) {
          console.log('error', message);
          this.reconnect();
        }
      })
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
    this.connectWS();
  }
}
