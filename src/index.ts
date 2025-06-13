import express, { Express, Response, Request } from 'express'
import cors from 'cors'
import { testController } from './controllers'
import prisma from './config/prisma.config'

const app: Express = express()

app.use(cors())
app.use(express.json())

// routes
app.use('/health-check', testController)

async function startServer() {
  try {
    console.log('Connecting with DB...')
    await prisma.$connect()

    const port = process.env.PORT || 3000

    app.listen(port, () => console.log(`Server ready on port ${port}`))
  } catch (error) {
    console.error('An error was ocurred try again:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

startServer()
