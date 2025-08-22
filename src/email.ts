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
    service: 'gmail', // or 'outlook'
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // allow self-signed certs if needed
    },
  });

  return transporter;
}

// Escape HTML safely first
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

// Convert **bold** + [link](url) + newlines into HTML
function formatMessage(raw: string): string {
  let html = escapeHtml(raw);

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Links: [text](http://...)
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Line breaks
  html = html.replace(/\n/g, '<br/>');

  return html;
}

export async function sendBulk(
  people: Person[],
  subject: string,
  message: string
): Promise<SendResult[]> {
  const transporter = getTransport();
  const results: SendResult[] = [];

  for (const person of people) {
    try {
      // Plain text fallback
      const personalizedText = `Hi ${person.name},\n\n${message}`;

      // HTML formatted
      const personalizedHtml = `
        <div style="font-family: Arial, sans-serif; padding:20px; line-height:1.6; background:#f9f9f9;">
          <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color:#2c3e50;">Hello ${escapeHtml(person.name)}, 👋</h2>
            <p style="font-size:16px; color:#444;">${formatMessage(message)}</p>
            <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;"/>
            <p style="font-size:13px; color:#888;">Sent by ${FROM_NAME || 'Our Team'} • Please do not reply directly</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: {
          name: FROM_NAME || 'Sproutern',
          address: FROM_EMAIL!,
        },
        to: `${person.name} <${person.email}>`,
        subject,
        text: personalizedText,
        html: personalizedHtml,
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
