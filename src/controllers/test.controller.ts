import { Router } from 'express'

const router = Router()

router.get('/', (_, res: Response) =>
  res.status(200).send({ message: 'App is up and running' })
)

export default router
