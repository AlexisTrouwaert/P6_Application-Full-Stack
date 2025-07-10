import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonsComponent } from '../../../UIComponents/buttons/buttons.component';
import { LoginFormService } from '../../../services/form/auth/login/login-form.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

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
      private router: Router,
      private sanitizer : DomSanitizer
    ) { 
      this.registerForm = this.loginFormService.getLoginForm();
    }

    registerForm!: FormGroup;
    showError: boolean = false;
    errorMessage: SafeHtml  = "";

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
            this.showErrorMessage(err.error.message || "Une erreur est survenue lors de la connexion.");
            
          }
        });
      } else {
        console.error("Formulaire invalide");
        this.showErrorMessage("Veuillez remplir tous les champs correctement.");
      }
    }

    showErrorMessage(error : string): void {
      this.errorMessage = error;
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
        this.errorMessage = "";
      }, 3000);
    }
}
