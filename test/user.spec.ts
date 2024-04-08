import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
    await testService.deleteAll();
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });

    it('should be able to Register ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.code).toBe(HttpStatus.CREATED);
      expect(response.body.data.username).toBe('test');
      await testService.deleteAll();
    });

    it('should be Rejected if exist ', async () => {
      await testService.deleteAll();
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.code).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });

    it('should be able to login ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
      expect(response.body.data.token).toBeDefined();
      await testService.deleteAll();
    });
  });

  describe('GET /api/users/current', () => {
    let token: string;
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      token = await testService.generateToken();
    });

    it('should be rejected if request not have authorization', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/users/current',
      );
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });

    it('should be able to see current user ', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
      expect(response.body.data).toBeDefined();
      await testService.deleteAll();
    });
  });

  describe('PATCH /api/users/current', () => {
    let token: string;
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      token = await testService.generateToken();
    });

    it('should be rejected if request not have authorization', async () => {
      const response = await request(app.getHttpServer()).patch(
        '/api/users/current',
      );
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });

    it('should be able to reject input ', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set({ authorization: token })
        .send({
          password: '',
          name: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.code).toBe(HttpStatus.BAD_REQUEST);
      await testService.deleteAll();
    });

    it('should be able to edit current user name ', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set({ authorization: token })
        .send({
          name: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
      expect(response.body.data.name).toBe('test');
      await testService.deleteAll();
    });
    it('should be able to edit current user password ', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set({ authorization: token })
        .send({
          password: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
      expect(response.body.data).toBeDefined();

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
      expect(response.body.data.token).toBeDefined();
      await testService.deleteAll();
    });
  });

  describe('DELETE /api/users/current', () => {
    let token: string;
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      token = await testService.generateToken();
    });
    it('should be rejected if request not have authorization', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/users/current',
      );
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
      await testService.deleteAll();
    });

    it('should be able to logout ', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set({ authorization: token });
      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.code).toBe(HttpStatus.OK);
      expect(response.body.data).toBe(true);

      const user = await testService.getUser();
      expect(user.token).toBeNull();
      await testService.deleteAll();
    });
  });
});
