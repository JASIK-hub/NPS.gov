export const welcomeEmailTemplate = (userName?: string) => `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #051124 0%, #0a1b33 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 20px 0;
      font-size: 16px;
      line-height: 1.7;
    }
    .highlight {
      background: #f0f7ff;
      border-left: 4px solid #051124;
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    .highlight p {
      margin: 0;
      color: #051124;
    }
    .button {
      display: inline-block;
      background: #051124;
      color: white;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 8px;
      font-weight: 600;
      margin: 30px 0;
      transition: background 0.3s;
    }
    .button:hover {
      background: #0a1b33;
    }
    .features {
      background: #f9f9f9;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .features ul {
      margin: 0;
      padding-left: 20px;
    }
    .features li {
      margin-bottom: 12px;
      color: #555;
    }
    .footer {
      background: #f4f4f4;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer p {
      margin: 5px 0;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: white;
      letter-spacing: 2px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NPS.GOV</div>
    </div>

    <div class="content">
      <p>${userName ? `Здравствуйте, ${userName}!` : 'Здравствуйте!'}</p>

      <p>Благодарим вас за регистрацию на платформе <strong>NPS.GOV</strong> — системы общественного участия Республики Казахстан.</p>

      <div class="highlight">
        <p><strong>Ваши данные в безопасности</strong><br>
        Мы гарантируем конфиденциальность и защиту ваших персональных данных. Ваша информация никогда не будет опубликована без вашего согласия.</p>
      </div>

      <p>Теперь вы можете:</p>
      <div class="features">
        <ul>
          <li>Участвовать в общественных опросах и голосованиях</li>
          <li>Влиять на решения в вашем регионе</li>
          <li>Следить за реализацией принятых решений</li>
          <li>Получать уведомления о новых опросах</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/profile" class="button">Перейти в профиль</a>
      </p>

      <p>В своём профиле вы можете подтвердить email для быстрого входа, а также создать пароль для удобного доступа к системе.</p>
    </div>

    <div class="footer">
      <p><strong>NPS.GOV</strong> — Национальная Платформа Общественного Участия</p>
      <p>Это автоматическое письмо. Пожалуйста, не отвечайте на него.</p>
      <p>Если у вас возникли вопросы, обратитесь в службу поддержки.</p>
    </div>
  </div>
</body>
</html>
`;
