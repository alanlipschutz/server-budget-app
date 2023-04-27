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
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, 'mysecret', {
      expiresIn: '1h',
    });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    return res.status(201).json({ name, email, token, id: user._id });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (user) {
      const token = jwt.sign({ user: { id: user._id } }, 'mysecret', {
        expiresIn: '1h',
      });
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      });
      return res
        .status(200)
        .json({ name: user.name, email, token, id: user._id });
    }
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser: RequestHandler = async (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

const handleGetAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.getAllUsers();
    console.log(users);

    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'we had a problem returning users' });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  handleGetAllUsers,
};
