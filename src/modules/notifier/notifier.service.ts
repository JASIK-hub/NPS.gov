import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { welcomeEmailTemplate } from 'src/core/common/email/templates/welcome-email.template';
import { otpEmailTemplate } from 'src/core/common/email/templates/otp-email.template';

@Injectable()
export class NotifierService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>(ENV_KEYS.MAIL_HOST);
    const port = Number(this.configService.get<number>(ENV_KEYS.MAIL_PORT));
    const user = this.configService.get<string>(ENV_KEYS.MAIL_USER);
    const password = this.configService.get<string>(ENV_KEYS.MAIL_PASSWORD);
    this.fromEmail = this.configService.get<string>(ENV_KEYS.MAIL_FROM) || user || '';

    if (!host || !port || !user || !password) {
      throw new Error('Mail configuration is missing.');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendWelcomeEmail(email: string, userName?: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: email,
        subject: 'Добро пожаловать в NPS.GOV',
        html: welcomeEmailTemplate(userName),
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new InternalServerErrorException('Не удалось отправить приветственное письмо');
    }
  }

  async sendNotificationEmail(
    email: string,
    subject: string,
    content: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: email,
        subject,
        html: content,
      });
    } catch (error) {
      console.error('Error sending notification email:', error);
      throw new InternalServerErrorException('Не удалось отправить уведомление');
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

  async sendOtpCode(email: string, code: string, subject: string = 'Код подтверждения'): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: email,
        subject,
        html: otpEmailTemplate(code),
      });
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new InternalServerErrorException('Не удалось отправить код подтверждения');
    }
  }
}