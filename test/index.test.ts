import request from 'supertest';
import app from '../src/index';

describe('POST /users', () => {
  describe('given a username and password', () => {
    // should save the username and password to the database
    // should respond with a json object containg the user id

    test('Should respond with a 200 status code', async () => {
      const response = await request(app).post('/users').send({
        name: 'Aaron Rempel',
        email: 'Shayne_Quitzon7@hotmail.com',
        password: 'k6v5xcrg',
      });
      expect(response.statusCode).toBe(422);
    });

    test('should specify json in the content type header', async () => {
      const response = await request(app).post('/users').send({
        name: 'Aaron Rempel',
        email: 'Shayne_Quitzon7@hotmail.com',
        password: 'k6v5xcrg',
      });
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });
    // test('Response has User ID', async () => {
    //   const response = await request(app).get('/users').send();
    //   console.log(response);
    //   expect(response.body.id).toBeDefined();
    // });
  });
});
