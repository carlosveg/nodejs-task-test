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
    const { userId, name } = req.body

    if (!userId || !name)
      return res.status(400).json({ error: 'userId and name are required' })

    const existsExtraColumn = await prisma.column.count({
      where: { userId, isDefault: false }
    })

    if (existsExtraColumn >= 2)
      return res.status(400).json({ error: 'Only 2 custom columns allowed' })

    const maxPosition = await prisma.column.aggregate({
      where: { userId },
      _max: { position: true }
    })

    const column = await prisma.column.create({
      data: {
        userId,
        name,
        position: (maxPosition._max.position ?? -1) + 1
      }
    })

    res.status(201).json(column)
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

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).json({ error: 'column id is required' })
    }

    const col = await prisma.column.findUnique({ where: { id } })

    if (!col) {
      res.status(404).json({ error: 'not found' })
    }

    if (col.isDefault) {
      return res.status(400).json({
        error: 'Default columns cannot be deleted'
      })
    }

    const todo = await prisma.column.findFirst({
      where: {
        userId: col.userId,
        name: 'TODO'
      }
    })

    if (!todo) {
      return res.status(500).json({ error: 'TODO column is missing' })
    }

    await prisma.$transaction([
      prisma.task.updateMany({
        where: { columnId: id },
        data: {
          columnId: todo.id
        }
      })
    ])

    res
      .status(204)
      .json({ message: `Columns of ${col.name} are moved to TODO column` })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const reorder = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body

    if (!Array.isArray(orders)) {
      return res.status(400).json({
        error: 'orders must be an array and it is required'
      })
    }

    await prisma.$transaction(
      orders.map((o) => {
        prisma.column.update({
          where: { id: o.id },
          data: { position: o.position }
        })
      })
    )

    res.status(204).json({ message: 'Order was successfuly updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
