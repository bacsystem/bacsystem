import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export default class ButtonComponent {

  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'menu' = 'success';
  @Input() icon: string | null = null;
  @Output() click: EventEmitter<void> = new EventEmitter();


  onClick(): void {
    this.click.emit();
  }

}
