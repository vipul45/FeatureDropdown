import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeatureDropdownComponent } from './feature-dropdown/feature-dropdown.component';
import { FilterOptionsPipe } from './filter-options.pipe';

import { FormsModule } from '@angular/forms';

import { ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    FeatureDropdownComponent,
    FilterOptionsPipe,

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ScrollingModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideClientHydration(),
    FilterOptionsPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
