import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { WebResponse } from '../model/web.model';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { Logger } from 'winston';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
  constructor(
    private addressService: AddressService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    const result = await this.addressService.create(user, request);
    return {
      code: HttpStatus.CREATED,
      msg: 'ok',
      data: result,
    };
  }

  @Get('/:addressId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<WebResponse<AddressResponse>> {
    const request: GetAddressRequest = {
      contact_id: contactId,
      address_id: addressId,
    };
    this.logger.info({ request });
    const result = await this.addressService.get(user, request);
    return {
      code: HttpStatus.OK,
      msg: 'ok',
      data: result,
    };
  }

  @Put('/:addressId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() request: UpdateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    request.id = addressId;
    this.logger.info({ request });
    const result = await this.addressService.update(user, request);
    return {
      code: HttpStatus.OK,
      msg: 'ok',
      data: result,
    };
  }

  @Delete('/:addressId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<WebResponse<boolean>> {
    const request: GetAddressRequest = {
      contact_id: contactId,
      address_id: addressId,
    };
    await this.addressService.remove(user, request);
    return {
      code: HttpStatus.OK,
      msg: 'ok',
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<AddressResponse[]>> {
    const result = await this.addressService.list(user, contactId);
    return {
      code: HttpStatus.OK,
      msg: 'ok',
      data: result,
    };
  }
}
