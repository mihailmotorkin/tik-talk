import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { ProfileCardComponent } from '../../common/profile-card/profile-card.component';
import { ProfileFiltersComponent } from './profile-filters/profile-filters.component';
import { debounceTime, fromEvent } from 'rxjs';
import { ProfileService } from '@tt/profile';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements AfterViewInit {
  profileService = inject(ProfileService);
  profiles = this.profileService.filteredProfiles;
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
