import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonsComponent } from '../buttons/buttons.component';

@Component({
  selector: 'app-topic-card',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsComponent
  ],
  templateUrl: './topic-card.component.html',
  styleUrl: './topic-card.component.scss'
})
export class TopicCardComponent {

  @Input() topic!: any;

}
