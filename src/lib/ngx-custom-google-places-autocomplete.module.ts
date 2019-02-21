// import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { NgxCustomGooglePlacesAutoCompleteComponent } from './ngx-custom-google-places-autocomplete.component';
import { SuggestionsComponentModule } from './suggestions/suggestions.component.module';

@NgModule({
  declarations: [
    NgxCustomGooglePlacesAutoCompleteComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatInputModule,
    SuggestionsComponentModule,
    FormsModule
  ],
  exports: [
    NgxCustomGooglePlacesAutoCompleteComponent
  ],
  entryComponents: [],
  providers: []
})
export class NgxCustomGooglePlacesAutoCompleteComponentModule {}
