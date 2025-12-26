import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/user.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching users...');
    const users = await getAllUsers();
    res.json({
      message: 'Users fetched successfully',
      data: users,
      count: users.length,
    });
  } catch (error) {
    logger.error('Error fetching users', error);
    next(error);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    logger.info(`Fetching user with id: ${id}`);
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Error fetching user with id ${req.params.id}`, error);
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    const updates = updateUserSchema.parse(req.body);
    logger.info(`Updating user with id: ${id}`);

    // Auth checks
    // Ensure req.user exists (authentication middleware should have set it)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // User can only update their own info, or Admin can update anyone
    // But only Admin can update role
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only update your own account' });
    }

    if (updates.role && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: Only admins can change roles' });
    }

    const updatedUser = await updateUser(id, updates);

    res.json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    logger.error(`Error updating user with id ${req.params.id}`, error);
    next(error);
  }
};

export const deleteUserDetails = async (req, res, next) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    logger.info(`Deleting user with id: ${id}`);

    // Auth checks (assuming generic protection: admin or self)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only delete your own account' });
    }

    await deleteUser(id);

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting user with id ${req.params.id}`, error);
    next(error);
  }
};
