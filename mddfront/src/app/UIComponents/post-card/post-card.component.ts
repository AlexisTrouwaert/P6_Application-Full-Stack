import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Posts } from '../../models/posts';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { DeleteService } from '../../services/posts/delete.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent implements OnInit {

  constructor(
    private deletePost: DeleteService,
    private router :Router,
    private route: ActivatedRoute
  ) { }

  @Input() post!: Posts;
  @Input() truncate: boolean = true;
  @Input() myId!: number;

  @Output() postDeleted = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.myId) {
      this.myId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    }
  }

  delete(postId: number): void {
    this.deletePost.deletePost(postId).subscribe({
      next: (response) => {
        console.log('Post deleted:', response);
        this.postDeleted.emit(); 
        if(this.route.snapshot.paramMap.get('id')){
          this.router.navigate(['/feed']);
        }
      },
      error: (error) => {
        console.error('Error deleting post:', error);
      }
    });
  }
}
