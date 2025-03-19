import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { profileActions, selectProfileFilters } from '../../data';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-profile-filters',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './profile-filters.component.html',
    styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent {
  fb = inject(FormBuilder);
  store = inject(Store);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(500),
        takeUntilDestroyed()
      )
      .subscribe(formValue => {
        this.store.dispatch(profileActions.filterEvents({filters: formValue}));
      });

    const filters = this.store.selectSignal(selectProfileFilters)();
    this.searchForm.patchValue(filters);
  }
}
