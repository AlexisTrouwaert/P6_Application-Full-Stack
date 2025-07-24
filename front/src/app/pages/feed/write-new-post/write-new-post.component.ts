import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonsComponent } from '../../../UIComponents/buttons/buttons.component';
import { CreatePostFormService } from '../../../services/form/posts/create-post-form.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePostService } from '../../../services/posts/create-post.service';
import { Topics } from '../../../models/topics';

@Component({
  selector: 'app-write-new-post',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsComponent,
    ReactiveFormsModule
  ],
  templateUrl: './write-new-post.component.html',
  styleUrl: './write-new-post.component.scss'
})
export class WriteNewPostComponent {

  constructor(
    private createPostForm: CreatePostFormService,
    private router: Router,
    private createPost: CreatePostService
  ) {
    this.createForm = this.createPostForm.getCreatePostForm();
   }

  createForm!: FormGroup;

  showError: boolean = false;
  errorMessage: string = "";

  @Output() closeWritePost = new EventEmitter<void>();

  @Input() topics!: Topics[];
  
  onBackgroundClick(): void {
    this.closeWritePost.emit();
  }

  onNavigationClick(event: Event): void {
    event.stopPropagation();
  }

  submit(): void {
    console.log("Form submitted", this.createForm.value);
    if (this.createForm.valid) {
      const formdata = this.createForm.value;
      console.log('Form data:', formdata);
      this.createPost.createPost(formdata).subscribe({
        next: () => {
          console.log("Article crée avec succès");
          this.closeWritePost.emit();
        },
        error: (err) => {
          console.error("Erreur lors de la création de l'article:", err);
        }
      });
    } else {
      const errors = this.getFormValidationErrors(this.createForm);
      if (errors.length > 0) {
        this.showErrorMessage(errors.join('\n'));
      } else {
        this.showErrorMessage("Veuillez remplir tous les champs correctement.");
      }
      console.error("Formulaire invalide");
    }
  }

  private getFormValidationErrors(form: FormGroup): string[] {
    const errors: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.invalid && (control.dirty || control.touched)) {
        const controlErrors = control.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(errorKey => {
            switch (key) {
              case 'title':
                if (errorKey === 'required') errors.push("Le titre est obligatoire.");
                if (errorKey === 'minlength') errors.push("Le titre doit contenir au moins 4 caractères.");
                break;
              case 'content':
                if (errorKey === 'required') errors.push("Le contenu est obligatoire.");
                if (errorKey === 'minlength') errors.push("Le contenu doit contenir au moins 10 caractères.");
                if (errorKey === 'maxlength') errors.push("Le contenu ne peut pas dépasser 5000 caractères.");
                break;
              case 'topicId':
                if (errorKey === 'required') errors.push("Veuillez sélectionner un sujet.");
                break;
            }
          });
        }
      }
    });
    return errors;
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
