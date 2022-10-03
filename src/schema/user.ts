import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string({
    required_error: 'Nome obrigatório!',
    invalid_type_error: 'Nome precisa ser um texto!'
  }),
  age: z.string({
    required_error: 'Data obrigatória!',
    invalid_type_error: 'Data precisa ser no formato dd/MM/YYYY!'
  }),
  weight: z.number({
    required_error: 'Peso obrigatória!',
    invalid_type_error: 'Peso precisa ser um número!'
  }).positive(),
  cpf: z.string({
    required_error: 'CPF obrigatório!',
    invalid_type_error: 'Formator de CPF inválido!'
  }).max(14),
  startDateForPlan: z.string({
    required_error: 'Data de inicio de plano obrigatória!',
    invalid_type_error: 'Data precisa ser no formato dd/MM/YYYY!'
  }),
  planId: z.string({
    required_error: 'Plano precisa ser selecionado!',
  }),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
