import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownOption } from '../../util/dropdown-option';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css'
})
export class ChipsComponent {
  @Input()
  chipText!: DropdownOption;
  @Input() value: DropdownOption;
  @Output() removeChip: EventEmitter<DropdownOption> = new EventEmitter<DropdownOption>();

  removeOption(): void {
    this.removeChip.emit(this.value); // Emitting the value of the chip to the parent component
  }   
}

