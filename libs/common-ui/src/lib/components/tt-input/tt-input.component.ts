import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tt-input',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent),
    }
  ]
})
export class TtInputComponent implements ControlValueAccessor {
  type = input<'text' | 'password'>('text')
  placeholder = input<string>()

  disabled = signal<boolean>(false);

  onChange: any;
  onTouched: any;

  value: string | null = null;

  writeValue(value: string | null) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  onModelChange(value: string | null) {
    this.onChange(value);
  }
}
