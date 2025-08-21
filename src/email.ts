import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Person, SendResult } from './types.js';

dotenv.config();

const {
  SMTP_USER,
  SMTP_PASS,
  FROM_NAME,
  FROM_EMAIL,
} = process.env;


function getTransport() {
  if (!SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
    throw new Error('Missing SMTP env vars. Check your .env');
  }


  const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 👈 accept self-signed certificates
  },
});

  return transporter;
}

// Escape HTML utility function
function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => {
    const escapeMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return escapeMap[char];
  });
}

// export async function sendBulk(
//   people: Person[],
//   subject: string,
//   message: string
// ): Promise<SendResult[]> {
//   const transporter = getTransport();
//   const results: SendResult[] = [];

//   for (const person of people) {
//     try {
//       const info = await transporter.sendMail({
//         from: {
//           name: FROM_NAME || 'Marketing',
//           address: FROM_EMAIL!,
//         },
//         to: `${person.name} <${person.email}>`,
//         subject,
//         text: message,
//         html: `<p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
//       });

//       results.push({ person, success: true });
//     } catch (err: any) {
//       results.push({
//         person,
//         success: false,
//         error: err?.message || String(err),
//       });
//     }
//   }

//   return results;
// }


export async function sendBulk(
  people: Person[],
  subject: string,
  message: string
): Promise<SendResult[]> {
  const transporter = getTransport();
  const results: SendResult[] = [];

  for (const person of people) {
    try {
      // personalize the message
      const personalizedMessage = `Hi ${escapeHtml(person.name)},\n\n${message}`;

      const info = await transporter.sendMail({
        from: {
          name: FROM_NAME || 'Marketing',
          address: FROM_EMAIL!,
        },
        to: `${person.name} <${person.email}>`,
        subject,
        text: personalizedMessage, // plain text fallback
        html: `
          <div style="font-family: Arial, sans-serif; padding:20px; line-height:1.6; background:#f9f9f9;">
            <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
              <h2 style="color:#2c3e50;">Hello ${escapeHtml(person.name)}, 👋</h2>
              <p style="font-size:16px; color:#444;">${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
              <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;"/>
              <p style="font-size:13px; color:#888;">Sent by ${FROM_NAME || 'Our Team'} • Please do not reply directly</p>
            </div>
          </div>
        `,
      });

      results.push({ person, success: true });
    } catch (err: any) {
      results.push({
        person,
        success: false,
        error: err?.message || String(err),
      });
    }
  }

  return results;
}
