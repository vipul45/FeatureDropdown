import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOptions'
})
export class FilterOptionsPipe implements PipeTransform {
  transform(options: string[], searchInput: string): string[] {
    if (!searchInput || searchInput.trim() === '') {
      return options;
    }

    const searchTerm = searchInput.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(searchTerm));
  }
}