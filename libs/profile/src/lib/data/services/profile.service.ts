import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { GlobalStoreService, Pageble } from '@tt/shared';
import { Profile } from '@tt/interfaces/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  #globalStoreService = inject(GlobalStoreService);

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.http
      .get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(tap((res) => {
        this.#globalStoreService.me.set(res);
      }));
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
  }

  getSubscribersShortList(subsAmount: number = 4) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(map((res) => res.items.slice(1, subsAmount)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch(`${this.baseApiUrl}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<Profile>(
      `${this.baseApiUrl}account/upload_image`,
      formData
    );
  }

  filterProfiles(params: Record<string, any>) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, { params })
  }
}
