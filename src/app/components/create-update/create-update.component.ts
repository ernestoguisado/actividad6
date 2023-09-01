import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserCreate } from 'src/app/interfaces/user-create.interface';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css']
})

export class CreateUpdateComponent {
  formularioUser : FormGroup;
  activeForm : boolean;
  message : string;
  buttonName : string;
  imageProfile : string;
  constructor(private userService: UsersService,
              private activatedRoute: ActivatedRoute) {
    this.message = "";
    this.activeForm = true;
    this.buttonName = "";
    this.imageProfile = "";
    this.formularioUser = new FormGroup({
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
    try {
    this.activatedRoute.params.subscribe( async (params: any) : Promise<void> => {
      if (params.id) {
        let response = await this.userService.getById(params.id);
        this.buttonName = "Actualizar";
        this.rellenarCamposForm(response);
      } else {
        this.buttonName = "Crear";
      }
    }) 
    }
    //Si algo va mal no mostramos el form y lanzamos error
    catch (err) {
      this.activeForm = false;
      this.message = "Algo ha ido mal al cargar el componente";
      console.log(err);
    }
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
    } else {
      this.activeForm = false;
      this.message = response.error;
    }
  }
  

  async getForm() : Promise<void> {

    try {
      let userToCreate : UserCreate= {
        "first_name":this.formularioUser.value.first_name,
        "last_name": this.formularioUser.value.last_name,
        "email": this.formularioUser.value.email,
        "username": this.formularioUser.value.username,
        "password": this.formularioUser.value.password
      };

      let response = await this.userService.createUser(userToCreate);
      console.log(response);
    } catch {
      console.log("error alcrear el usuario");
    }
  }


  //Función para actualizar la imágen
  updateImage($event: any): void {
    let valorImagen = $event.target.value;
    this.imageProfile = valorImagen;
  }
}