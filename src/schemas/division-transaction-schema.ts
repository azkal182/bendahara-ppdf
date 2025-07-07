import { z } from 'zod'

export const divisionTransactionFormSchema = z.object({
  amount: z.coerce.number(),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  date: z.coerce.date().optional(),
  type: z.enum(['INCOME', 'EXPENSE'])
})

export type DivisionTransactionFormInput = z.infer<typeof divisionTransactionFormSchema>

export const createDivisionTransactionSchema = divisionTransactionFormSchema.extend({
  userId: z.string(),
  divisionId: z.string()
})

export type CreateDivisionTransactionInput = z.infer<typeof createDivisionTransactionSchema>
