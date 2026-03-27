import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  contact: Contact = null!;
  contactForm: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor(private readonly fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.contact = {
      address: "Av. B 200 Lima",
      email: "bacsystem.sac@gmail.com",
      phone: "+51 907 892 868",
    };
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isSubmitted = true;
        this.isLoading = false;
      }, 2000);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.contactForm.reset();
  }
}


interface Contact {
  email: string;
  phone: string;
  address: string;
}
