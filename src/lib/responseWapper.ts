import {Response} from "express";
import {Result, ValidationError} from "express-validator";

export const successResponse = (res: Response, data: null | Record<string, any> | Record<string, any>[] = null) => {
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
    data: {
      field,
      message
    }
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