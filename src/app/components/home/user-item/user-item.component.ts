import { Component, Input,inject } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})

export class UserItemComponent {
  constructor(private userServices: UsersService,
    private activatedRoute: ActivatedRoute) {

  }
  @Input() userRetrieve : User | any;
  router = inject(Router)

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
