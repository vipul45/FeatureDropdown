import { Component } from '@angular/core';
import { DropdownOption } from './util/dropdown-option';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dropdown';
  submitted = false;
  datas: string[] = [];
  selectedValue:string='';
  selectedValues:any = [];
  opti: string[] = [];
  optionGroups:string[]=[]
  formData = {
    name: '',
    email: ''
  };
  
  dOpt: DropdownOption[] = [] 

  constructor(){
    for (let index = 0; index < 1000000; index++) {
      const newOption: DropdownOption = {
        id: index + 1,
        value:'index ' + (index+1),
        text: 'option ' + (index+1)
      }
      this.dOpt.push(newOption);
    }
  }

  
  recievedOption(data: string) {
    this.selectedValue = data 
  }
  recievedOptions(datas: string[]) {
    this.datas = datas
  }
  


  submitForm(): void {
    console.log('Submitted',this.datas );
    this.submitted = true;
  }
  
  
}
