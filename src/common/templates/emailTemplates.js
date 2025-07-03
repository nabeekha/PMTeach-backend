// utils/emailTemplates.js

const getOtpEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #343A40;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          color: #0177FB;
          font-size: 24px;
          font-weight: bold;
          text-decoration: none;
        }
        .content {
          padding: 20px;
        }
        .otp-container {
          background-color: #F5FAFF;
          border-radius: 4px;
          padding: 15px;
          text-align: center;
          margin: 20px 0;
          border: 1px solid #80BBFD;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #014FA7;
          letter-spacing: 3px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #495057;
          border-top: 1px solid #eee;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #0177FB;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
        }
        .text-muted {
          color: #495057;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">Nayru</a>
        </div>
        
        <div class="content">
          <h2>Email Verification</h2>
          <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
            <p class="text-muted">This code will expire in 10 minutes</p>
          </div>
          
          <p>If you didn't request this, please ignore this email or contact support if you have questions.</p>
          
          <p>Best regards,<br>The Nayru Team</p>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Nayru. All rights reserved.</p>
          <p>If you're having trouble with the button above, copy and paste the OTP code manually.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getPasswordResetTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Reset</title>
      <style>
        /* Same styles as above, can be extracted to a common CSS if needed */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #343A40;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          color: #0177FB;
          font-size: 24px;
          font-weight: bold;
          text-decoration: none;
        }
        .content {
          padding: 20px;
        }
        .otp-container {
          background-color: #F5FAFF;
          border-radius: 4px;
          padding: 15px;
          text-align: center;
          margin: 20px 0;
          border: 1px solid #80BBFD;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #014FA7;
          letter-spacing: 3px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #495057;
          border-top: 1px solid #eee;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #0177FB;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
        }
        .text-muted {
          color: #495057;
        }
        .warning {
          color: #D7263D;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">Nayru</a>
        </div>
        
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Use the following OTP to proceed:</p>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
            <p class="text-muted">This code will expire in 10 minutes</p>
          </div>
          
          <p class="warning">If you didn't request a password reset, please secure your account immediately.</p>
          
          <p>Best regards,<br>The Nayru Team</p>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Nayru. All rights reserved.</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  getOtpEmailTemplate,
  getPasswordResetTemplate,
};
