import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function createUserWithDefaultColumns(name: string) {
  const user = await prisma.user.create({
    data: { name }
  })

  const defaultColumns = [
    { name: 'TODO', position: 0 },
    { name: 'IN_PROGRESS', position: 1 },
    { name: 'DONE', position: 2 }
  ]

  await prisma.column.createMany({
    data: defaultColumns.map((col) => ({
      ...col,
      isDefault: true,
      userId: user.id
    }))
  })

  console.log(`Usuario "${name}" creado con columnas por defecto`)
}

async function main() {
  const users = ['Carlos', 'Mariana', 'Alan']
  for (const name of users) {
    await createUserWithDefaultColumns(name)
  }
}

main()
  .catch((e) => {
    console.error('Error durante seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
