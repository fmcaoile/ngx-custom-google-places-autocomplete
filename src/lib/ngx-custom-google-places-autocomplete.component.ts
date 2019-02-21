import { 
  Component, 
  ComponentRef, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Directive, 
  ElementRef, 
  EventEmitter, 
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild 
} from '@angular/core';

import { SuggestionsComponent } from './suggestions/suggestions.component';

import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'ngx-custom-google-places-autocomplete',
  templateUrl: './ngx-custom-google-places-autocomplete.component.html'
})
export class NgxCustomGooglePlacesAutoCompleteComponent {

  @ViewChild(MatFormField) public searchBar: MatFormField;

  @ViewChild(SuggestionsComponent) suggestionsComponentRef: SuggestionsComponent;

  @HostListener('click', ['$event']) 
    onTapHandler (event) {
      this.onSearchBarFocus()
    }
    
  @HostListener('window:resize', ['$event']) 
    resizeHandler (event) {
      this.suggestionsBoundingRect = this.searchBar.getConnectedOverlayOrigin().nativeElement.getBoundingClientRect();
      this.changeDetectorRef.markForCheck();
    }

  @HostListener('window:click', ['$event.target']) 
    clickHandler (targetElement) {

      if (!this.suggestionsComponentRef) {
        this.showSuggestionsResultContainer = false;
        return;
      }

      const clickedInside = this.elementRef.nativeElement.contains(targetElement);
      
      if (!clickedInside) {
        this.showSuggestionsResultContainer = false;
      }
    }
  
  @Input() searchTerm: string;

  @Input() lat: number;

  @Input() lng: number;

  @Input() customResultTemplate: TemplateRef<any>;

  @Input() customResults: Array<any>;

  @Input() placeholder: string = 'Search';

  @Input() autoCompleteOpts: any = { types: ["geocode"] };

  @Output() googlePlaceSelect = new EventEmitter<{name: string, lat: number, lng: number}>();

  @Output() customPlaceSelect = new EventEmitter<any>();

  @Output() change = new EventEmitter<string>();

  public suggestionsBoundingRect: { width: number, left: number, top: number, height: number, y: number } = { width: 0, left: 0, top: 0, height: 0, y: 0};

  public suggestionSearchTerm: string;

  public muteIonChange: boolean;

  public showSuggestionsResultContainer: boolean;

  public selectedIndex: number = -1;

  constructor (private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit () {
    this.suggestionSearchTerm = this.searchTerm;
    this.suggestionsBoundingRect = this.searchBar.getConnectedOverlayOrigin().nativeElement.getBoundingClientRect();
  }

  public onKeyUp ($event) {
    if (this.muteIonChange) {
      this.muteIonChange = false;
      return;
    }

    this.suggestionSearchTerm = $event.target.value;
    this.searchTerm = this.suggestionSearchTerm;

    this.change.emit(this.searchTerm);
    this.showSuggestionsResultContainer = true;
    this.changeDetectorRef.markForCheck();
  }

  public onEnterPress () {
    this.showSuggestionsResultContainer = false;

    const obj = this.getSelectedItem();

    if (obj) {
      if (obj.type === 'google_place') {
        this.suggestionsComponentRef.onGoolePlaceSuggestionSelect(obj.item);
      } else {
        this.suggestionsComponentRef.onCustomPlaceSelect(obj.item);
      }
    } else {
      this.suggestionsComponentRef.searchGooglePlaceAutocomplete(this.searchTerm)
        .subscribe((results) => {
          if (results.count() > 0) {
            this.suggestionsComponentRef.onGoolePlaceSuggestionSelect(results.get(0));
          }
        });
    }
  }

  public onSearchBarFocus () {
    this.showSuggestionsResultContainer = true;
    this.muteIonChange = false;
    this.selectedIndex = -1;
    this.changeDetectorRef.detectChanges();
  }

  public onArrowDown () {
    const componentInstanceRef = this.suggestionsComponentRef;
    const count = componentInstanceRef.googlePlaceSuggestions.count() + componentInstanceRef.customResults.length;

    if (count === 0) {
      return;
    }

    const index = this.selectedIndex + 1;
    this.showSuggestionsResultContainer = true;
    this.selectedIndex  = index % count;
    this.updateSearchbarValueWithoutIonChangeTrigger();
  }

  public onArrowUp () {
    const componentInstanceRef = this.suggestionsComponentRef;
    const count = componentInstanceRef.googlePlaceSuggestions.count() + componentInstanceRef.customResults.length;

    if (count === 0) {
      return;
    }

    const index = this.selectedIndex - 1;
    this.showSuggestionsResultContainer = true;
    this.selectedIndex  = index < 0 ? count + index : index;
    this.updateSearchbarValueWithoutIonChangeTrigger();
  }

  public updateSearchbarValueWithoutIonChangeTrigger () {
    const obj = this.getSelectedItem();
    if (obj) {
      this.muteIonChange = true;
      this.searchTerm = obj.label;
    }
  }

  public getSelectedItem () : { type: string, label: string, item: any } {
    const componentInstanceRef = this.suggestionsComponentRef;
    let index = this.selectedIndex;

    if (index === -1) {
      return null;
    }
    
    if (index < componentInstanceRef.googlePlaceSuggestions.count()) {
      const item = componentInstanceRef.googlePlaceSuggestions.get(index);
      return {
        type: 'google_place',
        label: item.label,
        item: item
      }
    }

    index -= componentInstanceRef.googlePlaceSuggestions.count();

    if (index < componentInstanceRef.customResults.length) {
      const item = componentInstanceRef.customResults[index];
      return {
        type: 'custom_place',
        label: item.label,
        item: item
      }
    }

    return null;
  }

  public getTopPosition () : number {
    return this.suggestionsBoundingRect.top + this.suggestionsBoundingRect.height + this.suggestionsBoundingRect.y + 6;
  }

  public onCustomPlaceSelect ($event) {
    this.muteIonChange = true;
    this.searchTerm = $event.name;
    this.showSuggestionsResultContainer = false;
    this.changeDetectorRef.detectChanges();
    this.customPlaceSelect.emit($event);
  }

  public onGooglePlaceSelect ($event) {
    this.muteIonChange = true;
    this.searchTerm = $event.name;
    this.showSuggestionsResultContainer = false;
    this.changeDetectorRef.detectChanges();
    this.googlePlaceSelect.emit($event);
  }

}
