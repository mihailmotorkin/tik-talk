import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Address, Feature, MajorType } from './forms.interface.ts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsMockServiceTsService } from './forms-mock.service.ts.service';
import { KeyValuePipe } from '@angular/common';
import { NameValidator } from './name.validator';

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
  });
}

function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith(forbiddenLetter)
      ? {
          startsWith: {
            message: `${forbiddenLetter} - не подходящая буква для этого поля!`,
          },
        }
      : null;
  };
}

function validateDateRange({
  fromControlName,
  toControlName,
}: {
  fromControlName: string;
  toControlName: string;
}) {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if (!fromControl || !toControl) return null;

    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    if (fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({
        dateRange: {
          message: 'Дата начала не может быть позднее даты окончания',
        },
      });
      return {
        dateRange: {
          message: 'Дата начала не может быть позднее даты окончания',
        },
      };
    }
    return null;
  };
}

@Component({
    selector: 'app-forms',
    imports: [ReactiveFormsModule, KeyValuePipe],
    templateUrl: './forms.component.html',
    styleUrl: './forms.component.scss'
})
export class FormsComponent {
  protected readonly MajorType = MajorType;

  mockService = inject(FormsMockServiceTsService);
  nameValidator = inject(NameValidator);

  features: Feature[] = [];

  form = new FormGroup({
    type: new FormControl<MajorType>(MajorType.FRONTEND, Validators.required),
    name: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur',
    }),
    lastName: new FormControl<string>(''),
    email: new FormControl<string>(''),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' })
    ),
  });

  constructor() {
    this.mockService
      .getAddress()
      .pipe(takeUntilDestroyed())
      .subscribe((addresses) => {
        // while(this.form.controls.addresses.length > 0) {
        //   this.form.controls.addresses.removeAt(0);
        // }
        this.form.controls.addresses.clear();

        for (const address of addresses) {
          // this.form.controls.addresses.push(getAddressForm(address));
          this.form.controls.addresses.insert(0, getAddressForm(address));
        }

        // this.form.controls.addresses.setControl(1, getAddressForm());

        // Взять контролл по определенному индексу
        // this.form.controls.addresses.at(0)
      });

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          );
        }
      });

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.form.controls.name.clearValidators();

        if (value === MajorType.FRONTEND) {
          //todo: узнать почему не отрабатывает условие в шаблоне hasError('required')
          // и кнопка не дизейблится. Явно не задается валидация динамически.
          this.form.controls.lastName.setValidators(Validators.required);
        }
      });

    const formPatch = {
      name: 'Alesha',
      lastName: 'Popovich',
    };

    // this.form.patchValue(formPatch);
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAsTouched();
    this.form.updateValueAndValidity();

    console.log(this.form.valid);
    console.log(this.form.value);

    if (this.form.invalid) return;

    console.log(this.form.valid);

    // this.form.reset({
    //   name: 'John',
    //   lastName: 'Doe'
    // })
  }

  addAddress() {
    this.form.controls.addresses.insert(0, getAddressForm());
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, { emitEvent: false });
  }

  sort = () => 0;
}
