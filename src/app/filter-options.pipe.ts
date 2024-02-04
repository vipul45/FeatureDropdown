import { Pipe, PipeTransform } from '@angular/core';
import { DropdownOption } from './util/dropdown-option';

@Pipe({
  name: 'filterOptions'
})
export class FilterOptionsPipe implements PipeTransform {
  transform(options: DropdownOption[], searchInput: string): DropdownOption[] {
    if (!searchInput || searchInput.trim() === '') {
      return options;
    }

    const searchTerm = searchInput.toLowerCase();
    return options.filter(option => option.text.toLowerCase().includes(searchTerm));
  }
}