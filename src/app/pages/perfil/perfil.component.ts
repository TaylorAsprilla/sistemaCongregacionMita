import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

   isEdit: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleEdit(){
    this.isEdit = !this.isEdit;
    console.log(this.isEdit)
  }

}
