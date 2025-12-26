import { z } from 'zod';

export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a numeric string')
    .transform(val => Number(val)),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).max(255).trim().optional(),
  email: z.string().email().max(255).toLowerCase().trim().optional(),
  password: z.string().min(8).max(128).optional(),
  role: z.enum(['user', 'admin']).optional(),
});
