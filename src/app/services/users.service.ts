import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { USUARIOS_ARRAY } from '../db/usuarios.db';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private arrUsers : User[] = USUARIOS_ARRAY;
  constructor() { }

  getAll(): User[] {
    return this.arrUsers;
  }
}