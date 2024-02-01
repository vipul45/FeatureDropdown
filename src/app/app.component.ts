import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dropdown';
  optionGroups = [
    {
      groupName: 'Group 1',
      options: ['Option 1A', 'Option 1B', 'Option 1C']
    },
    {
      groupName: 'Group 2',
      options: ['Option 2A', 'Option 2B', 'Option 2C']
    },
    // Add more groups as needed
  ];
}
