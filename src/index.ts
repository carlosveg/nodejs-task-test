import cors from 'cors'
import express, { Express } from 'express'
import prisma from './config/prisma.config'
import { columnController, taskController, testController } from './controllers'
import { resolvers } from './graphql/resolver'
import { typeDefs } from './graphql/schema'
import { ApolloServer } from 'apollo-server-express'

const app: Express = express()

app.use(cors())
app.use(express.json())

// routes
app.use('/health-check', testController)
app.use('/columns', columnController)
app.use('/tasks', taskController)

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
  })
  await server.start()
  server.applyMiddleware({ app })

  console.log(`GraphQL listo en ${server.graphqlPath}`)
}

startApolloServer()

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
