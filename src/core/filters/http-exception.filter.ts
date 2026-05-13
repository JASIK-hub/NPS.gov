import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Произошла ошибка. Попробуйте позже.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const obj = exceptionResponse as any;
        message = obj.message || obj.error || message;

        if (Array.isArray(message)) {
          message = message[0];
        }
      }
    }

    const userFriendlyMessages: Record<number, string> = {
      400: 'Неверные данные. Проверьте введенную информацию.',
      401: 'Не авторизован. Войдите в систему.',
      403: 'Нет доступа.',
      404: 'Ресурс не найден.',
      409: 'Конфликт данных. Возможно такой пользователь уже существует.',
      500: 'Ошибка сервера. Попробуйте позже.',
      503: 'Сервис временно недоступен.',
    };

    const finalMessage = userFriendlyMessages[status] || message;

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      success: false,
      message: finalMessage,
      error: finalMessage,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
