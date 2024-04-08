import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);
    return {
      code: HttpStatus.CREATED,
      msg: 'Created',
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request);
    return {
      code: HttpStatus.OK,
      msg: 'ok',
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(HttpStatus.OK)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user);
    return {
      code: HttpStatus.OK,
      msg: 'ok',
      data: result,
    };
  }

  @Patch('/current')
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.update(user, request);
    return {
      code: HttpStatus.OK,
      msg: 'ok',
      data: result,
    };
  }

  @Delete('/current')
  @HttpCode(HttpStatus.OK)
  async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
    await this.userService.logout(user);
    return {
      code: HttpStatus.OK,
      msg: 'ok',
      data: true,
    };
  }
}
