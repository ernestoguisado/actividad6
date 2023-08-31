import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private endPointUrl : string = "https://peticiones.online/api/users";
  constructor(private httpClient : HttpClient) { }
  

  getAll(pagina : number = 1): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(this.endPointUrl));
  }

  getById(id:number) : Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.endPointUrl}/${id.toString}`));
  }

  createUser(user:User) : Promise<any> {
    return lastValueFrom(this.httpClient.post<any>(this.endPointUrl,user));
  }

  updateUser(user:User) : Promise<any> {
    return lastValueFrom(this.httpClient.put<any>(this.endPointUrl,user));
  }

  deleteUser(id:number) {
    return lastValueFrom(this.httpClient.delete<any>(`${this.endPointUrl}/${id.toString}`));
  }
}