import {Request, Response} from "express";
import {body, validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';

import User from "../models/user";
import UserRepository from "../../repositories/userRepository";
import mapper from "../../lib/mapper";
import UserDto from "../../mappings/dtos/user.dto";
import UserType from "../../mappings/types/user.type";

const userRepository = new UserRepository();

export const index = async (req: Request, res: Response) => {
  userRepository.getAll().then((users) => {
    res.send(users.map((user) => mapper.map(user, UserDto, UserType)));
  }).catch((err) => {
    res.send(err);
  })
}

export const show = async (req: Request, res: Response) => {
  userRepository.findById(req.params.id).then((user) => {
    res.send(mapper.map(user, UserDto, UserType));
  }).catch((err) => {
    res.send(err);
  })
}

export const store = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const emailExist = await userRepository.findByEmail(req.body.email);

  if (emailExist) {
    return res.status(422).send({error: "User already exists"})
  }

  const hash = bcrypt.hashSync(req.body.password, 10);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });

  userRepository.create(newUser).then((user) => {
    res.send(mapper.map(user, UserDto, UserType))
  }).catch((err) => {
    res.send(err);
  })
}

export const update = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
  };

  userRepository.update(req.body.id, updatedUser).then((user) => {
    res.send(mapper.map(user, UserDto, UserType));
  }).catch((err) => {
    res.send(err);
  })
}

export const destroy = async (req: Request, res: Response) => {
  userRepository.delete(req.params.id).then((user) => {
    res.send(mapper.map(user, UserDto, UserType));
  }).catch((err) => {
    res.send(err);
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
        body('password', 'Password is required').notEmpty(),
        body('password', 'Password has to be at least 8 characters and maximum of 100 characters').isLength({
          min: 8,
          max: 100
        })
      ]
    }

    case 'updateUserPartial': {
      return [
        body('id', "ID is required").notEmpty(),
        body('name', "Name cannot be shorter then 2 characters and longer then 100 characters").isLength({
          min: 2,
          max: 100
        }),
        body('email', 'Invalid email').isEmail(),
        body('password', 'Password has to be at least 8 characters and maximum of 100 characters').isLength({
          min: 8,
          max: 100
        })
      ]
    }
  }
}
