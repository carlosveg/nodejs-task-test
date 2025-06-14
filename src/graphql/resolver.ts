import prisma from '../config/prisma.config'

export const resolvers = {
  Query: {
    columns: async (_: any, { userId }: { userId: string }) => {
      return prisma.column.findMany({
        where: { userId },
        orderBy: { position: 'asc' },
        include: {
          tasks: {
            select: {
              id: true,
              title: true,
              description: true,
              columnId: true
            }
          }
        }
      })
    },
    tasks: async (_: any, { userId }: { userId: string }) => {
      return prisma.task.findMany({
        where: { userId }
      })
    }
  }
}
