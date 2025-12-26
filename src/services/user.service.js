import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { user } from '#models/user.model.js';

export const getAllUsers = async () => {
  try {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      })
      .from(user);
    return users;
  } catch (error) {
    logger.error('Error getting users', error);
    throw error;
  }
};

export const getUserById = async id => {
  try {
    const [foundUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      })
      .from(user)
      .where(eq(user.id, id));
    return foundUser;
  } catch (error) {
    logger.error(`Error getting user with id ${id}`, error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const [updatedUser] = await db
      .update(user)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });

    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user with id ${id}`, error);
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    await db.delete(user).where(eq(user.id, id));
    return { message: 'User deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting user with id ${id}`, error);
    throw error;
  }
};
