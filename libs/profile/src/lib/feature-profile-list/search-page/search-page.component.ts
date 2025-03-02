import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { debounceTime, fromEvent } from 'rxjs';
import { selectFilteredProfiles } from '../../data';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-search-page',
    imports: [ProfileCardComponent, ProfileFiltersComponent],
    templateUrl: './search-page.component.html',
    styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements AfterViewInit {
  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);

  ngAfterViewInit() {
    this.resizeFilters();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.resizeFilters());
  }

  resizeFilters() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
