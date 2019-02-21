import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SuggestionsComponent } from './suggestions.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoogleMapsAPIWrapper } from '@agm/core';

@NgModule({
  declarations: [
    SuggestionsComponent
  ],
  imports: [
    // BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [
    SuggestionsComponent
  ],
  entryComponents: [],
  providers: [
    GoogleMapsAPIWrapper
  ]
})
export class SuggestionsComponentModule {}
