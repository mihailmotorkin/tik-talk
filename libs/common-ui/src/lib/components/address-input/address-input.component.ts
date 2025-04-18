import { Component, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TtInputComponent } from '../tt-input/tt-input.component';
import { DaDataService } from '../../data';
import { debounceTime, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DaDataSuggestion } from '../../data/interfaces/dadata.interface';

@Component({
  selector: 'tt-address-input',
  imports: [
    TtInputComponent,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent),
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor {
  innerSearchControl = new FormControl();
  #daDataService = inject(DaDataService);
  isDropDownOpened = signal<boolean>(true);

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl(''),
  })

  suggestions$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(500),
    switchMap((value) => {
      return this.#daDataService.getSuggestions(value)
        .pipe(
          tap(res => {
            this.isDropDownOpened.set(!!res.length);
          })
        )
    })
  )


  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(city: string | null) {
    this.innerSearchControl.patchValue(city, {
      emitEvent: false
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value: any) {}
  onTouched() {}

  onSuggestionPick(suggest: DaDataSuggestion) {
    this.isDropDownOpened.set(false);
    // this.innerSearchControl.patchValue(city, {
    //   emitEvent: false
    // });
    // this.onChange(city);

    this.addressForm.patchValue({
      city: suggest.data.city,
      street: suggest.data.street,
      building: suggest.data.house
    })
  }
}
