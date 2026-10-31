import { WhatsappPipe } from './whatsapp.pipe';

describe('WhatsappPipe', () => {
  const pipe = new WhatsappPipe();

  it('opens a chat with the site number and the message written', () => {
    expect(pipe.transform('Hola, ¿qué tal?')).toBe('https://wa.me/51972107074?text=Hola%2C%20%C2%BFqu%C3%A9%20tal%3F');
  });

  it('falls back to the plain chat link without a message', () => {
    expect(pipe.transform('')).toBe('https://wa.me/51972107074');
  });
});
