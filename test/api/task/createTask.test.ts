import request from 'supertest';
import {app, server} from '../../../src';
import mongoose from "mongoose";
import User from "../../../src/app/models/user";
import Task from "../../../src/app/models/task";

let authToken = ''
beforeAll(async () => {
  const url = process.env.MONGODB_URI;
  await mongoose.connect(url);

  await request(app).post('/auth/register').send({
    name: 'John Doe',
    email: 'user@mail.com',
    password: 'P@ssw0rd',
  }).then(async (resp) => {
    authToken = resp.body.data.token;
  })
})

describe('POST /tasks', () => {
  describe('Given valid fields', () => {

    test('Should respond with a 200 status code', async () => {
      const response = await request(app).post('/tasks').set('Authorization', `Bearer ${authToken}`).send({
        title: 'Task title',
        description: 'task description',
        completeBefore: "2022-07-15",
        notifyAt: "2022-06-15",
        isComplete: false,
      });

      expect(response.statusCode).toBe(200);
    });

    test('Response should contain id attribute', async () => {
      const response = await request(app).post('/tasks').set('Authorization', `Bearer ${authToken}`).send({
        title: 'Task title',
        description: 'task description',
        completeBefore: "2022-07-15",
        notifyAt: "2022-06-15",
        isComplete: false,
      });

      expect(typeof response.body.data.id).toBe("string");
    });

    test('Response should be of type object', async () => {
      const response = await request(app).post('/tasks').set('Authorization', `Bearer ${authToken}`).send({
        name: 'John Doe',
        email: 'user3@mail.com',
        password: 'P@ssw0rd',
      });

      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('Given invalid title', () => {
    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/tasks').set('Authorization', `Bearer ${authToken}`).send({
        title: '',
        description: 'task description',
        completeBefore: "2022-07-15",
        notifyAt: "2022-06-15",
        isComplete: false,
      });

      expect(response.statusCode).toBe(422);
    });
  });

  describe('Given invalid completeBefore date', () => {
    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/tasks').set('Authorization', `Bearer ${authToken}`).send({
        title: 'Task title',
        description: 'task description',
        completeBefore: "1991-07-15",
        notifyAt: "2022-06-15",
        isComplete: false,
      });

      expect(response.statusCode).toBe(422);
    });
  });

  describe('Given invalid notifyAt date', () => {
    test('Should respond with a 422 status code', async () => {
      const response = await request(app).post('/tasks').set('Authorization', `Bearer ${authToken}`).send({
        title: 'Task title',
        description: 'task description',
        completeBefore: "2022-07-15",
        notifyAt: "1991-06-15",
        isComplete: false,
      });

      expect(response.statusCode).toBe(422);
    });
  });

});

afterAll(async () => {
  await Task.deleteMany();
  await User.deleteMany();
  await mongoose.connection.close();
  await server.close();
})
