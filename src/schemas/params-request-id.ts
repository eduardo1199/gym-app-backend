import { z } from 'zod'

export const ParamsIdRequestSchema = z.object({
  id: z.string().uuid(),
})
