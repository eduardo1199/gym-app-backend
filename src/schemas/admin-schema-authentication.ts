import { z } from 'zod'

export const AdminAuthenticationSchema = z.object({
  cpf: z
    .string({
      required_error: 'CPF obrigatório!',
      invalid_type_error: 'Formator de CPF inválido!',
    })
    .max(14),
  password: z
    .string({
      required_error: 'Senha obrigatória!',
      invalid_type_error: 'Senha com formato inválido!',
    })
    .max(15),
})
