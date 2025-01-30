import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  contact: Contact = null!;

  ngOnInit(): void {
    this.contact = {
      name: "",
      address: "Av. B 200 Lima",
      email: "cbaciliod@gmail.com",
      phone: "+51 907 892 868",
    };
  }


}


interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
}
