import {Response} from "express";
import {ValidationError} from "express-validator";

export const successResponse = (res: Response, data: unknown = null) => {
  return res.status(200).json({
    success: true,
    message: 'success',
    data,
  });
};


export const fieldValidationErrorResponse = (res: Response, field: string, message: string) => {
  return res.status(422).json({
    success: false,
    message: 'validation error',
    data: Array({
      field,
      message
    })
  });
};

export const requestValidationErrorResponse = (res: Response, errors: ValidationError[]) => {
  const data = errors.map(error => {
    return {
      field: error.param,
      message: error.msg
    }
  });

  return res.status(422).json({
    success: false,
    message: 'validation error',
    data
  });
};

export const notFoundResponse = (res: Response, message: string) => {
  return res.status(404).json({
    success: false,
    message,
    data: null
  });
};

export const serverErrorResponse = (res: Response, message: string) => {
  return res.status(500).json({
    success: false,
    message,
    data: null
  });
};

export const badRequestResponse = (res: Response, message: string) => {
  return res.status(400).json({
    success: false,
    message,
    data: null
  });
};

export const forbiddenResponse = (res: Response, message: string) => {
  return res.status(403).json({
    success: false,
    message,
    data: null
  });
};

export const unAuthorizedResponse = (res: Response, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    message,
    data: null
  });
};
