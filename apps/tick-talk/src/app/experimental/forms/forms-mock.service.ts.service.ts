import { Injectable } from '@angular/core';
import { Address, Feature } from './forms.interface.ts';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormsMockServiceTsService {
  addresses: Observable<Address[]> = of([
    {
      city: 'Москва',
      street: 'Ленина',
      building: 123,
      apartment: 33,
    },
    {
      city: 'Санкт Петербург',
      street: 'Пушкина',
      building: 234,
      apartment: 22,
    },
  ]);

  features: Observable<Feature[]> = of([
    {
      code: 'lift',
      label: 'Подъем на этаж',
      value: true,
    },
    {
      code: 'strong-package',
      label: 'Усиленная упаковка',
      value: true,
    },
    {
      code: 'fast',
      label: 'Ускоренная доставка',
      value: false,
    },
  ]);

  getAddress() {
    return this.addresses;
  }

  getFeatures() {
    return this.features;
  }
}
