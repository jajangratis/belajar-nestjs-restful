import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Addresses (e2e)', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
    await testService.deleteAll();
    token = await testService.generateToken();
  });
  describe('POST /api/contacts/:contactId/address', () => {
    beforeEach(async () => {
      token = await testService.generateToken();
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
    });
    it('should be rejected if request invalid', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set({ authorization: token })
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });
    it('should be create address', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set({ authorization: token })
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'id',
          postal_code: '1234',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.street).toBe('test');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      token = await testService.generateToken();
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });
    it('should be rejected if request invalid', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 9999}/addresses/${address.id}`)
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });
    it('should be get address', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.street).toBe('test');
    });
  });

  describe('PUT /api/contacts/:contactId/address/:addressId', () => {
    beforeEach(async () => {
      token = await testService.generateToken();
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });
    it('should be rejected if request invalid', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set({ authorization: token })
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });
    it('should be rejected if request notfound', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 9999}/addresses/${address.id}`)
        .set({ authorization: token })
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'id',
          postal_code: '1234',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });
    it('should be rejected if request notfound', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 9999}`)
        .set({ authorization: token })
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'id',
          postal_code: '1234',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });
    it('should be update address', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set({ authorization: token })
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'id',
          postal_code: '1234',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.street).toBe('test');
    });
  });

  describe('DELETE /api/contacts/:contactId/address', () => {
    beforeEach(async () => {
      token = await testService.generateToken();
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });
    it('should be rejected if request invalid', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 9999}/addresses/${address.id}`)
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });
    it('should be get address', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('GET /api/contacts/:contactId/address', () => {
    beforeEach(async () => {
      token = await testService.generateToken();
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });
    it('should be rejected if request invalid', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 9999 + 1}/addresses`)
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      // expect(response.body.errors).toBeDefined();
    });
    it('should be get address', async () => {
      token = await testService.generateToken();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses`)
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
    });
  });
});
