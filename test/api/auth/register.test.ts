import request from 'supertest';
import {app, server} from '../../../src';
import mongoose from "mongoose";
import User from "../../../src/app/models/user";

beforeAll(async () => {
  const url = process.env.MONGODB_URI;
  await mongoose.connect(url);
})

describe('POST /auth/register', () => {
  describe('Given valid fields', () => {

    test('Should respond with a 200 status code', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'John Doe',
        email: 'user1@test.com',
        password: 'P@ssw0rd',
      });

      expect(response.statusCode).toBe(200);
    });

    test('Response should be of type object', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'John Doe',
        email: 'user2@test.com',
        password: 'P@ssw0rd',
      });

      expect(response.body).toBeInstanceOf(Object);
    });

    test('Response should contain id attribute', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'John Doe',
        email: 'user3@test.com',
        password: 'P@ssw0rd',
      });

      expect(typeof response.body.data.user.id).toBe("string");
    });

    test('Response should contain token attribute', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'John Doe',
        email: 'user4@test.com',
        password: 'P@ssw0rd',
      });

      expect(typeof response.body.data.token).toBe("string");
    });
  });

  describe('Given invalid email', () => {
    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'John Doe',
        email: 'invalid email',
        password: 'P@ssw0rd',
      });

      expect(response.statusCode).toBe(422);
    });
  });

  describe('Given already used email', () => {

    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'John Doe',
        email: 'user1@test.com',
        password: 'P@ssw0rd',
      });

      expect(response.statusCode).toBe(422);
    });
  });

  describe('Given invalid name', () => {

    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/auth/register').send({
        name: '',
        email: 'user1@test.com',
        password: 'P@ssw0rd',
      });

      expect(response.statusCode).toBe(422);
    });
  });

  describe('Given invalid password', () => {

    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'John Doe',
        email: `user1@test.com`,
        password: '',
      });

      expect(response.statusCode).toBe(422);
    });
  });
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
  await server.close();
})
