import { Router } from 'express'
import { validateBody } from '../middlewares/validate'
import {
  createTaskSchema,
  deleteTaskBodySchema,
  updateTaskBodySchema
} from '../schemas/task.schema'
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask
} from '../services/task.service'

const router = Router()

router.get('/', listTasks)
router.post('/', validateBody(createTaskSchema), createTask)
router.put('/:id', validateBody(updateTaskBodySchema), updateTask)
router.delete('/:id', validateBody(deleteTaskBodySchema), deleteTask)

export default router
