import {Request, Response} from "express";
import mapper from "../../lib/mapper";
import UserDto from "../../mappings/dtos/user.dto";
import UserType from "../../mappings/types/user.type";
import UserRepository from "../../repositories/userRepository";
import {body, validationResult} from "express-validator";
import bcrypt from "bcryptjs";
import {generateJWT, generateRefreshJWT} from "../../services/auth.service";

const userRepository = new UserRepository();

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const user = await userRepository.findByEmail(req.body.email);
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({
      message: "Invalid password"
    });
  }

  const token = generateJWT(user);
  const refreshToken = generateRefreshJWT(user);

  const userDto = mapper.map(user, UserDto, UserType);
  return res.status(200).json({user: userDto, token, refreshToken});
};

// export const register = async (req: Request, res: Response) => {
//   userRepository.getAll().then((users) => {
//     res.send(users.map((user) => mapper.map(user, UserDto, UserType)));
//   }).catch((err) => {
//     res.send(err);
//   })
// }


export const validate = (method: string) => {
  switch (method) {
    case 'loginUser': {
      return [
        body('email', 'Invalid email').notEmpty().isEmail(),
        body('password', 'Password is required').notEmpty(),
        body('password', 'Invalid password').isLength({min: 8, max: 100})
      ]
    }
  }
}
