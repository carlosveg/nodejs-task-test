import { z } from 'zod'

export const createColumnSchema = z.object({
  name: z.string().min(5, 'El nombre es requerido'),
  userId: z.string().uuid('userId debe ser UUID válido')
})

export const updateColumnSchema = z.object({
  name: z.string().min(5, 'El nombre es requerido'),
  userId: z.string().uuid('userId debe ser UUID válido'),
  columnId: z.string().uuid('columnId debe ser UUID válido')
})

export const deleteColumnSchema = z.object({
  userId: z.string().uuid('userId debe ser UUID válido')
})

export const reorderColumnsSchema = z.object({
  userId: z.string().uuid({ message: 'userId debe ser UUID válido' }),
  columnIds: z
    .array(
      z.string().uuid({ message: 'Cada elemento debe ser un UUID válido' })
    )
    .min(3, { message: 'Al menos deben ser 3 columnas' })
})
