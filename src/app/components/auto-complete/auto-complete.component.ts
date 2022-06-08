import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AutoCompleteComponent implements OnInit {
  title = 'testAutoComplete';
  options: string[] = ['Puerto Rico', 'Canada', 'Colombia', 'Estados Unidos'];

  myControl = new FormControl();
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLocaleLowerCase().indexOf(filterValue) === 0);
  }
}
