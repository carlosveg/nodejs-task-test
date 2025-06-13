import express, { Express, Response, Request } from 'express'
import cors from 'cors'

const app: Express = express()

app.use(cors())
app.use(express.json())

// test route
app.get('/', (_, res: Response) =>
  res.status(200).send({ message: 'App is up and running' })
)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server is up and running on port ${port}`))
