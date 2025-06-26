import { Component, OnInit } from '@angular/core';
import { GetPostByIdService } from '../../services/posts/get-post-by-id.service';
import { ActivatedRoute } from '@angular/router';
import { Posts } from '../../models/posts';
import { PostCardComponent } from '../../UIComponents/post-card/post-card.component';
import { CommonModule } from '@angular/common';
import { CommentsFormService } from '../../services/form/comments/comments-form.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostCommentService } from '../../services/comments/post-comment.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    PostCardComponent,
    CommonModule,
    ReactiveFormsModule
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

  postId!: number;
  post! : Posts;

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.getPostByIDService.getPostById(this.postId.toString()).subscribe({
      next: (post) => {
        console.log("Post retrieved successfully:", post);
        this.post = post;
      },
      error: (err) => {
        console.error("Error retrieving post:", err);
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
          // Optionally, you can refresh the post or comments here
        },
        error: (err) => {
          console.error("Error posting comment:", err);
        }
      });
    }
  }



}
