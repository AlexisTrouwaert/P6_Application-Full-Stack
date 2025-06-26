import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonsComponent } from '../buttons/buttons.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { SubscribeService } from '../../services/subscribe/subscribe.service';
import { UnsubscribeService } from '../../services/subscribe/unsubscribe.service';
import { Topics } from '../../models/topics';

@Component({
  selector: 'app-topic-card',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsComponent,
    TruncatePipe
  ],
  templateUrl: './topic-card.component.html',
  styleUrl: './topic-card.component.scss'
})
export class TopicCardComponent {

  constructor(
    private subscribe: SubscribeService,
    private unsubscribe: UnsubscribeService
  ) { }

  @Input() topic!: Topics;
  @Output() topicChange = new EventEmitter<void>();

  sub(id :number): void {
    this.subscribe.subscribe(id).subscribe({
      next: (response) => {
        console.log('Subscribed to topic:', response);
        this.topic.subscribed = true;
      },
      error: (error) => {
        console.error('Error subscribing to topic:', error);
      }
    });
  }

  unsub(id :number): void {
    this.unsubscribe.subscribe(id).subscribe({
      next: (response) => {
        console.log('Unsubscribed from topic:', response);
        this.topic.subscribed = false;
        this.topicChange.emit();
      },
      error: (error) => {
        console.error('Error unsubscribing from topic:', error);
      }
    });
  }

}
