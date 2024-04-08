import { ZodType, z } from 'zod';

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(1).max(20).optional(),
  });
  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    keyword: z.string().min(1).max(200).optional(),
    email: z.string().min(1).max(100).optional(),
    phone: z.string().min(1).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).positive(),
  });
}
