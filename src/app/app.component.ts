import { Component } from '@angular/core';
import { DropdownOption } from './util/dropdown-option';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dropdown';
  myForm: FormGroup;
  submitted = false;
  datas: DropdownOption[] = [];
  selectedValue:DropdownOption;
  selectedValues:DropdownOption;
  formData = {
    name: '',
    email: ''
  };
  
  data: DropdownOption[] = [] 

  constructor(private fb: FormBuilder){
    for (let index = 0; index < 1000000; index++) {
      const newOption: DropdownOption = {
        id: index + 1,
        value:'index ' + (index+1),
        text: 'option ' + (index+1)
      }
      this.data.push(newOption);
    }
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dropdown: [null, Validators.required]
    });
  }
  onDropdownOptionSelected(option: any) {
    // Update the form control with the selected option
    this.myForm.get('dropdown').setValue(option.value);
  }
  
  recievedOption(data: DropdownOption) {
    this.selectedValue = data 
    this.myForm.get('dropdown').setValue(data);
  }



  onSubmit() {
    if (this.myForm.valid) {
      console.log('Form submitted:', this.myForm.value);
      // Handle form submission here
    } else {
      console.error('Form is invalid.');
    }
  }
  
  
}
