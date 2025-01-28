import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export default class TextInputComponent {

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() icon: string | null = null;
  @Input() color: string | null = null;
  @Input() disabled: boolean = false;
  @Input() control: FormControl = new FormControl();
  @Output() valueChange: EventEmitter<void> = new EventEmitter();


  onInputChange(): void {
    this.valueChange.emit(this.control.value);
  }
}
