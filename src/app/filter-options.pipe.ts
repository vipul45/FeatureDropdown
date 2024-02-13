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

    const searchTerm = searchInput.replace(/\s/g, '').toLowerCase(); // Remove spaces from search input
    return options.filter(option => option.text.replace(/\s/g, '').toLowerCase().includes(searchTerm)); // Remove spaces from option text before comparison
  }
}