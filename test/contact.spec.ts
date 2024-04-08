import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController (e2e)', () => {
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
  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      token = await testService.generateToken();
      await testService.deleteAll();
      await testService.createUser();
    });
    it('should be rejected if request invalid', async () => {
      token = await testService.generateToken();
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set({ authorization: token })
        .send({
          first_name: '',
          last_name: '',
          email: 'xxx',
          phone: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });

    it('should be able to add contact ', async () => {
      token = await testService.generateToken();
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set({ authorization: token })
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@gmail.com',
          phone: '081234567228',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.code).toBe(HttpStatus.CREATED);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBeDefined();
      expect(response.body.data.last_name).toBeDefined();
      expect(response.body.data.email).toBeDefined();
      expect(response.body.data.phone).toBeDefined();
      await testService.deleteAll();
    });
  });

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      token = await testService.generateToken();
      await testService.createUser();
    });
    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts/999999')
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to add contact and get created contact ', async () => {
      await testService.createContact();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
    });
  });

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      token = await testService.generateToken();
      await testService.createUser();
      await testService.createContact();
    });
    it('should be rejected if request invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set({ authorization: token })
        .send({
          first_name: '',
          last_name: '',
          email: 'xxx',
          phone: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });
    it('should be rejected if request invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1111111111111}`)
        .set({ authorization: token })
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@gmail.com',
          phone: '081234567228',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should be able to add contact ', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set({ authorization: token })
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@gmail.com',
          phone: '0812345672289999',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBeDefined();
      expect(response.body.data.last_name).toBeDefined();
      expect(response.body.data.email).toBeDefined();
      expect(response.body.data.phone).toBeDefined();
    });
  });

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      token = await testService.generateToken();
      await testService.createUser();
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/contacts/999999')
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to add contact and get created contact ', async () => {
      let contact = await testService.getContact();
      if (!contact) {
        await testService.createContact();
        contact = await testService.getContact();
      }
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
    });
  });

  describe('GET /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      token = await testService.generateToken();
      await testService.createUser();
      await testService.createContact();
    });

    it('should be able to search contacts', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          name: 'es',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by name not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          name: 'wrong',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts by email', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          email: 'es',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by email not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          email: 'wrong',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts by phone', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          phone: '99',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      // expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by phone not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          phone: '88',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts with page', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          size: 1,
          page: 2,
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(2);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });
  });
});
