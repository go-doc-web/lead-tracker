import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'Client is interested in the premium package',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Comment cannot be empty' }) // Ensure content is not just whitespace
  @MaxLength(500, { message: 'Comment is too long (max 500 characters)' }) // Prevent database overflow
  text!: string;

  @ApiProperty({
    description: 'The unique ID (UUID) of the associated lead',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('all', { message: 'Invalid Lead ID format' }) // Validate relation to the parent Lead
  @IsNotEmpty()
  leadId!: string;
}
