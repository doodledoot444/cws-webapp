import { Resend } from 'resend';
import { getRequiredEnv } from '@/lib/env';

function getResendConfig() {
  const apiKey = getRequiredEnv('RESEND_API_KEY', 'email delivery');
  const from = getRequiredEnv('EMAIL_FROM', 'email delivery');

  return { apiKey, from, replyTo: process.env.EMAIL_REPLY_TO };
}

function getAppUrl() {
  return process.env.APP_URL || 'http://localhost:3000';
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string | null,
  baseUrl?: string
) {
  const { apiKey, from, replyTo } = getResendConfig();
  const resend = new Resend(apiKey);
  const appUrl = baseUrl || getAppUrl();
  const verificationUrl = `${appUrl}/verify?token=${token}`;

  const { error } = await resend.emails.send({
    from,
    to: email,
    ...(replyTo ? { replyTo } : {}),
    subject: 'Verify your Ceris Water Station account',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background:#0d1219;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1219;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:15px;font-weight:700;letter-spacing:0.08em;color:#5fa8ff;text-transform:uppercase;">
                Ceris Water Station
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#141b24;border:1px solid #283447;border-radius:20px;padding:40px 36px;">

              <!-- Icon -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <div style="display:inline-block;width:52px;height:52px;background:#1b2430;border-radius:14px;text-align:center;line-height:52px;font-size:24px;">
                      ✉
                    </div>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#e7eef8;letter-spacing:-0.3px;">
                      Confirm your email
                    </h1>
                  </td>
                </tr>

                <!-- Summary -->
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:#8796ab;line-height:1.65;max-width:400px;">
                      Hi ${name || 'there'} — thanks for signing up. One quick step before you can start ordering:
                      verify your email address to activate your account.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:28px;">
                    <div style="height:1px;background:#283447;"></div>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <a href="${verificationUrl}"
                       style="display:inline-block;background:#5fa8ff;color:#041425;text-decoration:none;font-size:14px;font-weight:700;padding:13px 32px;border-radius:12px;letter-spacing:0.01em;">
                      Verify my email
                    </a>
                  </td>
                </tr>

                <!-- Fallback link -->
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:12px;color:#8796ab;">
                      Button not working?
                      <a href="${verificationUrl}" style="color:#5fa8ff;text-decoration:none;">Copy this link</a>
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <div style="height:1px;background:#283447;"></div>
                  </td>
                </tr>

                <!-- Expiry notice -->
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:12px;color:#8796ab;line-height:1.6;">
                      This link expires in <strong style="color:#b4c0d0;">15 minutes</strong>.<br/>
                      If you did not create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#8796ab;">
                &copy; ${new Date().getFullYear()} Ceris Water Station. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });

  if (error) {
    throw new Error(`Resend failed to deliver email: ${error.message}`);
  }
}
