import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Status } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' }) // Validation: must not be empty
  name!: string;

  @IsEmail({}, { message: 'Invalid email format' }) // Validation: must be a valid email
  @IsOptional() // Field is optional in the request
  email?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsEnum(Status, { message: 'Invalid status value' }) // Validation: must match defined Enum values
  @IsOptional()
  status?: Status;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
