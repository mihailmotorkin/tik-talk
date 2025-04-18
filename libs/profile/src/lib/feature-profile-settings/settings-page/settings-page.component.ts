import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProfileHeaderComponent, AvatarUploadComponent } from '../../ui'
import { GlobalStoreService } from '@tt/shared';
import { ProfileService } from '../../data';
import { AddressInputComponent, StackInputComponent } from '@tt/common-ui';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    AvatarUploadComponent,
    AsyncPipe,
    StackInputComponent,
    AddressInputComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  #globalStoreService = inject(GlobalStoreService);
  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: [''],
    city: [null]
  });

  profile$ = toObservable(this.#globalStoreService.me);

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.#globalStoreService.me(),
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
      })
    );
  }

  // splitStack(stack: string | null | string[] | undefined): string[] {
  //   if (!stack) return [];
  //   if (Array.isArray(stack)) return stack;
  //
  //   return stack.split(',');
  // }
  //
  // mergeStack(stack: string | null | string[] | undefined): any {
  //   if (!stack) return '';
  //   if (Array.isArray(stack)) return stack.join(',');
  //
  //   return stack;
  // }
}
