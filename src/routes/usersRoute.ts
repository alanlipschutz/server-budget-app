import express from 'express';
import { body } from 'express-validator';
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

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  userMiddlewares.checkValidationRequest,
  userMiddlewares.checkIfEmailExists,
  userMiddlewares.checkMatchPasswords,
  userController.loginUser
);

router.post('/logout', userController.logoutUser);

router.get('/getUsers', userController.handleGetAllUsers);

export default router;
