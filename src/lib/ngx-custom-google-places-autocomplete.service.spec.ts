import { TestBed } from '@angular/core/testing';

import { NgxCustomGooglePlacesAutocompleteService } from './ngx-custom-google-places-autocomplete.service';

describe('NgxCustomGooglePlacesAutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxCustomGooglePlacesAutocompleteService = TestBed.get(NgxCustomGooglePlacesAutocompleteService);
    expect(service).toBeTruthy();
  });
});
