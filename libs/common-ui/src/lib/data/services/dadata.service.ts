import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DADATA_TOKEN } from './token';
import { map } from 'rxjs';
import { DaDataSuggestion } from '../interfaces/dadata.interface';

@Injectable({
  providedIn: 'root'
})

export class DaDataService {
  #apiUrl = 'http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
  #http = inject(HttpClient);

  getSuggestions(query: string) {
    return this.#http.post<{suggestions: DaDataSuggestion[]}>(this.#apiUrl, {query}, {
      headers: {
        Authorization: `Token ${DADATA_TOKEN}`
      }
    }).pipe(
      map(res => {
        return res.suggestions;
        // return Array.from(
        //   new Set(res.suggestions.map((suggestion: DaDataSuggestion) => {
        //     return suggestion.data.city
        //   }))
        // )
      }),
    )
  }
}
