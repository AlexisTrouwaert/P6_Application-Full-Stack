import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonsComponent } from '../../../UIComponents/buttons/buttons.component';
import { LoginFormService } from '../../../services/form/auth/login/login-form.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonsComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
      private loginFormService: LoginFormService,
      private auth: AuthService,
      private router: Router
    ) { 
      this.registerForm = this.loginFormService.getLoginForm();
    }

    registerForm!: FormGroup;
    showError: boolean = false;
    errorMessage: string = "";

    submit(): void {
      if (this.registerForm.valid) {
        const formdata = this.registerForm.value;
        console.log('Form data:', formdata);
        this.auth.login(formdata).subscribe({
          next: () => {
            console.log("Connexion réussie");
            this.router.navigate(['/feed']);
          },
          error: (err) => {
            console.error("Erreur lors de l'inscription:", err);
            this.showError = true;
            this.errorMessage = err.error.message || "Une erreur est survenue lors de la connexion.";
            setTimeout(() => {
              this.showError = false;
            }, 3000);
          }
        });
      }
    }
}
