import { 
  ChangeDetectorRef, 
  Component, 
  EventEmitter, 
  Input, 
  OnChanges, 
  Output, 
  ChangeDetectionStrategy, 
  TemplateRef 
} from '@angular/core';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { List } from 'immutable';

declare var google: any;

export interface ISuggestionRow {
  label: string;
}

export interface IGooglePrediction  extends ISuggestionRow{
  description: string;
  place_id: string;
}

export interface IGooglePlace {
  address_components: Array<any>;
  formatted_address: string;
  geometry: {
    bounds: Object, 
    location: {
      lat: Function,
      lng: Function
    }, 
    location_type: string, 
    viewport: Object
  };
  place_id: string;
  types: Array<string>;
  lat: number;
  lng: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'suggestions',
  templateUrl: 'suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnChanges {
    
  @Input() searchTerm: string;

  @Input() lat: number;

  @Input() lng: number;

  @Input() width: number;

  @Input() left: number;

  @Input() top: number;

  @Input() selectedIndex: number = -1;

  @Input() customResults: Array<any>;

  @Input() customResultTemplate: TemplateRef<any>;

  @Input() showSuggestionsResultContainer: boolean;

  @Input() autoCompleteOpts: any = {
    types: ["geocode"]
    // ,
    // componentRestrictions: {country: "can"}
  };

  @Output() googlePlaceSelect = new EventEmitter<IGooglePlace>();

  @Output() customPlaceSelect = new EventEmitter<any>();

  public init: boolean;

  public googlePlaceSuggestions: List<IGooglePrediction> = List([]);

  public isLoading: boolean;

  constructor (private changeDetectorRef: ChangeDetectorRef,
    private googleMapsAPIWrapper: GoogleMapsAPIWrapper,
    private mapsAPILoader: MapsAPILoader) {}

  public ngOnInit () {
    this.init = true;
    // this.runSearch();
  }

  public ngOnChanges (change) {
    
    if (!this.init) {
      return;
    }

    if (change && change['searchTerm']) {
      this.runSearch();
    }
  }

  public runSearch () {
    this.isLoading = true;
    this.googlePlaceSuggestions = List([]);
    this.customResults = [];
    this.selectedIndex = -1;

    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }

    this.searchGooglePlaceAutocomplete(this.searchTerm)
      .subscribe((result: List<IGooglePrediction>) => {
        this.googlePlaceSuggestions = result;
        this.isLoading = false;

        if (!this.changeDetectorRef['destroyed']) {
          this.changeDetectorRef.detectChanges();
        }
      },
      (err) => {
        this.isLoading = false;

        if (!this.changeDetectorRef['destroyed']) {
          this.changeDetectorRef.detectChanges();
        }
      });

  }

  public searchGooglePlaceAutocomplete (term: string) : Observable<List<IGooglePrediction>> {

    return new Observable<List<IGooglePrediction>>((observer) => {

      if (!term) {
        observer.next(List([]));
        observer.complete();
        return;
      }

      this.mapsAPILoader.load().then(() => {

        // Run query and auto select the first result if there's any
        // src: https://stackoverflow.com/questions/15709193/google-map-autocomplete-select-first-entry-in-list-by-default
        const service = new google.maps.places.AutocompleteService();
        const placePredictionsOpts = Object.assign({ input: term }, this.autoCompleteOpts);

        service.getPlacePredictions(placePredictionsOpts, 
          (predictions, status) => {

            let googlePlaceSuggestions: List<IGooglePrediction> = List([]);

            if (status === 'OK') {
              for (let prediction of predictions) {
                googlePlaceSuggestions = googlePlaceSuggestions.push({
                  description: prediction.description,
                  label: prediction.structured_formatting.main_text,
                  place_id: prediction.place_id
                });
              }

              observer.next(googlePlaceSuggestions);
              observer.complete();
            } else {
              observer.next(googlePlaceSuggestions);
              observer.complete();
            }

        });
        
      });

    });

  }

  public onGoolePlaceSuggestionSelect (event: IGooglePrediction) {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'placeId': event.place_id}, (results, status) => {
      if (status ===  google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const place = results[0];

          if (place.geometry) {
            this.searchTerm = place.formatted_address;

            // set latitude, longitude and zoom
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            place.lat = lat;
            place.lng = lng;

            this.googlePlaceSelect.emit(place);
            this.hide();
          }

        } else {
          // this.showSuggestionsInThePage(searchTermAfterPressingEnterKey);
        }
      } else {
        // this.showSuggestionsInThePage(searchTermAfterPressingEnterKey);
      }
    });

  }

  public onCustomPlaceSelect (event: any) {
    this.customPlaceSelect.emit(event);
    this.hide();
  }

  public show () {
    this.showSuggestionsResultContainer = true;
    this.changeDetectorRef.detectChanges();
  }

  public hide () {
    this.showSuggestionsResultContainer = false;
    this.changeDetectorRef.detectChanges();
  }

}
