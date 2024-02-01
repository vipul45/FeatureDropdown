import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FilterOptionsPipe } from '../filter-options.pipe';
@Component({
  selector: 'app-feature-dropdown',
  templateUrl: './feature-dropdown.component.html',
  styleUrl: './feature-dropdown.component.css'
})
export class FeatureDropdownComponent {
  @ViewChild('button', { static: true }) button: ElementRef | undefined;
  @Input() isMultiSelect: boolean = false;
  @Input() optionGroups: { groupName: string, options: string[] }[] = [];


  selectedValue = '';
  lastSelectedOption = '';
  selectedValues: string[] = [];
  isDropdownOpen = false;
  searchInput = '';


  constructor(private elementRef: ElementRef, private filterOptionsPipe: FilterOptionsPipe) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleOptionClick(option: string): void {
    if (this.isMultiSelect) {
      this.toggleOption(option);
    } else {
      this.selectOption(option);
    }
  }

  toggleOption(option: string): void {
    const isSelected = this.selectedValues.includes(option);

    if (isSelected) {
      this.selectedValues = this.selectedValues.filter(val => val !== option);
    } else {
      this.selectedValues = [...this.selectedValues, option];
    }

    this.isDropdownOpen = false;
    this.updateChipsClass();
  }

  selectOption(option: string): void {
    this.selectedValue = option;
    this.lastSelectedOption = option;
    this.isDropdownOpen = false;
  }

  isOptionSelected(option: string): boolean {
    return this.selectedValues.includes(option);
  }

  isLastSelected(option: string): boolean {
    if (this.isMultiSelect){
    return option === this.selectedValues[this.selectedValues.length - 1];
  }else {
    return option === this.lastSelectedOption;
  }
}

  onSearchInputChange(event: Event): void {
    this.searchInput = (event.target as HTMLInputElement).value;
  }

  filteredOptionGroups() {
    return this.optionGroups
      .map(group => ({
        ...group,
        filteredOptions: this.filterOptionsPipe.transform(group.options, this.searchInput),
      }))
      .filter(group => group.filteredOptions.length > 0);
  }

  removeOption(option: string): void {
    this.selectedValues = this.selectedValues.filter(val => val !== option);
    this.searchInput = '';
    this.updateChipsClass();
  }

  private updateChipsClass(): void {
    if (this.button && this.button.nativeElement) {
      const hasChips = this.selectedValues.length > 0;
      this.button.nativeElement.classList.toggle('has-chips', hasChips);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

}
