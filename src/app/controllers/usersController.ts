import {Request, Response} from "express";
import {body, validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';

import User from "../models/user";
import UserRepository from "../../repositories/userRepository";
import mapper from "../../lib/mapper";
import UserDto from "../../mappings/dtos/user.dto";
import UserType from "../../mappings/types/user.type";
import {
  badRequestResponse,
  fieldValidationErrorResponse, forbiddenResponse,
  requestValidationErrorResponse,
  serverErrorResponse,
  successResponse
} from "../../lib/responseWapper";

const userRepository = new UserRepository();

export const index = async (req: Request, res: Response) => {
  userRepository.getAll().then((users) => {
    return successResponse(res, users.map((user) => mapper.map(user, UserDto, UserType)));
  }).catch((err) => {
    return serverErrorResponse(res, err);
  })
}

export const show = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return badRequestResponse(res, 'Id is required');
  }

  userRepository.findById(req.params.id).then((user) => {
    return successResponse(res, mapper.map(user, UserDto, UserType));
  }).catch((err) => {
    return serverErrorResponse(res, err);
  })
}

export const store = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return requestValidationErrorResponse(res, errors.array());
  }

  const emailExist = await userRepository.findByEmail(req.body.email);

  if (emailExist) {
    return fieldValidationErrorResponse(res, 'email', 'Email already exist');
  }

  const hash = bcrypt.hashSync(req.body.password, 10);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });

  userRepository.create(newUser).then((user) => {
    return successResponse(res, mapper.map(user, UserDto, UserType));
  }).catch((err) => {
    return serverErrorResponse(res, err);
  });
}

export const update = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return requestValidationErrorResponse(res, errors.array());
  }

  const authUser = mapper.map(req.user, UserDto, UserType);

  const emailExist = await userRepository.findByEmail(req.body.email);
  if (emailExist && authUser.id !== emailExist.id) {
    return fieldValidationErrorResponse(res, "email", "Email already taken");
  }

  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
  };

  userRepository.update(req.body.id, updatedUser).then((user) => {
    return successResponse(res, mapper.map(user, UserDto, UserType));
  }).catch((err) => {
   return serverErrorResponse(res, err);
  })
}

export const patch = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return requestValidationErrorResponse(res, errors.array());
  }

  const authUser = mapper.map(req.user, UserDto, UserType);

  if(req.body.email){
    const emailExist = await userRepository.findByEmail(req.body.email);

    if (emailExist && authUser.id !== emailExist.id) {
      return fieldValidationErrorResponse(res, "email", "Email already taken");
    }
  }

  const previousData = await userRepository.findById(req.body.id);

  const updatedUser = {
    name: req.body.name ? req.body.name : previousData.name,
    email: req.body.email ? req.body.email : previousData.email,
  };

  userRepository.update(req.body.id, updatedUser).then((user) => {
    successResponse(res, mapper.map(user, UserDto, UserType));
  }).catch((err) => {
    serverErrorResponse(res, err);
  })
}

export const destroy = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return forbiddenResponse(res, "No id provided");
  }

  userRepository.delete(req.params.id).then((user) => {
    return successResponse(res, mapper.map(user, UserDto, UserType));
  }).catch((err) => {
    return serverErrorResponse(res, err);
  })
}

export const validate = (method: string) => {
  switch (method) {
    case 'createUser': {
      return [
        body('name', "Name is required").notEmpty(),
        body('name', "Name cannot be shorter then 2 characters and longer then 100 characters").isLength({
          min: 2,
          max: 100
        }),
        body('email', 'Invalid email').notEmpty().isEmail(),
        body('password', 'Password is required').notEmpty(),
        body('password', 'Password has to be at least 8 characters and maximum of 100 characters').isLength({
          min: 8,
          max: 100
        })
      ]
    }

    case 'updateUser': {
      return [
        body('id', "ID is required").notEmpty(),
        body('name', "Name is required").notEmpty(),
        body('name', "Name cannot be shorter then 2 characters and longer then 100 characters").isLength({
          min: 2,
          max: 100
        }),
        body('email', 'Invalid email').notEmpty().isEmail(),
      ]
    }

    case 'patchUser': {
      return [
        body('id', "ID is required").notEmpty(),
        body('name', "Name cannot be shorter then 2 characters and longer then 100 characters").if(body('name').exists()).isLength({
          min: 2,
          max: 100
        }),
        body('email', 'Invalid email').if(body('email').exists()).isEmail(),
      ]
    }

    default: {
      throw new Error(`Invalid request validation method: ${method}`);
    }
  }
}
