import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css']
})

export class CreateUpdateComponent {
  formularioUser : FormGroup;

  activeForm : boolean = true;
  buttonName : string = "";
  imageProfile : string = "";
  isUpdate : boolean = false;
  idUpdate : string = "";

  messageNotification : string =  "";
  clasesNotification : string = "";

  constructor(private userService: UsersService,
              private activatedRoute: ActivatedRoute) {

    this.formularioUser = new FormGroup({
      id: new FormControl("",[]),
      first_name: new FormControl("",[  
        Validators.required,
        Validators.minLength(3)
      ]),
      last_name: new FormControl("",[
        Validators.required,
        Validators.minLength(3)
      ]),
      username: new FormControl("",[
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl("",[
        Validators.required,
        Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      ]),
      image: new FormControl("",[
        Validators.required,
        Validators.pattern(/^(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[a-z]{2,}(?:\/\S*)?$/i)
      ]),
      password: new FormControl("",[
        Validators.required,
        Validators.minLength(3)
      ]),
      repite_password: new FormControl("",[
        Validators.required,
        Validators.minLength(3)
      ])
    }, [this.validarPassword])
  }

  ngOnInit() : void {
    
    this.activatedRoute.params.subscribe( async (params: any) : Promise<void> => {
      if (params.id) {
        this.isUpdate = true;
        this.buttonName = "Actualizar";
        try {
          let response = await this.userService.getById(params.id);
          if (!response.error) {
            this.idUpdate = response._id;
            this.rellenarCamposForm(response);
          }else {
            this.activeForm = false;
            this.updateNotifications("<h1>" + response.error + "</h1>","p-4 bg-danger");

          }
        }
        catch (err) {
          this.activeForm = false;
          this.updateNotifications("<h1>Error al realizar la petición</h1>","p-4 bg-danger");
        }
      } else {
        this.buttonName = "Crear";
      }
    })         
  }







  validarPassword(valorForm: AbstractControl) {
    const password: string = valorForm.get('password')?.value;
    const repite_password: string = valorForm.get('repite_password')?.value;

    if (password !== repite_password) {
      return { 'checkpassword': true }
    }
    return null

  }

  controlError(nombreCampo: string, tipoError: string): boolean {
    if (this.formularioUser.get(nombreCampo)?.hasError(tipoError) && 
        this.formularioUser.get(nombreCampo)?.touched) 
    {
      return true
    }
    return false
  }

// Pinta los datos cuando se edita el usuario
  rellenarCamposForm(response: any) : void{
    if (response.id) {
      this.imageProfile = response.image;
      this.formularioUser = new FormGroup({
        id: new FormControl(response.id,[  
          Validators.required,
          Validators.minLength(3)
        ]),
        first_name: new FormControl(response.first_name,[  
          Validators.required,
          Validators.minLength(3)
        ]),
        last_name: new FormControl(response.last_name,[
          Validators.required,
          Validators.minLength(3)
        ]),
        username: new FormControl(response.username,[
          Validators.required,
          Validators.minLength(3)
        ]),
        email: new FormControl(response.email,[
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ]),
        image: new FormControl(response.image,[
          Validators.required,
          Validators.pattern(/^(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[a-z]{2,}(?:\/\S*)?$/i)
        ]),
        password: new FormControl(response.password,[
          Validators.required,
          Validators.minLength(3)
        ]),
        repite_password: new FormControl(response.password,[
          Validators.required,
          Validators.minLength(3)
        ])
      })
    }
  }
  

  async getForm() : Promise<void> {

    //Creación
    if (!this.isUpdate) {
      try {
        let userToCreate : User= this.formularioUser.value;
        let response = await this.userService.createUser(userToCreate);
        if (response.id) {
          this.updateNotifications("<p class='mb-0'>Se ha creado correctamente el usuario " + response.username + "</p>","p-3 bg-success");
        } else {
          this.updateNotifications("<p class='mb-0'>Error en la petición</p>","p-3 bg-danger");
        }
      } catch {
        this.updateNotifications("<p class='mb-0'>Error en la petición</p>","p-3 bg-danger");
      }

    //Actualización
    } else {
      try {
        let userToUpdate : User= this.formularioUser.value;
        let response = await this.userService.updateUser(userToUpdate,this.idUpdate);
        if (response.id) {
          this.updateNotifications("<p class='mb-0'>Se ha actualizado correctamente el usuario " + response.username + "</p>","p-3 bg-success");
        } else {
          this.updateNotifications("<p class='mb-0'>Error en la petición</p>","p-3 bg-danger");
        }
      } catch {
        this.updateNotifications("<p class='mb-0'>Error en la petición</p>","p-3 bg-danger");
      }
    }
  }


  //Función para actualizar la imágen
  updateImage($event: any): void {
    let valorImagen = $event.target.value;
    this.imageProfile = valorImagen;
  }


  //Función para los mensajes en las notificaciones
  updateNotifications(msg: string, clase: string) : void {
    this.messageNotification = msg;
    this.clasesNotification = clase;
  }

}