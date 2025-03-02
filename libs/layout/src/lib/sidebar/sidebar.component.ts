import { Component, inject, OnInit } from '@angular/core';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { CommonModule } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '@tt/profile';
import { GlobalStoreService } from '@tt/shared';

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

  subscribers$ = this.profileService.getSubscribersShortList();

  me = this.#globalStoreService.me;

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

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
