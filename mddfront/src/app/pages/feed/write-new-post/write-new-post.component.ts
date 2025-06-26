import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonsComponent } from '../../../UIComponents/buttons/buttons.component';
import { CreatePostFormService } from '../../../services/form/posts/create-post-form.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePostService } from '../../../services/posts/create-post.service';

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

  @Output() closeWritePost = new EventEmitter<void>();

  @Input() topics!: any[];
  
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
      console.error("Form is invalid", this.createForm.errors);
      // Optionally, you can display an error message to the user
      alert("Please fill in all required fields correctly.");
    }
  }

}
