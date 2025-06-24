import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss'
})
export class ButtonsComponent {

  @Input() label: string = 'Button';
  @Input() type: 'button' | 'submit' | 'reset' | 'back' = 'button';
  @Input() disabled: boolean = false;
  @Input() typeButton: 'primary' | 'secondary' | 'tertiary' = 'primary';

}
