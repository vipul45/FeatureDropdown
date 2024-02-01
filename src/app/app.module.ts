import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeatureDropdownComponent } from './feature-dropdown/feature-dropdown.component';
import { FilterOptionsPipe } from './filter-options.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FeatureDropdownComponent,
    FilterOptionsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideClientHydration(),
    FilterOptionsPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
