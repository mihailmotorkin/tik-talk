import { inject, Injectable } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectProfileFilters, selectProfilePageable } from './selectors';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);
  store = inject(Store);

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        profileActions.filterEvents,
        profileActions.setPage
      ),
      withLatestFrom(
        this.store.select(selectProfileFilters),
        this.store.select(selectProfilePageable)
      ),
      switchMap(([_, filters, pageable]) => {
        return this.profileService.filterProfiles({
          ...pageable,
          ...filters
        });
      }),
      map(res => profileActions.profilesLoaded({profiles: res.items}))
    );
  })
}
