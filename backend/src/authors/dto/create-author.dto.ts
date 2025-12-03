import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.K. Rowling' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'British author best known for the Harry Potter series',
    required: false 
  })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiProperty({ 
    example: '1965-07-31',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({ 
    example: 'United Kingdom',
    required: false 
  })
  @IsString()
  @IsOptional()
  country?: string;
}
