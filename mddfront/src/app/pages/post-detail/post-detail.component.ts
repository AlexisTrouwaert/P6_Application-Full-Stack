import { Component, OnInit } from '@angular/core';
import { GetPostByIdService } from '../../services/posts/get-post-by-id.service';
import { ActivatedRoute } from '@angular/router';
import { Posts } from '../../models/posts';
import { PostCardComponent } from '../../UIComponents/post-card/post-card.component';
import { CommonModule } from '@angular/common';
import { CommentsFormService } from '../../services/form/comments/comments-form.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostCommentService } from '../../services/comments/post-comment.service';
import { ButtonsComponent } from "../../UIComponents/buttons/buttons.component";
import { UserInfo } from '../../models/user-info';
import { Comments } from '../../models/comments';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    PostCardComponent,
    CommonModule,
    ReactiveFormsModule,
    ButtonsComponent
],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {

  constructor(
    private getPostByIDService: GetPostByIdService,
    private route: ActivatedRoute,
    private createCommentFormService: CommentsFormService,
    private sendComment: PostCommentService
  ) {
    this.createCommentform = this.createCommentFormService.createCommentForm();
   }

  createCommentform!: FormGroup

  myInfo: UserInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');

  postId!: number;
  post! : Posts;
  comments!: Comments[];

  showError: boolean = false;
  errorMessage: string = "";

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.createCommentform.patchValue({
      postId: this.postId // Ensure postId is included in the form data
    });
    this.getPostByIDService.getPostById(this.postId.toString()).subscribe({
      next: (post) => {
        console.log("Post retrieved successfully:", post);
        this.post = post;
      },
      error: (err) => {
        console.error("Error retrieving post:", err);
      }
    });
    this.loadComments();
  }

  loadComments(): void {
    this.sendComment.getCommentsByPostId(this.postId.toString()).subscribe({
      next: (comments) => {
        console.log("Comments retrieved successfully:", comments);
        this.comments = comments;
        console.log(this.postId)
      },
      error: (err) => {
        console.error("Error retrieving comments:", err);
      }
    });
  }

  submit(): void {
    console.log("Submitting comment:", this.createCommentform.value);
    if (this.createCommentform.valid) {
      const formData = this.createCommentform.value;
      formData.postId = this.postId; // Ensure postId is included in the form data
      console.log('Comment data:', formData);
      this.sendComment.sendComment(formData).subscribe({
        next: () => {
          console.log("Comment posted successfully");
          this.createCommentform.reset();
          this.createCommentform.patchValue({
            postId: this.postId // Ensure postId is included in the form data
          });
          this.loadComments();
        },
        error: (err) => {
          console.error("Error posting comment:", err);
        }
      });
    } else {
      console.error("Comment form is invalid");
      this.showErrorMessage("Un commentaire doit contenir entre 8 et 50 caratéres.")
    }
  }

  deleteComment(commentId: number): void {
    console.log("Deleting comment with ID:", commentId);
    this.sendComment.deleteComment(commentId).subscribe({
      next: () => {
        console.log("Comment deleted successfully");
        this.loadComments();
      },
      error: (err) => {
        console.error("Error deleting comment:", err);
      }
    });
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
