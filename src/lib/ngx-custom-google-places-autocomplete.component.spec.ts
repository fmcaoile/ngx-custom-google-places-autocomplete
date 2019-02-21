import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCustomGooglePlacesAutocompleteComponent } from './ngx-custom-google-places-autocomplete.component';

describe('NgxCustomGooglePlacesAutocompleteComponent', () => {
  let component: NgxCustomGooglePlacesAutocompleteComponent;
  let fixture: ComponentFixture<NgxCustomGooglePlacesAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxCustomGooglePlacesAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCustomGooglePlacesAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
