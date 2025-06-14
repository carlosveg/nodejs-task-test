import { Router } from 'express'
import { validateBody } from '../middlewares/validate'
import {
  createColumnSchema,
  deleteColumnSchema,
  reorderColumnsSchema,
  updateColumnSchema
} from '../schemas/columns.schema'
import {
  createColumn,
  deleteColumn,
  listColumns,
  reorder,
  updateColumn
} from '../services/column.service'

const router = Router()

router.get('/', listColumns)
router.post('/', validateBody(createColumnSchema), createColumn)
router.put('/', validateBody(updateColumnSchema), updateColumn)
router.delete('/:id', validateBody(deleteColumnSchema), deleteColumn)
router.put('/reorder', validateBody(reorderColumnsSchema), reorder)

export default router
