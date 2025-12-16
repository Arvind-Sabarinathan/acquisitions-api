import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import { user } from '#models/user.model.js';

export const hashPassword = async password => {
  // Hash the password
  return bcrypt.hash(password, 10);
};

export const createUser = async ({ name, email, password, role }) => {
  // Check if user already exists
  const existingUser = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  // If user already exists, throw an error
  if (existingUser.length > 0) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Insert the user into the database
  const [newUser] = await db
    .insert(user)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
    })
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });

  // Return the new user
  return newUser;
};

export const comparePassword = async (password, hashedPassword) => {
  // Compare the provided password with the hashed password
  return await bcrypt.compare(password, hashedPassword);
};

export const authenticateUser = async ({ email, password }) => {
  // Find the user by email
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  // If user doesn't exist, throw an error
  if (!existingUser) {
    throw new Error('USER_NOT_FOUND');
  }

  // Validate the password
  const isPasswordValid = await comparePassword(
    password,
    existingUser.password
  );

  // If password is incorrect, throw an error
  if (!isPasswordValid) {
    throw new Error('INVALID_PASSWORD');
  }

  // Log the information
  console.log('User signed in successfully', existingUser);

  // Return the user without the password field
  const { password: _, ...userWithoutPassword } = existingUser;
  return userWithoutPassword;
};
