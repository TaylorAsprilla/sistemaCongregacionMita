import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-info-perfil',
  templateUrl: './info-perfil.component.html',
  styleUrls: ['./info-perfil.component.css']
})
export class InfoPerfilComponent implements OnInit {

  @Output() toggleEdit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  submit(){
    this.toggleEdit.emit();
  }

}
