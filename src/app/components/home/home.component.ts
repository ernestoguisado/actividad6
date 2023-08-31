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
  constructor (private usersServices :UsersService) {

  }

  ngOnInit():void{
    
      this.getData();
    }
  
    async getData() : Promise<void> {
      try {
      let response = await this.usersServices.getAll();
      this.arrUsers = response.results;
      }
      catch (err) {
        console.log("error en la petición");
      }
  }
}
