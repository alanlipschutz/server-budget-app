import express from 'express';
import { body, validationResult } from 'express-validator';
import userController from '../controller/userController';
import userMiddlewares from '../middlewares/userMiddlewares';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  userMiddlewares.checkValidationRequest,
  userMiddlewares.checkIfUserExists,
  userController.registerUser
);
