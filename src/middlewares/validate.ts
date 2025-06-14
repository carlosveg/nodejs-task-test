import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

export const validateBody =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const formattedErrors: Record<string, string> = {}

      result.error.errors.forEach((e) => {
        const field = e.path.join('.')
        formattedErrors[field] = e.message
      })

      return res.status(400).json({
        message: 'Error de validación',
        errors: formattedErrors
      })
    }

    req.body = result.data
    next()
  }
