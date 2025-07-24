import { Component, OnInit } from '@angular/core';
import { GetUsersTopicsService } from '../../services/topic/get-users-topics.service';
import { Topics } from '../../models/topics';
import { TopicCardComponent } from '../../UIComponents/topic-card/topic-card.component';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../models/user-info';
import { EditFormService } from '../../services/form/edit-form.service';
import { Form, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditProfileService } from '../../services/editProfile/edit-profile.service';
import { ButtonsComponent } from "../../UIComponents/buttons/buttons.component";

@Component({
  selector: 'app-profil-page',
  standalone: true,
  imports: [
    CommonModule,
    TopicCardComponent,
    ReactiveFormsModule,
    ButtonsComponent
],
  templateUrl: './profil-page.component.html',
  styleUrl: './profil-page.component.scss'
})
export class ProfilPageComponent implements OnInit {
  
  topics: Topics[] = [];
  myInfo!: UserInfo;

  constructor(
    private subscribedTopic: GetUsersTopicsService,
    private editFormService: EditFormService,
    private editProfileService: EditProfileService,
  ) {
    this.editForm = this.editFormService.getEditForm();
  }

  editForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = "";

  ngOnInit(): void {
    this.loadTopics();
    this.myInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.editForm.patchValue({
          username: this.myInfo.username,
          mail: this.myInfo.email,
          password: '' // Password should not be pre-filled for security reasons
        });
  }

  loadTopics(): void {
    this.subscribedTopic.getSubscribedTopics().subscribe({
      next: (response: Topics[]) => {
        console.log('Topics loaded:', response);
        this.topics = response;
      },
      error: (error) => {
        console.error('Error loading topics:', error);
      }
    });
  }

  submit(): void {
    if (this.editForm.valid) {
      const formDataToSend: { [key: string]: any } = {};

      const usernameControl = this.editForm.get('username');
      if (usernameControl && usernameControl.dirty && usernameControl.value !== '') {
        formDataToSend['username'] = usernameControl.value;
      }

      const mailControl = this.editForm.get('mail');
      if (mailControl && mailControl.dirty && mailControl.value !== '') {
        formDataToSend['mail'] = mailControl.value;
      }

      const passwordControl = this.editForm.get('password');
      if (passwordControl && passwordControl.dirty && passwordControl.value !== '') {
        formDataToSend['password'] = passwordControl.value;
      }

      if (Object.keys(formDataToSend).length === 0) {
        console.log("Aucun changement détecté. Requête de mise à jour non envoyée.");
        this.showErrorMessage("Aucun changement à enregistrer.");
        return; // Sort de la fonction sans envoyer la requête
      }

      console.log('Form data to send (only modified fields):', formDataToSend);
      this.editProfileService.editProfile(formDataToSend).subscribe({
        next: () => {
          console.log("Profil mis à jour avec succès");
          this.editForm.markAsPristine();
          this.editForm.markAsUntouched();
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour du profil", err);
          if (err.error && err.error.message === 'Le mot de passe ne respecte pas les critères de complexité.') {
              this.showErrorMessage(`Le mot de passe doit contenir :
              - Au moins 8 caractères
              - Au moins un chiffre
              - Au moins une lettre minuscule
              - Au moins une lettre majuscule
              - Au moins un caractère spécial`);
          } else if (err.error && err.error.message) {
              this.showErrorMessage(err.error.message);
          } else {
              this.showErrorMessage("Une erreur est survenue lors de la mise à jour du profil.");
          }
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

  reloadAllTopics(): void {
    console.log('Reloading topics...');
    this.topics = [];
    this.loadTopics();
  }
}
