const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendContactEmail({ name, email, message }) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [process.env.CONTACT_EMAIL],

    // When you click Reply in Gmail, it replies to the customer.
    replyTo: email,

    subject: `New Contact Message from ${name}`,

    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;padding:40px;">

            <h1 style="margin:0 0 8px;color:#111111;font-size:24px;">
              SELA Athleisure
            </h1>

            <p style="margin:0 0 30px;color:#777777;font-size:13px;">
              New contact form submission
            </p>

            <div style="border-top:1px solid #eeeeee;padding-top:24px;">

              <p style="margin:0 0 12px;">
                <strong>Name:</strong> ${escapeHtml(name)}
              </p>

              <p style="margin:0 0 12px;">
                <strong>Email:</strong> ${escapeHtml(email)}
              </p>

              <p style="margin:24px 0 8px;">
                <strong>Message:</strong>
              </p>

              <div style="background:#f8f8f8;padding:20px;line-height:1.6;color:#333333;">
                ${escapeHtml(message).replace(/\n/g, '<br />')}
              </div>

            </div>

            <p style="margin:30px 0 0;color:#999999;font-size:12px;">
              This message was submitted through the SELA Athleisure website.
            </p>

          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message || 'Failed to send email');
  }

  return data;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = {
  sendContactEmail,
};
