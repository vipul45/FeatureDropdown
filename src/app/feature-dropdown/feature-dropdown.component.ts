import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FilterOptionsPipe } from '../filter-options.pipe';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DropdownOption } from '../util/dropdown-option';

@Component({
  selector: 'app-feature-dropdown',
  templateUrl: './feature-dropdown.component.html',
  styleUrl: './feature-dropdown.component.css'
})
export class FeatureDropdownComponent {
  @ViewChild('button', { static: true }) button: ElementRef | undefined;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport | undefined;
  @Input() isMultiSelect: boolean = false;
  @Input() data: DropdownOption[] = [];
  @Output() selectedOption: EventEmitter<DropdownOption> = new EventEmitter();
  @Output() selectedOptions: EventEmitter<DropdownOption[]> = new EventEmitter<DropdownOption[]>();

  selectedValue:string;
  lastSelectedOption :DropdownOption;
  selectedValues: DropdownOption[] = [];
  isDropdownOpen = false;
  searchInput: string;


  constructor(private elementRef: ElementRef, private filterOptionsPipe: FilterOptionsPipe) {
    console.log(this.data)
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleOptionClick(option: DropdownOption): void {
    if (this.isMultiSelect) {
      this.toggleOption(option);
    } else {
      this.selectOption(option);
    }
  }

  toggleOption(option: DropdownOption): void {
    const isSelected = this.selectedValues.includes(option);

    if (isSelected) {
      this.selectedValues = this.selectedValues.filter(val => val !== option);
    } else {
      this.selectedValues = [...this.selectedValues, option];
    }

    this.isDropdownOpen = false;
    this.updateChipsClass();
    this.selectedOptions.emit(this.selectedValues);
    this.searchInput = '';
  }

  selectOption(option: DropdownOption): void {
    this.selectedValue = option.text;
    this.lastSelectedOption = option;
    this.selectedOption.emit(option);
    this.isDropdownOpen = false;
    this.searchInput = '';
  }

  isOptionSelected(option: DropdownOption): boolean {
    return this.selectedValues.includes(option);
  }

  isLastSelected(option: DropdownOption): boolean {
    if (this.isMultiSelect){
    return option === this.selectedValues[this.selectedValues.length - 1];
  }else {
    return option === this.lastSelectedOption;
  }
}

  onSearchInputChange(event: Event): void {
    this.searchInput = (event.target as HTMLInputElement).value;
  }


  removeOption(option: DropdownOption): void {
    this.selectedValues = this.selectedValues.filter(val => val !== option);
    this.searchInput = '';
    this.updateChipsClass();
    this.selectedOptions.emit(this.selectedValues);
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
