import { z } from 'zod'

export const DivisionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2)
})

export type DivisionSchemaInput = z.infer<typeof DivisionSchema>
