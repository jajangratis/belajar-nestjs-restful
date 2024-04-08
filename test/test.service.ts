import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { JWTService } from '../src/common/jwt.service';
import { LoginUserRequest } from 'src/model/user.model';
import { Address, Contact, User } from '@prisma/client';
import { ContactResponse } from 'src/model/contact.model';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JWTService,
  ) {}

  async deleteAddress() {
    await this.prismaService.address.deleteMany();
  }
  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async getUser(): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }
  async getContact(): Promise<Contact> {
    return await this.prismaService.contact.findFirst({
      where: {
        username: 'test',
      },
    });
  }
  async getAddress(): Promise<Address> {
    return await this.prismaService.address.findFirst({
      where: {
        contact: {
          username: 'test',
        },
      },
    });
  }

  async createUser() {
    await this.prismaService.user.createMany({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
      },
      skipDuplicates: true,
    });
  }
  async createContact(): Promise<ContactResponse> {
    return await this.prismaService.contact.create({
      data: {
        username: 'test',
        first_name: 'test',
        last_name: 'test',
        email: 'test@gmail.com',
        phone: '081234567228',
      },
    });
  }

  async createAddress() {
    const contact = await this.getContact();
    return await this.prismaService.address.create({
      data: {
        city: 'test',
        country: 'test',
        street: 'test',
        province: 'test',
        postal_code: 'test',
        contact_id: contact.id,
      },
    });
  }
  async generateToken(): Promise<string> {
    const data: LoginUserRequest = {
      username: 'test',
      password: 'test',
    };
    const token = await this.jwtService.signToken(data);
    return token;
  }

  async deleteAll() {
    await this.deleteAddress();
    await this.deleteContact();
    await this.deleteUser();
  }
}
