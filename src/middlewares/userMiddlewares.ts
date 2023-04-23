import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const checkValidationRequest: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const checkIfUserExists: RequestHandler = async (req, res, next) => {
  const user = await User.findByEmail(req.body.email);
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
  next();
};

const checkIfEmailExists: RequestHandler = async (req, res, next) => {
  const user = await User.findByEmail(req.body.email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  next();
};

const checkMatchPasswords: RequestHandler = async (req, res, next) => {
  const user = await User.findByEmail(req.body.email);
  if (user) {
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  }
  next();
};

export default {
  checkValidationRequest,
  checkIfUserExists,
  checkIfEmailExists,
  checkMatchPasswords,
};
