const { sendContactEmail } = require('./contact.service');

async function submitContactForm(req, res) {
  try {
    const { name, email, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Name is required',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required',
      });
    }

    const emailData = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return res.status(200).json({
      status: 'success',
      message: 'Your message has been sent successfully.',
      data: emailData,
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to send your message. Please try again later.',
    });
  }
}

module.exports = {
  submitContactForm,
};
