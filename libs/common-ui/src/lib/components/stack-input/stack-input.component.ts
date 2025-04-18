import { Component, forwardRef, HostBinding, HostListener, signal } from '@angular/core';
import { SvgIconComponent } from '@tt/common-ui';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'tt-stack-input',
  imports: [
    SvgIconComponent,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => StackInputComponent),
    }
  ]
})
export class StackInputComponent implements ControlValueAccessor {
  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.innerInput) { return; }

    this.value$.next([...this.value$.value, this.innerInput]);
    this.innerInput = '';
    this.onChange(this.value$.value);
  }

  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this.#disabled;
  }

  value$ = new BehaviorSubject<string[]>([]);

  #disabled = false;
  innerInput = '';

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.#disabled = isDisabled;
  }

  writeValue(stack: string[] | null) {
    if (!stack) {
      this.value$.next([]);
      return;
    }

    this.value$.next(stack);
  }

  onChange(value: string[] | null) {

  }

  onTouched() {

  }

  onTagDelete(index: number) {
    const tags = this.value$.value;
    tags.splice(index, 1);
    this.value$.next(tags);
    this.onChange(this.value$.value);
  }
}
