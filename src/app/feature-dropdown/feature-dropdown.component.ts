import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FilterOptionsPipe } from '../filter-options.pipe';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DropdownOption } from '../util/dropdown-option';

@Component({
  selector: 'app-feature-dropdown',
  templateUrl: './feature-dropdown.component.html',
  styleUrls: ['./feature-dropdown.component.css']
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
  hoveredOptionIndex = -1;
  chosenOption:  DropdownOption;

  constructor(private elementRef: ElementRef, private filterOptionsPipe: FilterOptionsPipe) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (!this.isDropdownOpen) {
      this.hoveredOptionIndex = -1; // Reset hovered option index when dropdown is closed
    }
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
        if(option.id !== null){
          this.selectedValues = [...this.selectedValues, option];
      }
    }
    this.hoveredOptionIndex = -1;
    this.isDropdownOpen = false;
    this.updateChipsClass();
    this.selectedOptions.emit(this.selectedValues);
    this.searchInput = '';
  }

  selectOption(option: DropdownOption): void {
    this.chosenOption = option;
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
    } else {
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

  // Handle keyboard events
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isDropdownOpen && this.data.length > 0) {
      if (event.key === 'Escape'){
        this.isDropdownOpen = false;
      }
      else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // Navigate through options with arrow keys
        event.preventDefault(); // Prevent scrolling the page
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        this.hoveredOptionIndex = this.getValidIndex(this.hoveredOptionIndex !== null ? this.hoveredOptionIndex + direction : direction);
      } else if (event.key === 'Enter' && this.hoveredOptionIndex !== null) {
        // Select the hovered option on Enter key press
        this.handleOptionClick(this.data[this.hoveredOptionIndex]);
      }
    }
  }

  // Get valid index considering circular navigation
  private getValidIndex(index: number): number {
    if (index < 0) {
      return this.data.length - 1;
    } else if (index >= this.data.length) {
      return 0;
    } else {
      return index;
    }
  }
}
