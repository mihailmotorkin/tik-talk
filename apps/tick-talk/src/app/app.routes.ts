import { Routes } from '@angular/router';
import { LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent, SearchPageComponent, profileFeature, ProfileEffects } from '@tt/profile';
import { LayoutComponent } from '@tt/layout';
import { canActivateAuth } from '@tt/auth';
import { SettingsPageComponent } from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { FormsComponent } from './experimental/forms/forms.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
      { path: 'form', component: FormsComponent },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
];
