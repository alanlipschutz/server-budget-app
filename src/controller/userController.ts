import User from '../models/User';
import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

const registerUser: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: v4(),
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, 'mysecret', {
      expiresIn: '1h',
    });
    return res.status(201).json({ name, email, token });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  registerUser,
};
