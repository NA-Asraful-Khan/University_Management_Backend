import nodemailer from 'nodemailer';
import config from './app/config';
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    // Port 587 uses STARTTLS (secure: false). Port 465 uses implicit TLS.
    secure: config.smtp_secure === 'true',
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: config.smtp_from, // sender address
    to, // list of receivers
    subject: 'Reset Password Link', // Subject line
    text: 'Reset Your Password', // plain text body
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
        <tr>
            <td style="padding: 20px;">
                <h1 style="color: #2c3e50; text-align: center;">Password Reset</h1>
                <p style="font-size: 16px;">Dear [User],</p>
                <p style="font-size: 16px;">We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
                <p style="font-size: 16px;">To reset your password, please click the button below:</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <a href="${html}" style="background-color: #3498db; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
                        </td>
                    </tr>
                </table>
                <p style="font-size: 14px; color: #7f8c8d;">This link will expire in 24 hours for security reasons.</p>
                <p style="font-size: 14px;">If you're having trouble clicking the button, you can copy and paste the following URL into your web browser:</p>
                <p style="font-size: 14px; word-break: break-all; color: #3498db;">${html}</p>
                <p style="font-size: 14px;">If you need further assistance, please contact our support team at <a href="mailto:support@example.com" style="color: #3498db; text-decoration: none;">support@example.com</a>.</p>
                <p style="font-size: 14px;">Best regards,<br>Admin Team</p>
            </td>
        </tr>
    </table>
</div>`, // html body
  });
};
