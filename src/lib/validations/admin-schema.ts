import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 형식이 아닙니다.' }),
  password: z.string().min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' }),
  rememberMe: z.boolean().optional(),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
