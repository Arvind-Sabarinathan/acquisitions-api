import express from 'express';
import {
  deleteUserDetails,
  fetchAllUsers,
  fetchUserById,
  updateUserDetails,
} from '#controllers/user.controller.js';
import {
  authenticateToken,
  requireRole,
} from '#middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.get('/', authenticateToken, requireRole(['admin']), fetchAllUsers);

userRouter.get('/:id', authenticateToken, fetchUserById);

userRouter.put('/:id', authenticateToken, updateUserDetails);

userRouter.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  deleteUserDetails
);

export default userRouter;
