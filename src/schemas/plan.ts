import { z } from 'zod'

export const PlanSchema = z.object({
  name: z.string({
    required_error: 'Nome obrigatório!',
    invalid_type_error: 'Nome precisa ser do tipo texto!',
  }),
  timeOfPlan: z
    .number({
      required_error: 'Tempo do plano obrigatório!',
      invalid_type_error: 'Tempo do plano precisa ser numérico!',
    })
    .max(360, {
      message: 'Tempo do plano não pode ser superior a um ano!',
    })
    .positive({
      message: 'Tempo do plano precisa ser maior que zero!',
    }),
  price: z.number({
    required_error: 'O preço do plano é obrigatório!',
    invalid_type_error: 'Tempo do plano precisa ser numérico!',
  }),
})

export type PlanSchemaType = z.infer<typeof PlanSchema>
