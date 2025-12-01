# Laurio Content Backlog

Sistema de orquestación de contenido para Instagram usando Google ADK y agentes de IA.

## 🏗️ Arquitectura

Este es un monorepo que contiene:

- **`apps/bff-panel`**: Backend NestJS con API REST y Prisma (SQLite)
- **`apps/adk-agent`**: Servicio Python con agentes ADK para generación de contenido
- **`apps/fe-panel`**: Frontend Next.js con dashboard de gestión
- **`packages/shared`**: Tipos TypeScript compartidos

## 🚀 Setup Rápido

### 1. Instalar Dependencias

```bash
# Instalar todas las dependencias del monorepo
pnpm install

# Compilar el paquete shared
cd packages/shared && pnpm build && cd ../..
```

### 2. Configurar Backend BFF

```bash
cd apps/bff-panel

# Copiar variables de entorno
cp .env.example .env

# La migración de Prisma ya está aplicada, pero si necesitas resetear:
# npx prisma migrate reset
```

### 3. Configurar Python ADK (Opcional - requiere API keys)

```bash
cd apps/adk-agent

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar variables de entorno
cp .env.example .env

# IMPORTANTE: Editar .env y agregar tus API keys:
# - GOOGLE_API_KEY (Gemini)
# - TAVILY_API_KEY (búsquedas web)
```

### 4. Configurar Frontend

```bash
cd apps/fe-panel

# Copiar variables de entorno
cp .env.example .env
# Por defecto apunta a http://localhost:3000 (BFF)
```

## 🎯 Ejecutar el Sistema

### Opción A: Solo Backend + Frontend (sin IA)

```bash
# Terminal 1: Backend BFF
cd apps/bff-panel
npm run start:dev

# Terminal 2: Frontend
cd apps/fe-panel
npm run dev
```

Abre http://localhost:3001 en tu navegador.

### Opción B: Sistema Completo (con IA)

```bash
# Terminal 1: Python ADK Service
cd apps/adk-agent
source venv/bin/activate
python main.py

# Terminal 2: Backend BFF
cd apps/bff-panel
npm run start:dev

# Terminal 3: Frontend
cd apps/fe-panel
npm run dev
```

## 📡 API Endpoints

### Backend BFF (puerto 3000)

- `GET /backlog` - Listar items (soporta `?status=` y `?postType=`)
- `GET /backlog/:id` - Obtener detalle de un item
- `POST /backlog` - Crear item manualmente
- `PATCH /backlog/:id` - Actualizar item
- `POST /orchestrations/weekly-content` - Generar contenido con IA

### Python ADK (puerto 8000)

- `POST /run-flow` - Ejecutar flujo de agentes

## 🧪 Testing

### Probar Backend

```bash
# Listar items
curl http://localhost:3000/backlog

# Generar contenido (requiere Python ADK corriendo)
curl -X POST http://localhost:3000/orchestrations/weekly-content \
  -H "Content-Type: application/json" \
  -d '{
    "topics": ["IA en educación", "Soft skills"],
    "context": "Audiencia joven, tono cercano"
  }'
```

### Probar Python ADK

```bash
curl -X POST http://localhost:8000/run-flow \
  -H "Content-Type: application/json" \
  -d '{
    "topics": ["test"],
    "context": "test"
  }'
```

## 📝 Estado del Proyecto

### ✅ Completado

- [x] Monorepo con pnpm workspaces
- [x] Package `@laurio/shared` con tipos
- [x] Backend BFF con CRUD completo
- [x] Prisma + SQLite configurado y migrado
- [x] Servicio de orquestación con timeout de 120s
- [x] Estructura de agentes ADK (Scout, Curator, Editor, Visual)
- [x] Frontend con componentes principales
- [x] Filtros por estado y tipo de post
- [x] Vista de detalle con edición

### ⏳ Pendiente

- [ ] Configurar API keys en `.env` de Python
- [ ] Implementar lógica completa de agentes ADK
- [ ] Testing end-to-end del flujo completo
- [ ] Mejorar estilos y UX del frontend

## 🔧 Troubleshooting

### Error: "Cannot find module '@laurio/shared'"

```bash
cd packages/shared && pnpm build
```

### Error: "Python ADK service is not running"

El backend BFF puede funcionar sin el servicio Python. Solo no podrás generar contenido con IA hasta que lo inicies.

### Error: "SQLITE_BUSY: database is locked"

Reinicia el servidor NestJS. SQLite no soporta alta concurrencia.

## 📚 Próximos Pasos

1. Agregar tus API keys en `apps/adk-agent/.env`
2. Implementar la lógica de los agentes ADK
3. Probar el flujo completo de generación
4. Ajustar prompts de los agentes según resultados
