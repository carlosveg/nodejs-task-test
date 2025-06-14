import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  userId: z.string().uuid('userId debe ser UUID válido'),
  columnId: z.string().uuid('columnId debe ser UUID válido')
})

export const updateTaskBodySchema = z.object({
  title: z.string().min(5, 'Debe tener al menos 5 caracteres').optional(),
  description: z.string().min(5, 'Debe tener al menos 5 caracteres').optional(),
  columnId: z.string().uuid('columnId debe ser UUID válido')
})

export const deleteTaskParamsSchema = z.object({
  id: z.string().uuid('id debe ser UUID válido')
})

export const deleteTaskBodySchema = z.object({
  userId: z.string().uuid('userId debe ser UUID válido')
})
