import logger from '#config/logger.js';
import { signUpSchema, signInSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signUp = async (req, res, next) => {
  try {
    // Validate the request body
    const validationResult = signUpSchema.safeParse(req.body);

    // If validation fails, return a 400 Bad Request response
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: formatValidationError(validationResult.error),
      });
    }

    // Extract the validated data
    const { name, email, password, role } = validationResult.data;

    // Create the user
    const user = await createUser({ name, email, password, role });

    // Generate a JWT token
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set the JWT token in the cookie
    cookies.set(res, 'token', token);

    // Log the user creation
    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (e) {
    // Log the error
    logger.error('Sign-up failed', {
      error: e.message,
      stack: e.stack,
    });

    // If the error is due to a duplicate email, return a 409 Conflict response
    if (e.message === 'USER_ALREADY_EXISTS') {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    next(e);
  }
};

export const signIn = async (req, res, next) => {
  try {
    // Validate the request body
    const validationResult = signInSchema.safeParse(req.body);

    // If validation fails, return a 400 Bad Request response
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: formatValidationError(validationResult.error),
      });
    }

    // Extract the validated data
    const { email, password } = validationResult.data;

    // Authenticate the user
    const user = await authenticateUser({ email, password });

    // Generate a JWT token
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set the JWT token in the cookie
    cookies.set(res, 'token', token);

    // Log the successful sign-in
    logger.info('User signed in successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: 'User signed in successfully',
      user,
    });
  } catch (e) {
    // Log the error
    logger.error('Sign-in failed', {
      error: e.message,
      stack: e.stack,
    });

    // If the error is due to user not found or invalid password, return a 401 Unauthorized response
    if (e.message === 'USER_NOT_FOUND' || e.message === 'INVALID_PASSWORD') {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    next(e);
  }
};

export const signOut = (req, res, next) => {
  try {
    // Clear the JWT token cookie
    cookies.clear(res, 'token');

    // Log the successful sign-out
    logger.info('User signed out successfully');

    return res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (e) {
    // Log the error
    logger.error('Sign-out failed', {
      error: e.message,
      stack: e.stack,
    });

    next(e);
  }
};
