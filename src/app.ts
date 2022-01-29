import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import * as userController from "./app/controllers/usersController";
import * as authController from "./app/controllers/authController";
import mongoDBService from "./services/database.service";
import passport from "passport";
import jwtAuthStrategy from "./app/strategies/auth/jwt.auth.strategy";
import authOnly from "./app/middlewares/authOnly.middleware";

const port = process.env.SERVER_PORT || 8080;
const app = express();

// Pre-request middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
passport.use(jwtAuthStrategy);

// All the routes
app.get('/users', authOnly, userController.index);
app.get('/users/:id', authOnly, userController.show);
app.post('/users', authOnly, userController.validate('createUser'), userController.store);
app.put('/users', authOnly, userController.validate('updateUser'), userController.update);
app.patch('/users', authOnly, userController.validate('updateUserPartial'), userController.update);
app.delete('/users/:id', authOnly, userController.destroy);

app.post('/auth/login', authController.validate('loginUser'), authController.login);
app.post('/auth/register', authController.validate('registerUser'), authController.register);

// Connect to mongoDB
mongoDBService();

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.info(`server started at http://localhost:${port}`);
});

export default app;
