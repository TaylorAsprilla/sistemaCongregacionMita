import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrls: ['./edit-perfil.component.css']
})
export class EditPerfilComponent implements OnInit {

  @Output() toggleEdit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  submit(){
    this.toggleEdit.emit();
  }

}
