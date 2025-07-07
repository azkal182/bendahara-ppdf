import { z } from 'zod'

export const userFormSchema = z.object({
  username: z.string().min(1),
  name: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(['PUSAT', 'DIVISI']),
  divisionId: z.string().nullable().optional(),
  id: z.string().optional()
})

export type UserFormData = z.infer<typeof userFormSchema>
