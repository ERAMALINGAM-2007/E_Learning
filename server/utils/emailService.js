import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Store reset tokens temporarily (in production, use Redis or database)
const resetTokens = new Map();

// Configure email transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports (587 uses STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready to send emails');
  }
});

/**
 * Generate a secure reset token
 * @param {string} email - User's email
 * @returns {string} - Generated token
 */
export function generateResetToken(email) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 3600000; // 1 hour from now

  resetTokens.set(token, {
    email,
    expiresAt,
  });

  // Auto-cleanup expired tokens after 1 hour
  setTimeout(() => {
    resetTokens.delete(token);
  }, 3600000);

  return token;
}

/**
 * Verify if a reset token is valid
 * @param {string} token - Reset token
 * @returns {Object|null} - Token data or null if invalid
 */
export function verifyResetToken(token) {
  const tokenData = resetTokens.get(token);

  if (!tokenData) {
    return null;
  }

  if (Date.now() > tokenData.expiresAt) {
    resetTokens.delete(token);
    return null;
  }

  return tokenData;
}

/**
 * Invalidate a reset token after use
 * @param {string} token - Reset token
 */
export function invalidateToken(token) {
  resetTokens.delete(token);
}

/**
 * Send password reset email
 * @param {string} recipientEmail - User's email
 * @param {string} resetToken - Generated reset token
 * @returns {Promise<boolean>} - Success status
 */
export async function sendPasswordResetEmail(recipientEmail, resetToken) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: {
      name: 'Cognition AI Learning',
      address: process.env.EMAIL_USER,
    },
    to: recipientEmail,
    subject: 'Password Reset Request - Cognition AI Learning',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            padding: 40px;
            text-align: center;
          }
          .content {
            background: white;
            border-radius: 8px;
            padding: 30px;
            margin-top: 20px;
          }
          h2 {
            color: white;
            margin: 0 0 20px 0;
          }
          .btn {
            display: inline-block;
            padding: 14px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .btn:hover {
            background: #5568d3;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
            text-align: left;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: rgba(255,255,255,0.8);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔐 Password Reset Request</h2>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password for your Cognition AI Learning account.</p>
            <p>Click the button below to reset your password:</p>
            
            <a href="${resetLink}" class="btn">Reset My Password</a>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
            
            <p style="font-size: 14px; color: #666;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <code style="background: #f5f5f5; padding: 8px; display: block; margin-top: 10px; word-break: break-all;">
                ${resetLink}
              </code>
            </p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #999;">
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Cognition AI Learning. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Request

We received a request to reset your password for your Cognition AI Learning account.

Click this link to reset your password:
${resetLink}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

---
© ${new Date().getFullYear()} Cognition AI Learning
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}
