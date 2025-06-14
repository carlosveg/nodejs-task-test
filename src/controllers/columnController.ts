import { Router } from 'express'
import {
  createColumn,
  deleteColumn,
  listColumns,
  reorder,
  updateColumn
} from '../services/column.service'

const router = Router()

router.get('/', listColumns)
router.post('/', createColumn)
router.put('/', updateColumn)
router.delete('/:id', deleteColumn)
router.put('/reorder', reorder)

export default router
