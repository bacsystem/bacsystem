import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  contact: Contact = null!;
  contactForm: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.contact = {
      name: "",
      address: "Av. B 200 Lima",
      email: "cbaciliod@gmail.com",
      phone: "+51 907 892 868",
    };
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.isSubmitted = false;

      this.http.post('/api/contact', this.contactForm.value).subscribe({
        next: (response: any) => {
          this.isSubmitted = true;
          this.isLoading = false;
          console.log('Form submitted successfully:', response);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error sending message:', error);
          alert('Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo.');
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}


interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
}
