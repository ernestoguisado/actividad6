import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  userRetrieve: User | any;
  router = inject(Router)
  constructor(private userServices: UsersService,
    private activatedRoute: ActivatedRoute) {

  }
  ngOnInit() {
    this.activatedRoute.params.subscribe( async (params: any) : Promise<void> => {
      try {
        let id= params.id;
        let response = await this.userServices.getById(id);
        this.userRetrieve = response;
      }
      catch (err) {
        console.log("Error petición ID user")
      }
    })
    
  }

  async deletePost(id: number): Promise<void> {
    if (window.confirm('¿Estas seguro de borrar a este usuario?')) {
        let response = await this.userServices.deleteUser(id);
        if (response) {
            alert('Usuario borrado');
            this.router.navigate(['/home']);
        } else {
            alert('Hubo un error al intentar borrar al usuario.');
        }
    } else {
        alert('Operación cancelada');
    }
  }

}