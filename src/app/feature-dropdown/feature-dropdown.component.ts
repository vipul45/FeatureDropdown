import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FilterOptionsPipe } from '../filter-options.pipe';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DropdownOption } from '../util/dropdown-option';
import { ChangeDetectionStrategy } from '@angular/core';
import { start } from 'repl';

@Component({
  selector: 'app-feature-dropdown',
  templateUrl: './feature-dropdown.component.html',
  styleUrls: ['./feature-dropdown.component.css'],
})
export class FeatureDropdownComponent {
  @ViewChild('button', { static: true }) button: ElementRef | undefined;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport | undefined;
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

  constructor(private elementRef: ElementRef) {}

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
    this.selectedValue = this.chosenOption.text;
    this.lastSelectedOption = this.chosenOption;
    this.selectedOption.emit(this.chosenOption);
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

  @HostListener('document:keydown',['$event'])
  onEnterPress(event: KeyboardEvent) {
    if(!this.isDropdownOpen && event.key === 'Enter'){
      this.isDropdownOpen = !this.isDropdownOpen;
      }
  }
  // Handle keyboard events
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      if (this.isMultiSelect && this.selectedValues.length > 0) {
        // Remove the last selected option
        const lastSelectedOption = this.selectedValues.pop();
        // Emit the updated selected options
        this.selectedOptions.emit(this.selectedValues);
        if(this.selectedValues.length === 0){
          this.hoveredOptionIndex = -1;
        }
        // Optionally, emit an event indicating that the last selected option was removed
      } else if (!this.isMultiSelect && this.selectedValue) {
        this.lastSelectedOption = null;
        this.selectedOption.emit(this.chosenOption);
        this.isDropdownOpen = false;
        if (this.lastSelectedOption === null){
          this.hoveredOptionIndex = -1;
        }
      }
    }else if (this.isDropdownOpen && this.data.length > 0) {
      if (event.key === 'Escape') {
        this.isDropdownOpen = false;
        this.hoveredOptionIndex = -1;
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling the page
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        this.hoveredOptionIndex = this.getValidIndex(this.hoveredOptionIndex !== null ? this.hoveredOptionIndex + direction : direction);
  
        if (this.hoveredOptionIndex >= 0 && this.hoveredOptionIndex < this.data.length) {
          const threshold = 4; // Define your threshold here
          if (this.hoveredOptionIndex >= threshold) {
            // Calculate the start and end index for the viewport
            const startIndex = Math.max(0, this.hoveredOptionIndex - threshold);
            const endIndex = Math.min(this.data.length - 1, this.hoveredOptionIndex + threshold);
            this.setViewportIndices(startIndex, endIndex);
          }
        }
      } else if (event.key === 'Enter' && this.hoveredOptionIndex !== null) {
        this.handleOptionClick(this.data[this.hoveredOptionIndex]);
        const start = Math.max(0, this.hoveredOptionIndex - 4);
        const end = Math.min(this.data.length - 1, this.hoveredOptionIndex+1);
        this.viewport.setRenderedRange({start: this.hoveredOptionIndex-4, end: this.hoveredOptionIndex+1});
      }
    }
  }
  
  setViewportIndices(startIndex: number, endIndex: number): void {
    if (this.viewport) {
      // Adjust the data source based on the start and end indices
      this.viewport.setRenderedRange({ start: startIndex, end: endIndex });
    }
  }
  

  // Get valid index considering circular navigation
  private getValidIndex(index: number): number {
    if (index < 0) {
      return 0;
    } else if (index >= this.data.length) {
      return 0;
    } else {
      return index;
    }
  }
}
