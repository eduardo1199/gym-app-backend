import { z } from 'zod'

export const ParamsCPFRequestSchema = z.object({
  cpf: z.string(),
})
