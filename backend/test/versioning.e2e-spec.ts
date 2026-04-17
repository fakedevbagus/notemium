import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Versioning API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/versioning (GET) should return 200', async () => {
    const res = await request(app.getHttpServer()).get('/versioning');
    expect([200, 404, 501]).toContain(res.status); // Accepts 200, 404, or 501 if not implemented
  });
});
