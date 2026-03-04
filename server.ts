import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import nodemailer from 'nodemailer';

// Configuración de nodemailer. 
// Para funcionar en local con correos reales, se deben configurar SMTP_HOST, SMTP_PORT, SMTP_USER, y SMTP_PASS.
// Si no, usará datos por defecto (útil para pruebas si se levanta un servidor mock como Ethereal).
const transporter = nodemailer.createTransport({
  host: process.env['SMTP_HOST'] || 'smtp.ethereal.email',
  port: Number(process.env['SMTP_PORT']) || 587,
  auth: {
    user: process.env['SMTP_USER'] || 'ethereal_user',
    pass: process.env['SMTP_PASS'] || 'ethereal_pass'
  }
});

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  server.use(express.json());

  server.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || typeof name !== 'string' ||
        !email || typeof email !== 'string' ||
        !subject || typeof subject !== 'string' ||
        !message || typeof message !== 'string') {
        res.status(400).json({ success: false, error: 'Datos de contacto inválidos o incompletos' });
        return;
      }

      const escapedName = escapeHtml(name);
      const escapedEmail = escapeHtml(email);
      const escapedSubject = escapeHtml(subject);
      const escapedMessage = escapeHtml(message);

      await transporter.sendMail({
        from: process.env['SMTP_USER'] || "contact@bacsystemsolutions.com",
        to: "contact@bacsystemsolutions.com",
        subject: `Nuevo mensaje de contacto: ${escapedSubject}`,
        text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
        html: `<p><b>Nombre:</b> ${escapedName}</p><p><b>Email:</b> ${escapedEmail}</p><p><b>Mensaje:</b><br/>${escapedMessage.replace(/\n/g, '<br/>')}</p>`
      });

      res.status(200).json({ success: true, message: 'Correo enviado satisfactoriamente' });
    } catch (error) {
      console.error('Error enviando correo:', error);
      res.status(500).json({ success: false, error: 'Hubo un error al enviar el correo' });
    }
  });
  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
