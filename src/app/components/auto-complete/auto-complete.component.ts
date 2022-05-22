import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
})
export class AutoCompleteComponent implements OnInit {
  countries: string[] = ['Puerto Rico', 'Canada', 'Colombia', 'Estados Unidos'];

  control = new FormControl();
  filCountries: Observable<String[]>;

  constructor() {}

  ngOnInit(): void {
    this.filCountries = this.control.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map((val) => this._filter(val))
    );
  }

  private _filter(val: string): string[] {
    const formatVal = val.toLocaleLowerCase();
    return this.countries.filter((country) => country.toLocaleLowerCase().indexOf(formatVal) === 0);
  }
}
