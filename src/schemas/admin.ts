import { z } from 'zod';

export const AdminSchema = z.object({
  name: z.string({
    required_error: 'Nome obrigatório!',
    invalid_type_error: 'Nome precisa ser um texto!'
  }),
  year: z.string({
    required_error: 'Idade obrigatória!',
    invalid_type_error: 'Data precisa ser do tipo texto!'
  }).max(2),
  cpf: z.string({
    required_error: 'CPF obrigatório!',
    invalid_type_error: 'Formator de CPF inválido!'
  }).max(14),
  birthDate: z.string({
    required_error: 'Data obrigatória!',
    invalid_type_error: 'Data precisa ser no formato dd/MM/YYYY!'
  }),
	password: z.string({
    required_error: 'Senha obrigatória!',
    invalid_type_error: 'Senha com formato inválido!'
  }).max(15),
})

export const AdminAuthenticationSchema = z.object({
  cpf: z.string({
    required_error: 'CPF obrigatório!',
    invalid_type_error: 'Formator de CPF inválido!'
  }).max(14),
  password: z.string({
    required_error: 'Senha obrigatória!',
    invalid_type_error: 'Senha com formato inválido!'
  }).max(15),
})

export const AdminIdSchema = z.object({
  id: z.string().uuid({ message: 'Id inválido!' })
})
