// File: /api/generateAgreement.js

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Resend } from 'resend';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { party_one, party_two, agreement_summary, date, email_one, email_two } = req.body;

    if (!party_one || !party_two || !agreement_summary || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();
    const text = `Verbal Agreement Summary\n\nDate: ${date}\n\nParty One: ${party_one}\nParty Two: ${party_two}\n\nAgreement:\n${agreement_summary}\n\nBoth parties confirmed the agreement verbally.`;

    page.drawText(text, {
      x: 50,
      y: height - 100,
      size: 12,
      font,
      lineHeight: 14,
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    // 2. Send Email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const recipients = [email_one, email_two].filter(Boolean);

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No email addresses provided' });
    }

    await resend.emails.send({
      from: 'notary@yourdomain.com',
      to: recipients,
      subject: 'Your Verbal Agreement Summary',
      html: '<p>Your agreement summary is attached as a PDF document.</p>',
      attachments: [
        {
          filename: 'agreement.pdf',
          content: pdfBase64,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
