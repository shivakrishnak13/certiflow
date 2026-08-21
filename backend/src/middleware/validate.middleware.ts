import { Request, Response, NextFunction } from 'express';
import { Validator } from 'node-input-validator';
import status from 'http-status';
import { ErrorResponse } from '@/utils/helpers/apiResponse';

export const validateRequest = (rules: Record<string, string>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validator = new Validator(req.body, rules);
    const matched = await validator.check();

    if (!matched) {
      return ErrorResponse(res, status.UNPROCESSABLE_ENTITY, {
        message: 'Validation failed',
        errors: validator.errors,
      });
    }

    next();
  };
};
