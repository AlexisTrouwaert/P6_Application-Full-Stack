import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { RegisterFormService } from '../../../services/form/auth/register/register-form.service';
import { ButtonsComponent } from '../../../UIComponents/buttons/buttons.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonsComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(
    private registerFormService: RegisterFormService,
    private auth: AuthService,
    private router: Router
  ) { 
    this.registerForm = this.registerFormService.getRegisterForm();
  }

  registerForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = "";

  submit(): void {
    if (this.registerForm.valid) {
      const formdata = this.registerForm.value;
      console.log('Form data:', formdata);
      this.auth.register(formdata).subscribe({
        next: () => {
          console.log("Inscription réussie");
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          console.error("Erreur lors de l'inscription:", err);
            if(err.error.message === 'password_missmatch_pattern'){
              this.showErrorMessage(`Le mot de passe doit contenir :
          - Au moins 8 caractères
          - Au moins un chiffre
          - Au moins une lettre minuscule
          - Au moins une lettre majuscule
          - Au moins un caractère spécial`);
            } else {
              this.showErrorMessage(err.error.message || "Une erreur est survenue lors de la connexion.");
            }
        }
      });
    } else {
      this.showErrorMessage("Veuillez remplir tous les champs correctement.")
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
