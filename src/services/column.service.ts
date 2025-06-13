import { Request, Response } from 'express'
import prisma from '../config/prisma.config'

export const listColumns = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query

    if (!userId) return res.status(404).json({ error: 'userId is required' })

    const columns = await prisma.column.findMany({
      where: { userId: String(userId) },
      orderBy: { position: 'asc' }
    })

    res.json(columns)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const createColumn = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, position } = req.body
    const column = await prisma.column.update({
      where: { id },
      data: { name, position }
    })

    res.json(column)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
