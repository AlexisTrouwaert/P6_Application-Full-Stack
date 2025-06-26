import { Component, OnInit } from '@angular/core';
import { GetUsersTopicsService } from '../../services/topic/get-users-topics.service';
import { Topics } from '../../models/topics';
import { TopicCardComponent } from '../../UIComponents/topic-card/topic-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil-page',
  standalone: true,
  imports: [
    CommonModule,
    TopicCardComponent
  ],
  templateUrl: './profil-page.component.html',
  styleUrl: './profil-page.component.scss'
})
export class ProfilPageComponent implements OnInit {
  
  topics: Topics[] = [];

  constructor(
    private subscribedTopic: GetUsersTopicsService
  ) 
  {}

  ngOnInit(): void {
    this.loadTopics();
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

  reloadAllTopics(): void {
    console.log('Reloading topics...');
    this.topics = [];
    this.loadTopics();
  }
}
