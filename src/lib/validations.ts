import { z } from 'zod';

// Customer validation schema
export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Nome é obrigatório' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Email inválido' })
    .max(255, { message: 'Email deve ter no máximo 255 caracteres' }),
  phone: z
    .string()
    .trim()
    .min(1, { message: 'Telefone é obrigatório' })
    .regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, {
      message: 'Telefone deve estar no formato (00) 00000-0000'
    }),
  address: z
    .string()
    .trim()
    .max(200, { message: 'Endereço deve ter no máximo 200 caracteres' })
    .optional()
    .or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// Pet validation schema
export const petSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Nome do pet é obrigatório' })
    .max(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
  species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other'], {
    errorMap: () => ({ message: 'Selecione uma espécie' }),
  }),
  breed: z
    .string()
    .trim()
    .max(50, { message: 'Raça deve ter no máximo 50 caracteres' })
    .optional()
    .or(z.literal('')),
  age: z
    .number({ invalid_type_error: 'Idade deve ser um número' })
    .int({ message: 'Idade deve ser um número inteiro' })
    .min(0, { message: 'Idade deve ser positiva' })
    .max(100, { message: 'Idade inválida' })
    .optional(),
  weight: z
    .number({ invalid_type_error: 'Peso deve ser um número' })
    .min(0, { message: 'Peso deve ser positivo' })
    .max(500, { message: 'Peso inválido' })
    .optional(),
  customerId: z
    .string()
    .min(1, { message: 'Selecione um dono' }),
  notes: z
    .string()
    .trim()
    .max(500, { message: 'Observações devem ter no máximo 500 caracteres' })
    .optional()
    .or(z.literal('')),
});

export type PetFormData = z.infer<typeof petSchema>;

// Appointment validation schema
export const appointmentSchema = z.object({
  customerId: z
    .string()
    .min(1, { message: 'Selecione um cliente' }),
  petId: z
    .string()
    .min(1, { message: 'Selecione um pet' }),
  service: z.enum(['bath', 'grooming', 'veterinary', 'vaccination', 'consultation'], {
    errorMap: () => ({ message: 'Selecione um serviço' }),
  }),
  date: z
    .string()
    .min(1, { message: 'Data é obrigatória' }),
  time: z
    .string()
    .min(1, { message: 'Horário é obrigatório' })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Horário inválido' }),
  notes: z
    .string()
    .trim()
    .max(500, { message: 'Observações devem ter no máximo 500 caracteres' })
    .optional()
    .or(z.literal('')),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
