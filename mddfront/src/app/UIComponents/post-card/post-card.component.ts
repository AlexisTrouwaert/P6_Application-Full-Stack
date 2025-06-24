import { Component, Input } from '@angular/core';
import { Posts } from '../../models/posts';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../pipes/truncate.pipe';

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
export class PostCardComponent {

  @Input() post!: Posts;
  @Input() truncate: boolean = true;

}
