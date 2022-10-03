import { z } from 'zod';

export const MachineSchema = z.object({
  name: z.string({
    required_error: 'Nome obrigatório!',
    invalid_type_error: 'Nome precisa ser do tipo texto!'
  }),
	description: z.string({
    required_error: 'Descrição obrigatória!',
    invalid_type_error: 'Descrição precisa ser do tipo texto!'
  }).max(100),
	maintenance: z.boolean({
    required_error: "É obrigatório indicar manutenção ou não do equipamento!",
    invalid_type_error: "Precisa ser sim ou não!",
  })
})

export type MachineSchemaType = z.infer<typeof MachineSchema>;
