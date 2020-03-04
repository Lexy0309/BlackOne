import { Pipe, PipeTransform } from '@angular/core';
const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');
const enLocale = require('date-fns/locale/en');
const frLocale = require('date-fns/locale/fr');

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const selectedLanguage = localStorage.getItem('BLACKSONE_DEFAULT_LANGUAGE');
    return distanceInWordsToNow(new Date(value), { addSuffix: true, locale: selectedLanguage === 'en' ? enLocale : frLocale});
  }

}
