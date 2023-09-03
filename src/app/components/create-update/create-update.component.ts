import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  router = inject(Router)

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
            alert( response.error );

          }
        }
        catch (err) {
          this.activeForm = false;
          alert("Error al realizar la petición");
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
          alert("Se ha creado correctamente el usuario ");
          this.router.navigate(['/home']);
        } else {
          alert("Error en la petición");
        }
      } catch {
        alert("Error en la petición");
      }

    //Actualización
    } else {
      try {
        let userToUpdate : User= this.formularioUser.value;
        let response = await this.userService.updateUser(userToUpdate,this.idUpdate);
        if (response.id) {
          alert("Se ha actualizado correctamente el usuario ");
          this.router.navigate(['/home']);
        } else {
          alert("Error en la petición");
        }
      } catch {
        alert("Error en la petición");
      }
    }
  }


  //Función para actualizar la imágen
  updateImage($event: any): void {
    let valorImagen = $event.target.value;
    this.imageProfile = valorImagen;
  }


  

}