import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

// Create transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  try {
    if (env.NODE_ENV === 'development' && !env.SMTP_USER) {
      logger.info('Email simulation (no SMTP credentials):');
      logger.info(`To: ${to}`);
      logger.info(`Subject: ${subject}`);
      logger.info(`Content: ${text || html}`);
      return;
    }

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Email service failed');
  }
};
