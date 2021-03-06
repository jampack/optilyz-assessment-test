import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import * as userController from "./app/controllers/usersController";
import * as authController from "./app/controllers/authController";
import * as taskController from "./app/controllers/tasksController";
import passport from "passport";
import jwtAuthStrategy from "./app/strategies/auth/jwt.auth.strategy";
import authOnly from "./app/middlewares/authOnly.middleware";

const app = express();

// Pre-request middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
passport.use(jwtAuthStrategy);

// All the routes
app.post('/auth/login', authController.validate('loginUser'), authController.login);
app.post('/auth/register', authController.validate('registerUser'), authController.register);

app.get('/users', authOnly, userController.index);
app.get('/users/:id', authOnly, userController.show);
app.post('/users', authOnly, userController.validate('createUser'), userController.store);
app.put('/users', authOnly, userController.validate('updateUser'), userController.update);
app.patch('/users', authOnly, userController.validate('patchUser'), userController.patch);
app.delete('/users/:id', authOnly, userController.destroy);

app.get('/tasks', authOnly, taskController.index);
app.get('/tasks/:id', authOnly, taskController.show);
app.post('/tasks', authOnly, taskController.validate('createTask'), taskController.store);
app.put('/tasks', authOnly, taskController.validate('updateTask'), taskController.update);
app.patch('/tasks', authOnly , taskController.validate('patchTask'), taskController.patch);
app.delete('/tasks/:id', authOnly, taskController.destroy);

export {app};
