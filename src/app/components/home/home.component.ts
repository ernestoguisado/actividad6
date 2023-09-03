import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  arrUsers: User[] = [];
  paginaActual: number = 0;
  total_paginas: number = 0;
  constructor (private usersServices :UsersService) {

  }

  ngOnInit():void{
    
    this.total_paginas= 99;
    this.irPaginaAdelante();
    }
  
    irPaginaAdelante() : void{
      if (this.paginaActual != 2){
        this.paginaActual++;
      }
      this.getData(this.paginaActual);
    }
  
    irPaginaAtras() : void{
      if (this.paginaActual != 1){
        this.paginaActual--;
      }
      this.getData(this.paginaActual);
    }
  
    irPaginaExacta(numPag :number = 1) : void{
      this.paginaActual = numPag;
      this.getData(this.paginaActual);
    }
  
  
    async getData(numPag :number = 1) : Promise<void>{
  
      try {
        let response = await this.usersServices.getAll(numPag);
        this.arrUsers = response.results;
        this.total_paginas = response.total_pages;
  
      }
      catch (err) {
        console.log("error en la petición");
      }
  }
}
