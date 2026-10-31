import { Pipe, PipeTransform } from '@angular/core';
import { WHATSAPP_HREF } from '../../data/site.data';

/** A (translated) message → the wa.me link that opens a chat with SITE.phone and that message written. */
@Pipe({ name: 'whatsapp', standalone: true })
export class WhatsappPipe implements PipeTransform {
  transform(message: string | null | undefined): string {
    return message ? `${WHATSAPP_HREF}?text=${encodeURIComponent(message)}` : WHATSAPP_HREF;
  }
}
