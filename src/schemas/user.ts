import { z } from 'zod'

export const registerUserSchema = z.object({
  name: z.string({
    required_error: 'Nome obrigatório!',
    invalid_type_error: 'Nome precisa ser um texto!',
  }),
  age: z.number({
    required_error: 'Idade obrigatória!',
  }),
  weight: z
    .number({
      required_error: 'Peso obrigatória!',
      invalid_type_error: 'Peso precisa ser um número!',
    })
    .positive(),
  start_plan_date: z.string({
    required_error: 'Data de início obrigatória',
  }),
  cpf: z
    .string({
      required_error: 'CPF obrigatório!',
      invalid_type_error: 'Formator de CPF inválido!',
    })
    .max(14),
  planId: z
    .string({
      required_error: 'Plano precisa ser selecionado!',
    })
    .uuid(),
})

export const ParamsIdRequestSchema = z.object({
  id: z.string().uuid(),
})

export const AuthenticationUserBodySchema = z.object({
  cpf: z.string(),
})

export const UserEditSchema = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  weight: z.number().positive().optional(),
  start_plan_date: z.string().optional(),
  cpf: z.string().max(14).optional(),
  planId: z.string().uuid().optional(),
})
