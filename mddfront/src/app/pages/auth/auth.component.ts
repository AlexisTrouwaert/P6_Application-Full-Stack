import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from '../../UIComponents/buttons/buttons.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    CommonModule,
    ButtonsComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  login: boolean = false;
  register: boolean = false

}
