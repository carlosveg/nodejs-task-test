import { Request, Response } from 'express'
import prisma from '../config/prisma.config'

export const listColumns = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query

    if (!userId) return res.status(404).json({ error: 'userId is required' })

    const columns = await prisma.column.findMany({
      where: { userId: String(userId) },
      orderBy: { position: 'asc' },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true
          },
          where: {
            status: true
          }
        }
      }
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
    const { columnId, name, userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    const columns = await prisma.column.findMany({
      where: { userId },
      orderBy: {
        position: 'asc'
      }
    })

    const columnToUpdate = columns.find((c) => c.id === columnId)

    if (!columnToUpdate) {
      return res
        .status(404)
        .json({ error: `Column with id ${columnId} not found` })
    }

    if (columnToUpdate.isDefault) {
      return res
        .status(400)
        .json({ error: 'Default columns cannot be updated' })
    }

    if (name && name !== columnToUpdate.name)
      await prisma.column.update({ where: { id: columnId }, data: { name } })

    res.status(200).json({ message: 'Column was updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    if (!id) {
      res.status(400).json({ error: 'column id is required' })
    }

    const col = await prisma.column.findUnique({ where: { id, userId } })

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
      }),

      prisma.column.delete({ where: { id } })
    ])

    res
      .status(200)
      .json({ message: `Columns of ${col.name} are moved to TODO column` })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const reorder = async (req: Request, res: Response) => {
  try {
    const { columnIds, userId } = req.body

    if (!Array.isArray(columnIds)) {
      return res.status(400).json({
        error: 'orders must be an array and it is required'
      })
    }

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      })
    }

    const columns = await prisma.column.findMany({
      where: { userId, id: { in: columnIds } },
      orderBy: {
        position: 'asc'
      }
    })

    if (columns.length !== columnIds.length) {
      return res
        .status(400)
        .json({ message: 'User are not owner of some columns.' })
    }

    const reordered = columnIds.map((id, index) => ({
      id,
      position: index
    }))

    await prisma.$transaction(
      reordered.map((column, index) =>
        prisma.column.update({
          where: { id: column.id },
          data: { position: index }
        })
      )
    )

    res.status(200).json({ message: 'Orders was successfuly updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
