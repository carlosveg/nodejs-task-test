import { Request, Response } from 'express'
import prisma from '../config/prisma.config'

export const listTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    const tasks = await prisma.task.findMany({
      where: { userId: userId as string, status: true },
      orderBy: { title: 'asc' },
      include: { column: { select: { name: true } } }
    })

    return res.status(200).json(tasks)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, userId, columnId } = req.body

    const taks = await prisma.task.create({
      data: {
        title,
        description,
        userId,
        columnId
      }
    })

    res.status(201).json({ message: 'Task was created successfuly' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    let { title, description, columnId } = req.body

    if (!columnId) {
      return res.status(400).json({ error: 'columnId is required' })
    }

    const task = await prisma.task.findUnique({ where: { id } })

    if (!task) {
      return res.status(404).json({ error: `Task with id ${id} not found` })
    }

    title = title ? title : task.title
    description = description ? description : task.description

    const taskUpdated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        columnId
      }
    })

    res
      .status(201)
      .json({ message: 'Task was created successfuly', taskUpdated })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    if (!id) {
      return res.status(400).json({ error: 'id is required' })
    }

    const task = await prisma.task.findUnique({ where: { id, userId } })

    if (!task) {
      return res.status(404).json({ error: `task with id ${id} not found` })
    }

    await prisma.task.update({
      where: { id },
      data: { status: false }
    })

    res.status(200).json({ message: 'task was deleted successfuly' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
