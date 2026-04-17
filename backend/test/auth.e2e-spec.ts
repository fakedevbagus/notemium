import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, logs in, and scopes notes to the authenticated user', async () => {
    const email = `user-${Date.now()}@example.com`;
    const password = 'password123';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name: 'Test User' });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.accessToken).toEqual(expect.any(String));

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    expect(loginResponse.status).toBe(201);
    const token = loginResponse.body.accessToken as string;

    const noteResponse = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Private note', content: 'Owned content' });

    expect(noteResponse.status).toBe(201);

    const notesResponse = await request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(notesResponse.status).toBe(200);
    expect(notesResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Private note' }),
      ]),
    );
  });
});
