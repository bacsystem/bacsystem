// functions/api/contact.ts

interface ContactData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function onRequestPost(context: any) {
    try {
        const data: ContactData = await context.request.json();

        // Validate payload
        if (!data.name || typeof data.name !== 'string' ||
            !data.email || typeof data.email !== 'string' ||
            !data.subject || typeof data.subject !== 'string' ||
            !data.message || typeof data.message !== 'string') {
            return new Response(JSON.stringify({ success: false, error: 'Datos de contacto inválidos o incompletos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const escapedName = escapeHtml(data.name);
        const escapedEmail = escapeHtml(data.email);
        const escapedSubject = escapeHtml(data.subject);
        const escapedMessage = escapeHtml(data.message);

        // Build the email payload for MailChannels
        const emailPayload = {
            personalizations: [
                {
                    to: [{ email: "contact@bacsystemsolutions.com", name: "Contacto Bacsystem" }],
                },
            ],
            from: {
                email: "no-reply@bacsystemsolutions.com",
                name: "Bacsystem Web Form",
            },
            reply_to: {
                email: data.email,
                name: data.name,
            },
            subject: `Nuevo mensaje de contacto: ${escapedSubject}`,
            content: [
                {
                    type: "text/plain",
                    value: `Nombre: ${data.name}\nEmail: ${data.email}\n\nMensaje:\n${data.message}`,
                },
                {
                    type: "text/html",
                    value: `<p><b>Nombre:</b> ${escapedName}</p><p><b>Email:</b> ${escapedEmail}</p><p><b>Mensaje:</b><br/>${escapedMessage.replace(/\\n/g, '<br/>')}</p>`,
                },
            ],
        };

        // Send the email via MailChannels native Cloudflare integration
        const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(emailPayload),
        });

        if (response.ok) {
            return new Response(JSON.stringify({ success: true, message: 'Correo enviado satisfactoriamente' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            const errorText = await response.text();
            console.error('MailChannels Error:', errorText);
            return new Response(JSON.stringify({ success: false, error: 'Hubo un error al procesar el correo con MailChannels.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('Function Error:', error);
        return new Response(JSON.stringify({ success: false, error: 'Ocurrió un error interno en el servidor.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
