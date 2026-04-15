import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsUUID,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Comment cannot be empty' }) // Ensure content is not just whitespace
  @MaxLength(500, { message: 'Comment is too long (max 500 characters)' }) // Prevent database overflow
  text!: string;

  @IsUUID('all', { message: 'Invalid Lead ID format' }) // Validate relation to the parent Lead
  @IsNotEmpty()
  leadId!: string;
}
