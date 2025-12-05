import nodemailer from 'nodemailer';


export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig();  
  const body = await readBody(event);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: body.email,
    to: config.CONTACT_MAIL,
    subject: `From customer page`, 
    text: `Message from ${body.name || 'a visitor'} (${body.email}): ${body.message}`, 
  };

  try {
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    return new Response(JSON.stringify(
      { success: false, message: 'Failed to send email', error:error }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500
  
    });
  }
});
