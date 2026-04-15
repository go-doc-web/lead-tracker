import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Full name of the lead',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' }) // Validation: must not be empty
  name!: string;

  @ApiPropertyOptional({
    description: 'Email address of the lead',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' }) // Validation: must be a valid email
  @IsOptional() // Field is optional in the request
  email?: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Tech Solutions Inc.',
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({
    description: 'Current status of the lead',
    enum: Status,
    example: Status.NEW,
  })
  @IsEnum(Status, { message: 'Invalid status value' }) // Validation: must match defined Enum values
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional({
    description: 'Potential deal value',
    example: 5000,
  })
  @IsNumber()
  @IsOptional()
  value?: number;
  @ApiPropertyOptional({
    description: 'Additional notes regarding the lead',
    example: 'Requested a callback on Friday',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
