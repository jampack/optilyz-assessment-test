import {Request, Response} from "express";
import mapper from "../../lib/mapper";
import UserDto from "../../mappings/dtos/user.dto";
import UserType from "../../mappings/types/user.type";
import UserRepository from "../../repositories/userRepository";
import {body, validationResult} from "express-validator";
import bcrypt from "bcryptjs";
import {generateJWT, generateRefreshJWT} from "../../services/auth.service";
import User from "../models/user";
import IUser from "../models/interfaces/iUser";
import {
  fieldValidationErrorResponse,
  notFoundResponse, requestValidationErrorResponse, serverErrorResponse,
  successResponse
} from "../../lib/responseWapper";

const userRepository = new UserRepository();

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return requestValidationErrorResponse(res, errors.array());
  }

  const user = await userRepository.findByEmail(req.body.email);
  if (!user) {
    return notFoundResponse(res, "User not found");
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return fieldValidationErrorResponse(res, "password", "Password is incorrect");
  }

  const token = generateJWT(user);
  const refreshToken = generateRefreshJWT(user);

  const userDto = mapper.map(user, UserDto, UserType);
  return successResponse(res, {
    user: userDto,
    token,
    refreshToken
  });
};

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return requestValidationErrorResponse(res, errors.array());
  }

  const emailExist = await userRepository.findByEmail(req.body.email);

  if (emailExist) {
    return fieldValidationErrorResponse(res, "email", "Email already exist");
  }

  const hash = bcrypt.hashSync(req.body.password, 10);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });

  userRepository.create(newUser).then((user: IUser) => {
    const token = generateJWT(user);
    const refreshToken = generateRefreshJWT(user);

    const userDto = mapper.map(user, UserDto, UserType);
    return successResponse(res, {
      user: userDto,
      token,
      refreshToken
    });
  }).catch((err) => {
    serverErrorResponse(res, err);
  })
}


export const validate = (method: string) => {
  switch (method) {
    case 'loginUser': {
      return [
        body('email', 'Invalid email').notEmpty().isEmail(),
        body('password', 'Password is required').notEmpty(),
        body('password', 'Invalid password').isLength({min: 8, max: 100})
      ]
    }

    case 'registerUser': {
      return [
        body('name', "Name is required").notEmpty(),
        body('name', "Name cannot be shorter then 2 characters and longer then 100 characters").isLength({
          min: 2,
          max: 100
        }),
        body('email', 'Invalid email').notEmpty().bail().isEmail(),
        body('password', 'Password is required').notEmpty(),
        body('password', 'Password has to be at least 8 characters and maximum of 100 characters').isLength({
          min: 8,
          max: 100
        })
      ]
    }
  }
}
