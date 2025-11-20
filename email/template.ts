
export const getEmailTemplate = (content: string) => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Jogaad India</title>
  <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
  <!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]-->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #0A2A3A 0%, #1a4a5a 50%, #2B9EB3 100%);
      font-family: 'Inter', Arial, sans-serif;
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background: linear-gradient(135deg, #0A2A3A 0%, #1a4a5a 50%, #2B9EB3 100%);
      padding: 30px 0;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', Arial, sans-serif;
      color: #333333;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      border-radius: 16px;
      overflow: hidden;
      position: relative;
    }
    
    /* Animated Background Pattern */
    .pattern-bg {
      background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(43, 158, 179, 0.03) 10px, rgba(43, 158, 179, 0.03) 20px),
        repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(10, 61, 98, 0.03) 10px, rgba(10, 61, 98, 0.03) 20px);
    }
    
    .header {
      background: linear-gradient(135deg, #0A2A3A 0%, #0A3D62 50%, #2B9EB3 100%);
      padding: 40px 20px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    /* Animated circles in header */
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(43, 158, 179, 0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }
    
    .header::after {
      content: '';
      position: absolute;
      bottom: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(10, 61, 98, 0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite 2s;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    
    .header img {
      max-width: 180px;
      height: auto;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }
    
    .banner {
      background: linear-gradient(135deg, #2B9EB3 0%, #0A3D62 100%);
      padding: 40px 20px;
      text-align: center;
      position: relative;
    }
    
    .banner h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 10px 0;
      line-height: 1.3;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .banner p {
      color: #e0f2f7;
      font-size: 16px;
      margin: 0;
      line-height: 1.5;
    }
    
    .content {
      padding: 40px 30px;
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
      background-color: #ffffff;
      position: relative;
    }
    
    .content h2 {
      color: #0A3D62;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 15px 0;
    }
    
    .content p {
      margin: 0 0 15px 0;
    }
    
    /* Animated Button */
    .cta-button {
      display: inline-block;
      padding: 16px 36px;
      background: linear-gradient(135deg, #2B9EB3 0%, #0A3D62 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 16px;
      margin: 10px 0;
      box-shadow: 0 4px 15px rgba(43, 158, 179, 0.4);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .cta-button::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    
    .cta-button:hover::before {
      width: 300px;
      height: 300px;
    }
    
    /* Decorative wave divider */
    .wave-divider {
      height: 30px;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="%23ffffff"></path></svg>') no-repeat center;
      background-size: cover;
      margin: -1px 0 0 0;
    }
    
    /* Highlight box with shimmer effect */
    .highlight-box {
      background: linear-gradient(135deg, #e8f8fb 0%, #f0f9ff 100%);
      border-left: 4px solid #2B9EB3;
      padding: 20px;
      margin: 25px 0;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(43, 158, 179, 0.15);
    }
    
    .highlight-box::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 3s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }
    
    /* Decorative corner elements */
    .corner-decor {
      position: absolute;
      width: 100px;
      height: 100px;
      opacity: 0.1;
    }
    
    .corner-decor.top-left {
      top: 0;
      left: 0;
      background: linear-gradient(135deg, #2B9EB3 0%, transparent 70%);
      border-radius: 0 0 100px 0;
    }
    
    .corner-decor.bottom-right {
      bottom: 0;
      right: 0;
      background: linear-gradient(-135deg, #0A3D62 0%, transparent 70%);
      border-radius: 100px 0 0 0;
    }
    
    .footer {
      background: linear-gradient(135deg, #0A2A3A 0%, #0A3D62 100%);
      padding: 40px 20px;
      text-align: center;
      color: #b0b8bf;
      position: relative;
    }
    
    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #2B9EB3, transparent);
    }
    
    .footer-links {
      margin: 15px 0;
    }
    
    .footer-links a {
      color: #b0b8bf;
      text-decoration: none;
      margin: 0 12px;
      font-size: 13px;
      transition: color 0.3s ease;
    }
    
    .footer-links a:hover {
      color: #2B9EB3;
    }
    
    .social-icons {
      margin: 25px 0;
    }
    
    /* Animated social icons */
    .social-icon {
      display: inline-block;
      width: 44px;
      height: 44px;
      margin: 0 8px;
      background: linear-gradient(135deg, rgba(43, 158, 179, 0.2) 0%, rgba(10, 61, 98, 0.2) 100%);
      border-radius: 50%;
      text-align: center;
      line-height: 44px;
      transition: all 0.4s ease;
      border: 2px solid transparent;
    }
    
    .social-icon:hover {
      background: linear-gradient(135deg, #2B9EB3 0%, #0A3D62 100%);
      transform: translateY(-5px) scale(1.1);
      border-color: rgba(43, 158, 179, 0.5);
      box-shadow: 0 8px 20px rgba(43, 158, 179, 0.4);
    }
    
    .social-icon img {
      width: 22px;
      height: 22px;
      vertical-align: middle;
      transition: transform 0.3s ease;
    }
    
    .social-icon:hover img {
      transform: rotate(360deg);
    }
    
    /* Tagline with gradient text */
    .tagline {
      margin: 15px 0 0 0;
      font-size: 14px;
      font-weight: 600;
      background: linear-gradient(135deg, #2B9EB3 0%, #5ac8de 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.5px;
    }
    
    @media screen and (max-width: 600px) {
      .main {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .content {
        padding: 30px 20px !important;
      }
      .banner h1 {
        font-size: 24px !important;
      }
      .cta-button {
        display: block !important;
        margin: 15px 0 !important;
      }
      .social-icon {
        width: 40px !important;
        height: 40px !important;
        line-height: 40px !important;
        margin: 0 6px !important;
      }
    }
  </style>
 </head>
 <body style="margin:0;padding:0;">
  <center class="wrapper">
    <table class="main" width="100%" style="max-width:600px;">
      <!-- Header with animated background -->
      <tr>
        <td class="header">
          <a href="https://jogaadindia.com" target="_blank" style="text-decoration:none;">
            <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" alt="Jogaad India" style="display:block;margin:0 auto;max-width:180px;height:auto;">
          </a>
        </td>
      </tr>

      <!-- Wave Divider -->
      <tr>
        <td class="wave-divider"></td>
      </tr>

      <!-- Content with pattern background -->
      <tr>
        <td class="content pattern-bg">
          <div class="corner-decor top-left"></div>
          ${content}
          <div class="corner-decor bottom-right"></div>
        </td>
      </tr>

      <!-- Footer with gradient -->
      <tr>
        <td class="footer">
          <!-- Social Icons with hover animations -->
          <div class="social-icons">
            <a href="https://www.facebook.com/profile.php?id=61583383065934" class="social-icon" target="_blank" style="text-decoration:none;">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width:22px;height:22px;vertical-align:middle;">
            </a>
            <a href="https://www.instagram.com/jogaadindia25/" class="social-icon" target="_blank" style="text-decoration:none;">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width:22px;height:22px;vertical-align:middle;">
            </a>
            <a href="https://x.com/jogaadindia" class="social-icon" target="_blank" style="text-decoration:none;">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width:22px;height:22px;vertical-align:middle;">
            </a>
            <a href="http://www.linkedin.com/in/jogaad-india-40833a357" class="social-icon" target="_blank" style="text-decoration:none;">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" style="width:22px;height:22px;vertical-align:middle;">
            </a>
          </div>

          <!-- Footer Links -->
          <div class="footer-links" style="margin:20px 0;">
            <a href="https://jogaadindia.com" style="color:#b0b8bf;text-decoration:none;margin:0 12px;font-size:13px;">Home</a>
            <a href="https://jogaadindia.com/about" style="color:#b0b8bf;text-decoration:none;margin:0 12px;font-size:13px;">About</a>
            <a href="https://jogaadindia.com/services" style="color:#b0b8bf;text-decoration:none;margin:0 12px;font-size:13px;">Services</a>
            <a href="https://jogaadindia.com/contact" style="color:#b0b8bf;text-decoration:none;margin:0 12px;font-size:13px;">Contact</a>
          </div>

          <!-- Legal Links -->
          <div style="margin:15px 0;font-size:12px;">
            <a href="https://jogaadindia.com/privacy" style="color:#8b9299;text-decoration:none;margin:0 10px;">Privacy Policy</a>
            <span style="color:#4a5258;">•</span>
            <a href="https://jogaadindia.com/terms" style="color:#8b9299;text-decoration:none;margin:0 10px;">Terms</a>
            <span style="color:#4a5258;">•</span>
            <a href="https://jogaadindia.com/refund" style="color:#8b9299;text-decoration:none;margin:0 10px;">Refund Policy</a>
          </div>

          <!-- Copyright -->
          <p style="margin:20px 0 0 0;font-size:13px;color:#8b9299;">
            &copy; ${new Date().getFullYear()} Jogaad India. All rights reserved.<br>
            <a href="https://jogaadindia.com" style="color:#2B9EB3;text-decoration:none;">www.jogaadindia.com</a>
          </p>
          
          <!-- Animated Tagline -->
          <p class="tagline">
            Customer Satisfaction is Our Solution
          </p>
        </td>
      </tr>
    </table>
  </center>
 </body>
</html>
  `;
};
