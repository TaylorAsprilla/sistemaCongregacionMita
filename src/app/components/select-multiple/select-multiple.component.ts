import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-multiple',
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.css'],
})
export class SelectMultipleComponent implements OnInit {
  dropdownList;
  dropdownSettings;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.dropdownList = this.getData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
    };
  }

  initForm() {
    this.form = this.formBuilder.group({
      grocery: ['', [Validators.required]],
    });
  }

  handleButtonClick() {
    console.log('reactive form value ', this.form.value);
    console.log('Actual data ', this.getObjectListFromData(this.form.value.grocery.map((item) => item.item_id)));
  }

  onItemSelect($event) {
    console.log('$event is ', $event);
  }

  getObjectListFromData(ids) {
    return this.getData().filter((item) => ids.includes(item.item_id));
  }

  getData(): Array<any> {
    return [
      { item_id: 1, item_text: 'Obrero', group: 'F' },
      { item_id: 2, item_text: 'Guarda', group: 'F' },
      { item_id: 3, item_text: 'Musico', group: 'V' },
    ];
  }

  setDefaultSelection() {
    let item = this.getData()[0];
    this.form.patchValue({
      grocery: [
        {
          item_id: item['item_id'],
          item_text: item['item_text'],
        },
      ],
    });
  }
}
