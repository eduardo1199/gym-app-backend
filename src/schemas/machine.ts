import { z } from 'zod'

export const MachineRequestCreatedSchema = z.object({
  name: z.string({
    required_error: 'Nome obrigatório!',
    invalid_type_error: 'Nome precisa ser do tipo texto!',
  }),
  description: z
    .string({
      required_error: 'Descrição obrigatória!',
      invalid_type_error: 'Descrição precisa ser do tipo texto!',
    })
    .max(200, 'Valor máximo de descrição são 200 caracteres.'),
  maintenance: z.boolean({
    required_error: 'É obrigatório indicar manutenção ou não do equipamento!',
    invalid_type_error: 'Precisa ser sim ou não!',
  }),
})

export const MachineRequestUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().max(200).optional(),
  maintenance: z.boolean().optional(),
})

export const MachineIdSchema = z.object({
  id: z.string().uuid(),
})
