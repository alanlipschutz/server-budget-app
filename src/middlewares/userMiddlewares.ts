import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';

const checkValidationRequest: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const checkIfUserExists: RequestHandler = async (req, res, next) => {
  const user = User.findByEmail(req.body.email);
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
};

export default {
  checkValidationRequest,
  checkIfUserExists,
};
