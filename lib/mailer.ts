import nodemailer from 'nodemailer';

function getMailConfig() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('Missing Gmail credentials. Set GMAIL_USER and GMAIL_APP_PASSWORD.');
  }

  return { user, pass };
}

function getAppUrl() {
  return process.env.APP_URL || 'http://localhost:3000';
}

function getTransporter() {
  const { user, pass } = getMailConfig();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

export async function sendVerificationEmail(email: string, token: string, name?: string | null) {
  const { user } = getMailConfig();
  const transporter = getTransporter();
  const verificationUrl = `${getAppUrl()}/verify?token=${token}`;

  await transporter.sendMail({
    from: user,
    to: email,
    subject: 'Verify your Ceris Water Station account',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 12px;">Verify your email</h2>
        <p>Hello ${name || 'Customer'},</p>
        <p>Thanks for registering with Ceris Water Station. Please verify your email address to activate ordering access.</p>
        <p>
          <a href="${verificationUrl}" style="display: inline-block; background: #0ea5e9; color: #ffffff; padding: 12px 18px; border-radius: 10px; text-decoration: none; font-weight: 600;">
            Verify Email
          </a>
        </p>
        <p>If the button does not work, use this link:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      </div>
    `,
  });
}
