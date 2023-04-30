import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface IJwt extends JwtPayload {
  id: string;
}

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

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.cookie?.split('=')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication error' });
  }
  try {
    const payload = jwt.verify(token, 'mysecret', {}) as JwtPayload;
    req.userId = payload.user.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default {
  checkValidationRequest,
  checkIfUserExists,
  checkIfEmailExists,
  checkMatchPasswords,
  isAuth,
};
