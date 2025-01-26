import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value) {
      return 'Неверная дата';
    }

    try {
      const date = DateTime.fromISO(value.toString(), { zone: 'utc'});
      if (!date.isValid) {
        return 'Ошибка обработки даты';
      }

      return date.toRelative()
    } catch {
      return 'Ошибка обработки даты';
    }
  }

}
