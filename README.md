# To-Do API con Node.js, TypeScript, Prisma y PostgreSQL

## Stack

- ⚙️ **Node.js** + **Express**
- 🧠 **TypeScript** para tipado estricto
- 🛢️ **PostgreSQL** como base de datos
- 📦 **Prisma ORM** para modelado y consultas
- 🧪 **Zod** para validaciones robustas

---

## Instalación y Configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/carlosveg/nodejs-task-test
cd nodejs-task-test
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura el archivo `.env`

```env
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
```

### 4. Genera el cliente Prisma y aplica migraciones

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Precarga usuarios y columnas iniciales

```bash
npm run seed
```

> El seed creará usuarios dummy y sus 3 columnas por default: TODO, IN PROGRESS, DONE.

### 6. Levanta el servidor

```bash
npm run dev
```

---

## Validaciones con Zod

Todos los endpoints que reciben `body` ahora validan los datos usando Zod.

Ejemplo en `createTask`:

```ts
export const createTaskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  userId: z.string().uuid('userId debe ser UUID válido'),
  columnId: z.string().uuid('columnId debe ser UUID válido')
})

const parsed = createTaskSchema.parse(req.body)
```

Si los datos no son válidos, la API responde con un **400 Bad Request** y el detalle del error.

### Middleware global para manejar errores Zod personalizados

Se ha extraído un middleware personalizado que formatea los errores de Zod para una mejor experiencia de desarrollo:

```ts
// src/middlewares/validate.ts
import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

export const validateBody =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const formattedErrors: Record<string, string> = {}

      result.error.errors.forEach((e) => {
        const field = e.path.join('.')
        formattedErrors[field] = e.message
      })

      return res.status(400).json({
        message: 'Error de validación',
        errors: formattedErrors
      })
    }

    req.body = result.data
    next()
  }
```

---

## Endpoints disponibles

### Usuario (sembrado automáticamente)

- ID fijo para pruebas (ver seed.ts)

### Columnas

| Método | Endpoint           | Descripción                             |
| ------ | ------------------ | --------------------------------------- |
| GET    | `/columns`         | Lista columnas con tareas de un usuario |
| POST   | `/columns`         | Crea una nueva columna                  |
| PUT    | `/columns`         | Actualiza nombre                        |
| DELETE | `/columns/:id`     | Elimina columna (si no es default)      |
| PUT    | `/columns/reorder` | Reordena múltiples columnas             |

### Tareas

| Método | Endpoint     | Descripción              |
| ------ | ------------ | ------------------------ |
| GET    | `/tasks`     | Lista tareas por usuario |
| POST   | `/tasks`     | Crea una tarea           |
| PUT    | `/tasks/:id` | Actualiza tarea          |
| DELETE | `/tasks/:id` | Elimina tarea            |

> **Nota**: El `userId` debe enviarse en cada request en el body o query, según el endpoint.
