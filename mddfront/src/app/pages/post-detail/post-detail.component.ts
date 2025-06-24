import { Component, OnInit } from '@angular/core';
import { GetPostByIdService } from '../../services/posts/get-post-by-id.service';
import { ActivatedRoute } from '@angular/router';
import { Posts } from '../../models/posts';
import { PostCardComponent } from '../../UIComponents/post-card/post-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    PostCardComponent,
    CommonModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {

  constructor(
    private getPostByIDService: GetPostByIdService,
    private route: ActivatedRoute
  ) { }

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


}
