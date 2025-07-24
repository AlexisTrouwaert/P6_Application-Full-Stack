import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ButtonsComponent } from '../../UIComponents/buttons/buttons.component';
import { GetAllPostsService } from '../../services/posts/get-all-posts.service';
import { GetAllTopicService } from '../../services/topic/get-all-topic.service';
import { Posts } from '../../models/posts';
import { PostCardComponent } from '../../UIComponents/post-card/post-card.component';
import { Subject, takeUntil } from 'rxjs';
import { WriteNewPostComponent } from './write-new-post/write-new-post.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Topics } from '../../models/topics';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsComponent,
    PostCardComponent,
    WriteNewPostComponent,
    FormsModule
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {

  constructor(
    private getAllPostsService: GetAllPostsService,
    private getAllTopicsService: GetAllTopicService,
    private router: Router
  ) { }

  @ViewChild('scrollSentinel', { static: false }) scrollSentinel!: ElementRef;

  private destroy$ = new Subject<void>();
  private scrollObserver!: IntersectionObserver;


  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;
  posts: Posts[] = [];
  topics: Topics[] = [];
  myId!: number;
  sortOrder: string = 'newest';

  shownewPost: boolean = false;

  ngOnInit(): void {
    this.posts = [];
    this.page = 0;
    this.loading = false;
    this.loadTopics();
    const currentUser = localStorage.getItem('currentUser');
    this.myId = currentUser ? JSON.parse(currentUser).id : undefined;
  }

  ngAfterViewInit() {
    if (this.scrollSentinel) {
      this.setupScrollObserver();
      this.loadPosts();
    } else {
      console.warn("scrollSentinel n'a pas été trouvé. Le chargement infini pourrait ne pas fonctionner.");
    }
  }

  setupScrollObserver(): void {
    this.scrollObserver?.disconnect();

    this.scrollObserver = new IntersectionObserver(entries => {
      for (let entry of entries) {
        if (entry.isIntersecting && !this.loading && this.page < this.totalPages - 1) {
          this.page++;
          console.log(`Scroll sentinel intersecté. Chargement de la page : ${this.page}`);
          this.loadPosts();
        }
      }
    }, { threshold: 0.1 });
    this.scrollObserver.observe(this.scrollSentinel.nativeElement);
  }

  loadPosts(): void {
    if (this.loading || this.page >= this.totalPages && this.posts.length > 0) {
      console.log('Skipping loadPosts: already loading or no more pages.');
      return;
    }
    this.loading = true;
    this.getAllPostsService.getAllPosts(this.page, this.size, this.sortOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.posts = [...this.posts, ...response.content];
          this.totalPages = response.totalPages;
          this.loading = false;
          console.log(`Posts chargés (page ${this.page}):`, response.content.length, 'Total posts:', this.posts.length);
          console.log('Total pages:', this.totalPages);
          if (this.page === 0 && this.totalPages > 1) {
            this.setupScrollObserver();
          }
        },
        error: (error) => {
          console.error('Error loading posts:', error);
          this.loading = false;
        }
      });

  }

  loadTopics(): void {
    this.getAllTopicsService.getAllTopics().subscribe({
      next: (response: any) => {
        console.log('Topics loaded:', response);
        this.topics = response;
      },
      error: (error) => {
        console.error('Error loading topics:', error);
      }
    });
  }

  ngOnDestroy() {
    this.scrollObserver?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  reloadAllPosts(): void {
    console.log('Reloading all posts...');
    this.posts = [];
    this.page = 0;
    this.loading = false;
    this.scrollObserver?.disconnect();
    this.setupScrollObserver();
    this.loadPosts();
  }

  redirectToDetails(postId: number): void {
    this.router.navigate(['/details', postId]);
  }

}
