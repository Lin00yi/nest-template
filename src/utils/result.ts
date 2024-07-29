import { ApiProperty } from '@nestjs/swagger';

export class Result<T> {
  @ApiProperty({ description: '返回状态' })
  success: boolean;

  @ApiProperty({ description: '返回状态码' })
  code: number;

  @ApiProperty({ description: '返回描述' })
  message: string;

  @ApiProperty({ description: '返回数据' })
  data: T;
}
