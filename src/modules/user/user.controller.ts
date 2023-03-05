import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { CsvParser } from 'src/providers/csv-parser.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
@ApiTags('User API')
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiOkResponse({ type: UserDto })
  async create(@Body() body: CreateUserDto): Promise<UserDto> {
    try {
      return await this.userService.createUser(body);
    } catch (e) {
      console.log(e);
      this.logger.error(e.message);
      throw new ConflictException(
        `Duplicate key error '${e.keyValue.username || e.keyValue.email || ''}' `,
      );
    }
  }

  @Patch('/update/:_id')
  @ApiOperation({ summary: 'Partially update a user' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async updateById(@Param('_id') _id: string, @Body() body: UpdateUserDto): Promise<UserDto> {
    if (!isValidObjectId(_id)) {
      throw new NotFoundException('Invalid user id');
    }

    try {
      return await this.userService.patchUser(_id, body);
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(`User id '${_id}' not found.`);
    }
  }

  @Delete('/:_id')
  @ApiOperation({ summary: 'Delete a user ' })
  async deleteById(@Param('_id') _id: string): Promise<UserDto> {
    if (!isValidObjectId(_id)) {
      throw new NotFoundException('Invalid user id');
    }

    try {
      return await this.userService.deleteUser(_id);
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(`User id '${_id}' not found.`);
    }
  }

  @Get('/:_id')
  @ApiOperation({ summary: 'Find user by mongo object id' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async getById(@Param('_id') _id: string): Promise<UserDto> {
    if (!isValidObjectId(_id)) {
      throw new NotFoundException('Invalid user id');
    }

    try {
      return await this.userService.findByObjectId(_id);
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(`User id '${_id}' not found.`);
    }
  }

  @Get('/username/:username')
  @ApiOperation({ summary: 'Find user by username' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async getByUsername(@Param('username') username: string): Promise<UserDto> {
    try {
      return await this.userService.findByUserName(username);
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(`User '${username}' not found.`);
    }
  }

  @Post('/search')
  @ApiOperation({ summary: 'Search a user by firstName, lastName or username' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async searchUsers(@Body() search: any): Promise<UserDto[]> {
    const { firstName, lastName, username } = search;

    if (!firstName && !lastName && !username) {
      throw new NotFoundException('At least one query parameter is required');
    }
    const result = await this.userService.searchUsers(firstName, lastName, username);

    if (!result.length) {
      throw new NotFoundException(
        `Relation for ${firstName || ''} ${lastName || ''} ${username || ''} not found.`,
      );
    }
    return result;
  }

  @Post('/seed-data')
  @ApiOperation({ summary: 'Load data from ./seed-data/users.csv into our mongo database' })
  async seedData(): Promise<UserDto[]> {
    const users = await CsvParser.parse('seed-data/users.csv');
    const response = await this.userService.seedUsers(users);

    return response;
  }
}
