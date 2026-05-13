import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { welcomeEmailTemplate } from 'src/core/common/email/templates/welcome-email.template';

@Injectable()
export class NotifierService {
  private resend: Resend;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>(ENV_KEYS.RESEND_API_KEY);
    this.resend = new Resend(resendApiKey);
    this.fromEmail = 'onboarding@resend.dev';
  }

  async sendWelcomeEmail(email: string, userName?: string): Promise<void> {
    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Добро пожаловать в NPS.GOV',
        html: welcomeEmailTemplate(userName),
      });

      if (result.error) {
        throw new InternalServerErrorException('Не удалось отправить приветственное письмо');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendNotificationEmail(
    email: string,
    subject: string,
    content: string,
  ): Promise<void> {
    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject,
        html: content,
      });

      if (result.error) {
        throw new InternalServerErrorException('Не удалось отправить уведомление');
      }
    } catch (error) {
      console.error('Error sending notification email:', error);
    }
  }

  async sendSurveyNotification(
    email: string,
    surveyTitle: string,
    surveyLink: string,
  ): Promise<void> {
    const content = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; background: #051124; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Новый опрос доступен!</h2>
          <p>Приглашаем вас принять участие в опросе: <strong>${surveyTitle}</strong></p>
          <p>Ваше мнение важно для развития нашего региона!</p>
          <a href="${surveyLink}" class="button">Пройти опрос</a>
          <p style="color: #666; font-size: 14px;">Если вы не хотите участвовать в этом опросе, просто проигнорируйте это письмо.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendNotificationEmail(
      email,
      'Новый опрос на NPS.GOV',
      content,
    );
  }
}
