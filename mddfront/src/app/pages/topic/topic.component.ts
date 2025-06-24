import { Component, OnInit } from '@angular/core';
import { TopicCardComponent } from "../../UIComponents/topic-card/topic-card.component";
import { GetAllTopicService } from '../../services/topic/get-all-topic.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [
    TopicCardComponent,
    CommonModule
],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.scss'
})
export class TopicComponent implements OnInit {

  topics: any[] = [];

  constructor(
      private getAllTopicsService: GetAllTopicService,
      private router : Router
    ) { }

  ngOnInit(): void {
    this.loadTopics();
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
}
