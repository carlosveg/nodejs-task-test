// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [{ name: 'Charly' }, { name: 'Mariana' }],
    skipDuplicates: true
  })
  console.log('🚀 Usuarios precargados con éxito')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
