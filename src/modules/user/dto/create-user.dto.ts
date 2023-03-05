import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../schemas/user.schema';

export class CreateUserDto extends PickType(User, [
  'firstName',
  'lastName',
  'password',
  'username',
  'email',
]) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  constructor(args?: Partial<CreateUserDto>) {
    super();
    Object.assign(this, args);
  }
}
