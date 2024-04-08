import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { Logger } from 'winston';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { ValidationService } from '../common/validation.service';
import { ContactValidation } from './contact.validation';
import { Contact, User } from '@prisma/client';
import { WebResponse } from '../model/web.model';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  toContactResponse(contact: Contact): ContactResponse {
    return {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
      id: contact.id,
    };
  }

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `Contact Service: ${user.username} input ${JSON.stringify(request)}`,
    );
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    const contact = await this.prismaService.contact.create({
      data: {
        ...createRequest,
        ...{ username: user.username },
      },
    });

    return this.toContactResponse(contact);
  }

  async checkContactExist(
    username: string,
    contactId: number,
  ): Promise<Contact> {
    return await this.prismaService.contact.findFirst({
      where: {
        username: username,
        id: contactId,
      },
    });
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    const contact = await this.checkContactExist(user.username, contactId);
    if (!contact) {
      throw new HttpException(`data_not_found`, HttpStatus.BAD_REQUEST);
    } else {
      return this.toContactResponse(contact);
    }
  }

  async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const updateRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );
    let contact = await this.checkContactExist(user.username, updateRequest.id);

    contact = await this.prismaService.contact.update({
      where: {
        id: contact.id,
        username: user.username,
      },
      data: updateRequest,
    });

    return this.toContactResponse(contact);
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    const existingData = await this.checkContactExist(user.username, contactId);
    if (!existingData) {
      throw new HttpException(`data_not_found`, HttpStatus.NOT_FOUND);
    }
    const contact = await this.prismaService.contact.delete({
      where: {
        username: user.username,
        id: contactId,
      },
    });
    return this.toContactResponse(contact);
  }

  async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<WebResponse<ContactResponse[]>> {
    const searchRequest: SearchContactRequest = this.validationService.validate(
      ContactValidation.SEARCH,
      request,
    );
    const filters = [];

    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
          },
          {
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }
    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }
    if (searchRequest.phone) {
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }
    if (searchRequest.keyword) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.keyword,
            },
          },
          {
            last_name: {
              contains: searchRequest.keyword,
            },
          },
          {
            email: {
              contains: searchRequest.keyword,
            },
          },
          {
            phone: {
              contains: searchRequest.keyword,
            },
          },
        ],
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const contacts = await this.prismaService.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip,
    });

    const total = await this.prismaService.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts.map((x) => this.toContactResponse(x)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }
}
