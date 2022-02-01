import request from 'supertest';
import {app, server} from '../../../src';
import mongoose from "mongoose";
import User from "../../../src/app/models/user";

beforeAll(async () => {
  const url = process.env.MONGODB_URI;
  await mongoose.connect(url);

  await request(app).post('/auth/register').send({
    name: 'John Doe',
    email: 'user@mail.com',
    password: 'P@ssw0rd',
  });
})

describe('POST /auth/login', () => {
  describe('Given valid credentials', () => {

    test('Should respond with a 200 status code', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@mail.com',
        password: 'P@ssw0rd',
      });

      expect(response.statusCode).toBe(200);
    });

    test('Response should contain user object', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@mail.com',
        password: 'P@ssw0rd',
      });

      expect(typeof response.body.data.user).toBe("object");
    });

    test('Response should contain token attribute', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@mail.com',
        password: 'P@ssw0rd',
      });

      expect(typeof response.body.data.token).toBe("string");
    });
  });

  describe('Given invalid email', () => {

    test('Should respond with a 200 status code', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@mail.com',
        password: 'P@ssw0rd',
      });

      expect(response.statusCode).toBe(200);
    });

    test('Response should contain user object', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@mail.com',
        password: 'P@ssw0rd',
      });

      expect(typeof response.body.data.user).toBe("object");
    });

    test('Response should contain token attribute', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@mail.com',
        password: 'P@ssw0rd',
      });

      expect(typeof response.body.data.token).toBe("string");
    });
  });

  describe('Given invalid email', () => {
    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'invalid email',
        password: 'P@ssw0rd',
      });

      expect(response.statusCode).toBe(422);
    });
  });

  describe('Given invalid password', () => {
    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'invalid email',
        password: 'P@ss',
      });

      expect(response.statusCode).toBe(422);
    });
  });

  describe('Given non-existing email', () => {
    test('Should respond with a 404 status code', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'non_existing@mail.com',
        password: 'P@ssword',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
  await server.close();
})
