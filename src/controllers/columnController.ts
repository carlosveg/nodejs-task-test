import { Router } from 'express'
import { listColumns } from '../services/column.service'

const router = Router()

router.get('/', listColumns)

export default router
