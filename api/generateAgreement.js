export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      results: [
        {
          toolCallId: req.body.toolCallId,
          error: 'Method not allowed',
        },
      ],
    });
  }

  try {
    const {
      party_one,
      party_two,
      agreement_summary,
      date,
      email_one = 'kaustubhlohani25@gmail.com',
      email_two = 'kaustubhlohani@outlook.com',
      toolCallId,
    } = req.body;

    if (!party_one || !party_two || !agreement_summary || !date || !email_one || !email_two) {
      return res.status(400).json({
        results: [
          {
            toolCallId,
            error: 'Missing required fields',
          },
        ],
      });
    }

    // 1. Generate PDF
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

    // 2. Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Notary AI" <${process.env.SENDER_EMAIL}>`,
      to: email_two,
      subject: 'Your Verbal Agreement Summary',
      text: 'Your agreement summary is attached.',
      attachments: [
        {
          filename: 'agreement.pdf',
          content: pdfBytes,
        },
      ],
    });

    return res.status(200).json({
      results: [
        {
          toolCallId,
          result: 'Agreement generated and email sent successfully',
        },
      ],
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      results: [
        {
          toolCallId: req.body.toolCallId,
          error: 'Internal Server Error',
        },
      ],
    });
  }
}
