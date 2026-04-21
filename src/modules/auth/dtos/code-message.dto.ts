import { ApiProperty } from '@nestjs/swagger';

export class CodeMessageDto {
  @ApiProperty({ example: 'code sent' })
  message: string;
}
