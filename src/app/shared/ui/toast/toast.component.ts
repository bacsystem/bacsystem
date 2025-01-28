import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export default class ToastComponent implements OnInit {

  @Input() message: string = '';
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input({transform: (): "success" | "warning" | "danger" | "info" => "success"}) type: 'success' | 'warning' | 'danger' | 'info' = 'success';
  visible: boolean = false;

  ngOnInit(): void {
  }

  show() {
    this.visible = true;
    setTimeout(() => this.hide(), 3000)
  }

  hide(): void {
    this.visible = false;
  }

  handleMessage = (type: string) => {
    switch (type) {
      case 'create':
        this.message = 'Create successfully.';
        this.type = 'success';
        this.title = 'Create'
        break;
      case 'update':
        this.message = 'Update successfully.';
        this.type = 'success';
        this.title = 'Update'
        break;
      case 'delete':
        this.message = 'Delete successfully.';
        this.type = 'danger';
        this.title = 'Delete'
        break;
      case 'error':
        this.message = 'Operation unsuccessfully.';
        this.type = 'warning';
        this.title = 'Error'
        break;
      default:
        this.message = 'unsuccessfully.';
        this.type = 'warning';
        this.title = 'Error'
    }

    this.show()
  };
}
