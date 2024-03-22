import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild,Renderer2 } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DropdownOption } from '../util/dropdown-option';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-feature-dropdown',
  templateUrl: './feature-dropdown.component.html',
  styleUrls: ['./feature-dropdown.component.css'],
})
export class FeatureDropdownComponent {
  getItemHeight() {
    return 28;
  }

  @ViewChild('button', { static: true }) button: ElementRef | undefined;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport | undefined;
  @Input() isMultiSelect: boolean = false;
  @Input() startElement:boolean = false;
  @Input() data: DropdownOption[] = [];
  @Input() showHeader:  boolean = false;
  @Output() selectedOption: EventEmitter<DropdownOption> = new EventEmitter();
  @Output() selectedOptions: EventEmitter<DropdownOption[]> = new EventEmitter<DropdownOption[]>();

  selectedValue:string;
  lastSelectedOption :DropdownOption;
  selectedValues: DropdownOption[] = [];
  isDropdownOpen = false;
  searchInput: string;
  hoveredOptionIndex = 0;
  mouseHoveredIndex=-1;
  chosenOption:  DropdownOption;
  disableMouseEvent = false;
  headerText: string;

  constructor(private elementRef: ElementRef,private renderer:Renderer2) {
    this.elementRef.nativeElement.ownerDocument.addEventListener('wheel', this.handleMouseWheel, { passive: false });
  }
  ngOnDestroy() {
    // Remove the wheel event listener when the component is destroyed
    this.elementRef.nativeElement.ownerDocument.removeEventListener('wheel', this.handleMouseWheel);
  }
  handleMouseWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (!this.disableMouseEvent && this.viewport) {
      const scrollDirection = event.deltaY > 0 ? 1 : -1; // 1 for down, -1 for up
      const currentRange = this.viewport.getRenderedRange();
      const itemsInView = Math.floor(this.viewport.getViewportSize() / this.getItemHeight());
      const step = 1; // Incremental step size
  
      let startIndex = currentRange.start + scrollDirection * step;
      let endIndex = startIndex + itemsInView;
  
      // Ensure that the start and end indices are within the bounds of the data array
      startIndex = Math.max(0, Math.min(startIndex, this.data.length - itemsInView));
      endIndex = Math.min(this.data.length, startIndex + itemsInView);
  
      // Set the new rendered range
      this.setViewportIndices(startIndex, endIndex);
    }
  }

  handelMouseEnter(index: number) {
    const value = this.hoveredOptionIndex;
    if(!this.disableMouseEvent){
      this.hoveredOptionIndex = index;
      this.mouseHoveredIndex = index;
    }
  }
  viewportActive(){
    if(this.viewport){
      const start = this.viewport.getRenderedRange().start;
      const end = start + 5;
      this.setViewportIndices(start, end);
    }
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.headerText = this.isMultiSelect ? 'Multi Select' : 'Single Select';
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
    this.setViewportIndices(0,5);

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
  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if(event){
      this.disableMouseEvent = false;
    }
}

  @HostListener('document:mouseup', ['$event'])
  handleMouseUp(event: MouseEvent) {
    if(event){
      this.disableMouseEvent = false;
    }
  }
  @HostListener('document:mousedown', ['$event'])
  handleMouseDown(event: MouseEvent) {
    if(event){
      this.disableMouseEvent = false;
    }
  }
  
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
    this.hoveredOptionIndex = -1;
  }

  @HostListener('document:keydown',['$event'])
  onEnterPress(event: KeyboardEvent) {
    if(!this.isDropdownOpen && event.key === 'Enter'){
      this.isDropdownOpen = !this.isDropdownOpen;
      }
      this.viewportActive();
  }
  // Handle keyboard events
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event){
      this.disableMouseEvent = true; 
      this.viewportActive();
    }
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
        const size = this.viewport.getViewportSize();
        if(size >= 5){
          const start = this.viewport.getRenderedRange().start;
          const end = start + 5;
          this.viewport.setRenderedRange({start, end});
        }
        if (this.hoveredOptionIndex >= 0 && this.hoveredOptionIndex < this.data.length) {
          const threshold = 4; // Define your threshold here
            // Calculate the start and end index for the viewport
            const range = this.viewport.getRenderedRange()
            if (this.hoveredOptionIndex < range.start || this.hoveredOptionIndex >= range.end) {
              if(direction === 1){
                const start = Math.max(0,this.hoveredOptionIndex-threshold);
                const end  = Math.min(this.data.length-1,this.hoveredOptionIndex + 1)
                this.setViewportIndices(start,end);
              }else{
                const start = Math.max(0,this.hoveredOptionIndex);
                const end = Math.min(this.data.length-1,this.hoveredOptionIndex+threshold+1);
                this.setViewportIndices(start,end);
              }
            }
          }
      } else if (event.key === 'Enter' && this.hoveredOptionIndex !== null) {
        this.handleOptionClick(this.data[this.hoveredOptionIndex]);
        this.setViewportIndices(0,5);
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
