import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css'
})
export class ChipsComponent {
  @Input()
  chipText!: string;
  @Input() value: string | undefined;
  @Output() removeChip: EventEmitter<string> = new EventEmitter<string>();

  removeOption(): void {
    this.removeChip.emit(this.value); // Emitting the value of the chip to the parent component
  }   
}

