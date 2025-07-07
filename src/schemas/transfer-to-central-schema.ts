import { z } from 'zod'

export const transferToCentralSchema = z.object({
  divisionId: z.string().uuid(),
  amount: z.number().int().positive(),
  description: z.string().optional(),
  userId: z.string().uuid(),
  year: z.number().int().min(2025),
  month: z.number().int().min(1).max(12)
})

export type TransferToCentralInput = z.infer<typeof transferToCentralSchema>
