# 📊 ESTADO DEL PROYECTO - Laurio Content Backlog

**Última actualización:** 2025-12-01

## ✅ IMPLEMENTADO

### 1. Infraestructura Base (Monorepo)
- ✅ Estructura de monorepo con `pnpm` workspaces
- ✅ Configuración de `pnpm-workspace.yaml`
- ✅ Package `@laurio/shared` con tipos TypeScript compartidos
  - ✅ Interfaces: `BacklogItem`, `PostType`
  - ✅ Build configurado y funcionando

### 2. Backend BFF (NestJS) - `apps/bff-panel`
- ✅ Servidor NestJS inicializado
- ✅ Prisma configurado con SQLite
- ✅ Schema de base de datos (`BacklogItem` model)
- ✅ Módulo `backlog/` con CRUD básico
- ✅ Módulo `orchestration/` para comunicación con Python
- ✅ TypeScript configurado correctamente

### 3. Servicio de IA (Python ADK) - `apps/adk-agent`
- ✅ Estructura de carpetas creada
- ✅ FastAPI server (`main.py`)
- ✅ Agentes ADK implementados:
  - ✅ `scout.py` (Investigación)
  - ✅ `curator.py` (Curación)
  - ✅ `editor.py` (Edición de contenido)
  - ✅ `visual.py` (Prompts visuales)
- ✅ Tool de búsqueda (`tools/search_tool.py`)

### 4. Frontend (Next.js) - `apps/fe-panel`
- ✅ Next.js inicializado con App Router
- ✅ TypeScript configurado
- ✅ Dependencia a `@laurio/shared` configurada
- ✅ API client básico (`src/lib/api.ts`)

## ⏳ PENDIENTE / EN PROGRESO

### 1. Backend BFF
- ⏳ Implementar endpoints REST completos:
  - `GET /backlog` - Listar items
  - `GET /backlog/:id` - Detalle de item
  - `POST /backlog` - Crear item
  - `PATCH /backlog/:id` - Actualizar item
- ⏳ Implementar cliente HTTP hacia Python ADK
- ⏳ Endpoint `POST /orchestrations/weekly-content`
- ⏳ Manejo de errores y validación
- ⏳ Migración de Prisma (`npx prisma migrate dev`)

### 2. Servicio Python ADK
- ⏳ Configurar variables de entorno (`.env`)
- ⏳ Implementar endpoint `/run-flow` completo
- ⏳ Orquestación secuencial de agentes
- ⏳ Integración con APIs de búsqueda (Tavily/Serper)
- ⏳ Manejo de respuestas JSON estructuradas
- ⏳ Testing de agentes individuales

### 3. Frontend
- ⏳ Componente `BacklogTable` (lista de items)
- ⏳ Componente `BacklogDetail` (vista de detalle)
- ⏳ Componente `TriggerButton` (generar contenido)
- ⏳ Formularios de edición
- ⏳ Manejo de estados (loading, error)
- ⏳ Estilos y UI básica

### 4. Integración End-to-End
- ⏳ Flujo completo: Frontend → BFF → Python → BFF → Frontend
- ⏳ Configuración de CORS
- ⏳ Manejo de timeouts (60-120s para LLM)
- ⏳ Testing del flujo completo

### 5. DevOps y Configuración
- ⏳ Scripts de inicio en `package.json` root
- ⏳ Documentación de setup local
- ⏳ Variables de entorno documentadas
- ⏳ Workflow de desarrollo definido

## 🐛 ISSUES RESUELTOS RECIENTEMENTE

1. ✅ **Error TypeScript en `fe-panel`**: 
   - Problema: `Cannot find module '@laurio/shared'`
   - Solución: Build del package shared (`pnpm build` en `packages/shared`)
   
2. ✅ **Error TypeScript `process` no definido**:
   - Problema: `Cannot find name 'process'`
   - Solución: Agregado `"types": ["node"]` en `tsconfig.json`

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Completar Backend BFF**: Implementar todos los endpoints REST
2. **Configurar Python ADK**: Variables de entorno y endpoint `/run-flow`
3. **Crear UI básica**: Tabla de backlog y vista de detalle
4. **Testing inicial**: Probar flujo completo con datos de prueba

---

# 📋 DOCUMENTO ORIGINAL - Especificación del Proyecto

Eres una IA experta en arquitectura de software, Google Agent Development Kit (ADK), orquestación de agentes y desarrollo full-stack con TypeScript/Node.js y React. Tu tarea es DISEÑAR Y EMPEZAR A IMPLEMENTAR un sistema interno para una startup EdTech llamado “Laurio Content Backlog”, pensado para orquestar la generación de contenido (sobre futuro laboral y educación) para Instagram usando agentes ADK.

1. Contexto de negocio (entiéndelo bien)

Laurio es una startup de educación que trabaja el cruce entre:

Futuro del trabajo y empleabilidad de jóvenes (14–22 años).

EdTech y desarrollo de habilidades para el mercado laboral actual.

Simulaciones de entorno laboral, onboarding y uso de datos para tomar decisiones.

La marca quiere posicionarse en Instagram con contenido sobre:

Futuro del trabajo, IA, automatización y nuevas profesiones.

Educación, EdTech, habilidades blandas y técnicas.

Cómo prepararse para conseguir el primer empleo o mejorar la empleabilidad.

Aprendizajes de la experiencia del fundador como desarrollador y CEO en EdTech.

Este contenido se va a publicar principalmente como:

Carruseles de Instagram (5–7 slides).

Post estáticos (1 imagen + copy).

Historias cortas (texto ultra breve reutilizable).

El sistema que vas a diseñar NO es la app pública de Laurio, sino un backlog interno para:

Capturar ideas y tendencias.

Orquestar un flujo con agentes IA para convertir esas ideas en posts listos.

Dejar todo en un tablero interno donde el fundador pueda revisar, editar y luego publicar manualmente en Instagram.

2. Visión del producto que debes construir (v1)

Crea el diseño y primeras implementaciones de un sistema llamado “Laurio Content Backlog” con estos componentes:

Agentes ADK (núcleo IA)
Un flujo multi-agente que, dado un tema o conjunto de temas, haga:

ScoutAgent (Investigación)

Entrada: lista de temas o palabras clave (ej. “IA y empleos junior”, “soft skills”, “onboarding laboral”).

Acción: hacer búsquedas web / lectura de fuentes y devolver:

Resumen corto.

3–5 insights accionables para la audiencia de Laurio.

Referencias de origen (URLs, títulos).

CuratorAgent (Curador / Editor de línea editorial Laurio)

Toma los insights del ScoutAgent.

Escoge cuál(es) son relevantes para Laurio y su audiencia (jóvenes + docentes + directivos).

Propone 1 o más ideas de post por tema, clasificadas como:

type: "ig_carousel" | "ig_post" | "story_snippet"

Para cada idea genera:

Título del post.

Objetivo del post (informar, inspirar, educar, storytelling fundador, etc.).

Mensaje principal (one-liner).

Ángulo narrativo (por ejemplo: “mitos vs realidad”, “pasos concretos”, “errores comunes”).

EditorAgent (Diseñador de estructura de post IG)

Para ideas de tipo ig_carousel:

Diseña una estructura tipo:

{
  "slides": [
    { "id": 1, "role": "hook", "text": "..." },
    { "id": 2, "role": "context", "text": "..." },
    { "id": 3, "role": "insight", "text": "..." },
    { "id": 4, "role": "ejemplo", "text": "..." },
    { "id": 5, "role": "implicancia", "text": "..." },
    { "id": 6, "role": "cta", "text": "..." }
  ]
}


Cada slide con texto corto en español, pensado para Instagram (claridad, espacio para diseño).

Tono cercano, práctico, con foco en futuro laboral/EdTech.

Para ideas de tipo ig_post:

Un texto principal corto para la imagen (headline).

Un copy de caption con:

Contexto breve.

Insight principal.

CTA (guardar, comentar, compartir).

Para story_snippet:

1–3 frases muy cortas para historias, reutilizables.

VisualAgent (Prompts visuales / gráficos)

A partir de la estructura del EditorAgent:

Decide qué slides necesitan grafico/ilustración y cuáles pueden ser solo texto.

Genera prompts en inglés para IA de imágenes, con estilo de marca consistente:

Menciona que es para una startup EdTech latinoamericana.

Pide estilos claros, sobrios, legibles.

Opcionalmente, propone tipos de gráficos simples (“timeline”, “bar chart”, “matrix”).

OpsAgent (Gestor de backlog y estado)

Se encarga de:

Escribir/actualizar items en una base de datos de backlog vía API.

Asignar estado:

"idea", "drafting", "ready_for_review", "approved", "posted".

Dejar metadata:

topic, target_audience, post_type, week, priority.

API / Backend de Backlog

Un backend ligero (Node.js + TypeScript + framework a tu elección: Express/Fastify/Nest) con endpoints REST:

POST /backlog/items

Crea un contenido en el backlog (lo usa OpsAgent).

GET /backlog/items

Lista items filtrando por estado, tipo, fecha objetivo.

PATCH /backlog/items/:id

Actualiza estado, textos, metadata.

GET /backlog/items/:id

Devuelve el detalle completo, incluyendo estructura de carrusel, prompts visuales y nota interna.

Modelo de datos base (puedes refinarlo):

type PostType = "ig_carousel" | "ig_post" | "story_snippet";

interface BacklogItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "idea" | "drafting" | "ready_for_review" | "approved" | "posted";
  topic: string;
  postType: PostType;
  targetAudience: "youth" | "teachers" | "school_leaders" | "other";
  mainMessage: string;
  objective: string;
  sourceInsights: {
    sourceUrl: string;
    sourceTitle: string;
    summary: string;
  }[];
  structure?: {
    slides?: {
      id: number;
      role: string;
      text: string;
    }[];
    caption?: string;
    storySnippets?: string[];
  };
  visualPrompts?: {
    forSlide?: number | null;
    description: string; // prompt completo para generador de imágenes
  }[];
  notes?: string;
  plannedDate?: string | null;
}


Para almacenamiento, puedes asumir algo simple tipo SQLite/Postgres con un ORM liviano (por ejemplo Prisma) o incluso una solución en memoria + archivo JSON para un primer MVP, pero el diseño debe ser fácil de migrar a DB real.

Pequeño Dashboard Web (v1 muy simple)

Una interfaz web mínima (React o Next.js + TypeScript) que permita:

Ver una tabla / lista de BacklogItem:

columnas: topic, postType, status, plannedDate.

Filtrar por status y postType.

Ver detalle de un item:

Slides del carrusel (texto).

Prompts visuales propuestos.

Notas / fuente.

Botones manuales (para uso humano, no IA):

Cambiar status (ej. de "ready_for_review" a "approved").

Editar textos (simple <textarea> o <input>).

No implementes autenticación compleja en esta primera versión; asume uso interno.

3. Cómo debe funcionar el flujo end-to-end (MVP)

Quiero que diseñes y empieces a implementar el siguiente flujo:

Trigger humano o programado

Llamada a un endpoint o función tipo:

POST /orchestrations/weekly-content

Payload de ejemplo:

{
  "brand": "Laurio",
  "postsPerWeek": 4,
  "topics": [
    "impacto de la IA en trabajos junior",
    "habilidades blandas para el primer empleo",
    "errores comunes al buscar tu primera práctica profesional"
  ]
}


Orchestrator ADK

Orchestrator llama a ScoutAgent con esos topics.

Recibe insights y los pasa a CuratorAgent.

Curator devuelve una lista de ideas de post.

Para cada idea seleccionada:

Llama a EditorAgent → estructura de carrusel o post.

Llama a VisualAgent → prompts de imagen/diagramas.

Llama a OpsAgent → crea un BacklogItem con estado "drafting" o "ready_for_review".

Resultado esperado

Después de correr, en la base de datos/backlog hay:

~4 items con status = "ready_for_review".

Cada uno con:

topic, postType, mainMessage, objective.

Slides textuales listos para IG.

Prompts visuales asociadas.

Fuentes de información usadas.

Revisión humana

El fundador abre el dashboard web.

Revisa los items, edita, y cambia a "approved" cuando le guste.

(No es necesario que programes el envío automático a Instagram en esta fase.)

4. Stack técnico preferido

Da por hecho lo siguiente y elige lo más coherente:

Lenguaje principal: TypeScript.

Backend:

Node.js 20+.

Framework sugerido: Express, Fastify o NestJS (elige uno y sé consistente).

Frontend:

React o Next.js (elige uno; si usas Next, app router moderno).

ADK:

Usa Google Agent Development Kit (ADK).

Si ADK está mejor soportado en Python:

Puedes separar el componente ADK en un servicio aparte (Python)

Comunicarlo con el backend Node vía HTTP (API).

Si hay soporte sólido en Node/TypeScript, puedes integrarlo directamente.

Estilo de código:

Modular, separación clara por capas:

adk/ (agentes, tools, orquestadores)

backend/ (API REST)

frontend/ (dashboard)

Usa buenas prácticas y nombres claros.

5. Qué quiero que hagas en tu respuesta

Proponer una arquitectura clara (texto + estructura de carpetas)

Describe brevemente:

Dónde vive el orquestador ADK.

Cómo se exponen las herramientas (web search, backlog API).

Cómo se comunica el backend con el ADK.

Estructura de carpetas para un monorepo simple (por ejemplo con pnpm o yarn workspaces), si lo consideras útil.

Definir los agentes ADK y sus herramientas

Especifica:

Nombre de cada agente.

Responsabilidad.

Inputs/outputs principales (en JSON).

Si es posible, incluye código o pseudo-código de configuración ADK para:

Orchestrator.

ScoutAgent.

CuratorAgent.

EditorAgent.

VisualAgent.

OpsAgent.

Definir el modelo de datos del backlog

Especifica los tipos/interfaces en TypeScript.

Incluye esquema de base de datos (SQL o Prisma schema) suficiente para implementar BacklogItem.

Implementar el primer MVP de backend

Escribe código real y completo para:

Un servidor básico (Express/Fastify/Nest, el que elijas).

Endpoints REST descritos arriba.

Manejo de BacklogItem en memoria o con una DB ligera (tú decides qué es más rápido para un primer MVP pero que sea fácil de migrar).

Implementar un frontend mínimo

Escribe el código de:

Página principal con tabla de backlog.

Vista de detalle de un item.

No necesitas un diseño visual elaborado, pero sí algo funcional.

Describir cómo conectar todo el flujo

Explica (en la misma respuesta, de forma breve y clara):

Cómo se ejecuta el flujo semanal (weekly-content).

Qué archivo o comando debo correr para probarlo localmente.

Cómo probar la llamada al orquestador (ejemplo de curl o fetch).

Diseña todo pensando en crecer

Aunque el foco actual es contenido para Instagram, diseña los modelos y el orquestador de forma que en el futuro se puedan agregar otros tipos de backlog items, por ejemplo:

Experimentos de producto.

Ideas para módulos nuevos de Laurio.

Email campaigns.

Por ahora SOLO implementa el tipo "content" con los campos que ya definimos.

6. Estilo y formato de tu respuesta

Responde en español, pero usa identificadores y nombres de archivos en inglés.

Cuando escribas código:

Hazlo en bloques completos, listos para copiar/pegar.

Evita dejar funciones a medias o con TODO críticos.

Si necesitas asumir algo (por ejemplo, si ADK solo está disponible en cierto lenguaje), explícalo brevemente y toma una decisión razonable.

Tu objetivo es dejarme con:

Una arquitectura clara del sistema de orquestación de contenido para Laurio usando ADK.

Código inicial funcional (aunque sea minimalista) para:

Orquestación (o al menos su esqueleto).

API de backlog.

Dashboard simple de consulta.

A partir de tu respuesta, empezaré a iterar y extenderemos el sistema juntos.

## 7. Guía Maestra de Implementación (Detallada para Agentes)

**IMPORTANTE PARA EL AGENTE DESARROLLADOR:**
Esta sección es la **única fuente de verdad** para la implementación. Sigue estos pasos de forma secuencial y literal. No asumas configuraciones no descritas aquí. Si te pierdes, vuelve a leer este plan.

### 7.1 Estructura Global del Proyecto (Monorepo)

Vamos a usar un monorepo gestionado por `pnpm`.

**Estructura de Directorios Exacta:**
```text
/Users/JhenN/Desktop/Laurio Backoffice/  <-- Root
├── package.json                         <-- Root package.json
├── pnpm-workspace.yaml                  <-- Definición de workspaces
├── .gitignore                           <-- Ignorar node_modules, venv, etc.
├── apps/
│   ├── adk-agent/                       <-- Servicio Python (IA)
│   │   ├── venv/
│   │   ├── requirements.txt
│   │   ├── main.py                      <-- Entrypoint FastAPI
│   │   ├── agents/                      <-- Definición de Agentes ADK
│   │   │   ├── scout.py
│   │   │   ├── curator.py
│   │   │   ├── editor.py
│   │   │   └── visual.py
│   │   └── tools/                       <-- Herramientas custom (Search)
│   ├── bff-panel/                       <-- Servicio Node.js (NestJS)
│   │   ├── prisma/                      <-- Schema SQLite
│   │   ├── src/
│   │   │   ├── backlog/                 <-- Módulo de Backlog
│   │   │   ├── orchestration/           <-- Cliente HTTP hacia adk-agent
│   │   │   └── app.module.ts
│   └── fe-panel/                        <-- Frontend (Next.js)
│       ├── src/app/                     <-- App Router
└── packages/
    └── shared/                          <-- Librería compartida de Tipos TS
        ├── package.json
        └── src/
            └── index.ts                 <-- Exporta interfaces (BacklogItem, etc)
```

### 7.2 Paso a Paso de Implementación

#### FASE 1: Configuración del Monorepo (Foundation)

1.  **Inicializar Root:**
    *   Crear `package.json` privado en la raíz.
    *   Crear `pnpm-workspace.yaml` con contenido:
        ```yaml
        packages:
          - 'apps/*'
          - 'packages/*'
        ```
    *   Crear `.gitignore` estándar (node_modules, dist, .env, venv, __pycache__, .DS_Store).

2.  **Crear Paquete Shared (`packages/shared`):**
    *   `mkdir -p packages/shared`
    *   `cd packages/shared && pnpm init`
    *   Editar `package.json` -> name: `@laurio/shared`, main: `dist/index.js`, types: `dist/index.d.ts`.
    *   Instalar `typescript` como devDependency.
    *   Crear `tsconfig.json` para emitir declaraciones (`declaration: true`).
    *   **Archivo Crítico:** `src/index.ts`. Debe contener las interfaces definidas en la sección 2 de este documento (`BacklogItem`, `PostType`, etc.).

#### FASE 2: Backend BFF (NestJS)

1.  **Inicializar (`apps/bff-panel`):**
    *   Usar Nest CLI o crear manualmente.
    *   Dependencias: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `prisma`, `@prisma/client`.
    *   Dependencia local: `"@laurio/shared": "workspace:*"`.

2.  **Base de Datos (Prisma):**
    *   `npx prisma init`
    *   **Schema (`prisma/schema.prisma`):**
        ```prisma
        datasource db {
          provider = "sqlite"
          url      = "file:./dev.db"
        }
        generator client {
          provider = "prisma-client-js"
        }
        model BacklogItem {
          id             String   @id @default(uuid())
          createdAt      DateTime @default(now())
          updatedAt      DateTime @updatedAt
          status         String   // "idea", "drafting", "ready_for_review", ...
          topic          String
          postType       String
          targetAudience String
          mainMessage    String?
          objective      String?
          // JSON fields for complex structures (SQLite supports JSON via string)
          sourceInsights String?  // JSON string
          structure      String?  // JSON string
          visualPrompts  String?  // JSON string
          notes          String?
          plannedDate    DateTime?
        }
        ```

3.  **Módulos:**
    *   `BacklogModule`: Controller y Service para CRUD de `BacklogItem`.
    *   `OrchestrationModule`: Controller que recibe `POST /orchestrations/weekly`.
        *   Lógica: Recibe topics -> Crea items en DB (status: "drafting") -> Llama a `http://localhost:8000/run-flow` (Python) -> Recibe resultado -> Actualiza items en DB (status: "ready_for_review").

#### FASE 3: Servicio de IA (Python ADK)

1.  **Inicializar (`apps/adk-agent`):**
    *   Crear entorno virtual: `python3 -m venv venv`.
    *   **Requirements (`requirements.txt`):**
        ```text
        fastapi
        uvicorn
        google-genai-agents  # O el paquete oficial de ADK que estemos usando
        pydantic
        python-dotenv
        requests             # Para search tools
        ```

2.  **Servidor (`main.py`):**
    *   FastAPI app corriendo en puerto 8000.
    *   Endpoint: `POST /run-flow`.
    *   Body: `{ "topics": ["tema1", "tema2"], "brand_context": "..." }`.

3.  **Implementación de Agentes (ADK):**
    *   Configurar `GenAIClient` con API Key.
    *   **ScoutAgent:**
        *   System Prompt: "Eres un investigador experto en futuro del trabajo..."
        *   Tool: `search_tool(query: str)`. Usar API de Tavily o Serper (simular si no hay key).
    *   **CuratorAgent:**
        *   System Prompt: "Eres un editor jefe. Filtras insights y decides el formato..."
    *   **EditorAgent:**
        *   System Prompt: "Redactas contenido para Instagram. Estructura carruseles..."
    *   **VisualAgent:**
        *   System Prompt: "Eres director de arte. Creas prompts para generación de imagen..."

4.  **Orquestación Lineal:**
    *   En `/run-flow`, ejecutar secuencialmente:
        `Scout -> Curator -> Editor -> Visual` para cada tema.
    *   Devolver JSON final estructurado.

#### FASE 4: Frontend (Next.js)

1.  **Inicializar (`apps/fe-panel`):**
    *   `npx create-next-app@latest` (TypeScript, Tailwind, App Router).
    *   Dependencia local: `"@laurio/shared": "workspace:*"`.

2.  **Componentes Clave:**
    *   `BacklogTable`: Usa `@tanstack/react-table` (opcional) o tabla simple HTML. Muestra items traídos de `GET http://localhost:3000/backlog`.
    *   `BacklogDetail`: Formulario para editar `mainMessage`, `structure` (slides), `visualPrompts`.
    *   `TriggerButton`: Botón "Generar Contenido Semanal" que llama a `POST http://localhost:3000/orchestrations/weekly`.

### 7.3 Contratos de API (Interacción BFF <-> Python)

**Request a Python (`POST /run-flow`):**
```json
{
  "topics": ["IA en educación", "Soft skills"],
  "context": "Audiencia joven, tono cercano"
}
```

**Response de Python:**
```json
{
  "results": [
    {
      "topic": "IA en educación",
      "postType": "ig_carousel",
      "mainMessage": "La IA no te reemplaza, te potencia",
      "structure": { "slides": [...] },
      "visualPrompts": [...]
    }
  ]
}
```

### 7.4 Variables de Entorno (.env)

Cada app debe tener su `.env`:

*   `apps/bff-panel/.env`:
    *   `DATABASE_URL="file:./dev.db"`
    *   `PYTHON_AGENT_URL="http://localhost:8000"`
*   `apps/adk-agent/.env`:
    *   `GOOGLE_API_KEY="..."`
    *   `TAVILY_API_KEY="..."` (para búsquedas)

### 7.5 Solución de Problemas y Riesgos Comunes (Troubleshooting)

**Si algo falla, consulta esta tabla antes de intentar arreglos aleatorios.**

| Problema | Síntoma | Solución |
| :--- | :--- | :--- |
| **Conflictos de Puerto** | Error `EADDRINUSE` al iniciar NestJS o FastAPI. | Asegura que NestJS use puerto `3000` y FastAPI `8000`. Mata procesos viejos con `lsof -i :3000` y `kill -9 <PID>`. |
| **CORS Error** | El Frontend no puede llamar al BFF (`Access-Control-Allow-Origin`). | En `apps/bff-panel/src/main.ts`, habilita CORS: `app.enableCors({ origin: 'http://localhost:3001' });` (Asumiendo que Next.js corre en 3001 si el 3000 está ocupado, o viceversa). |
| **Python Module Not Found** | `ModuleNotFoundError` al correr `main.py`. | **CRÍTICO:** Asegúrate de activar el entorno virtual (`source venv/bin/activate`) ANTES de instalar dependencias o correr el server. Verifica que estás en la carpeta `apps/adk-agent`. |
| **Timeout en LLM** | La llamada a `/run-flow` tarda mucho y el BFF da timeout. | La generación de contenido es lenta. Aumenta el timeout de la llamada HTTP en NestJS (axios/fetch) a **60-120 segundos**. |
| **SQLite Locked** | Error `SQLITE_BUSY: database is locked`. | SQLite no soporta alta concurrencia de escritura. Para desarrollo local, evita hacer muchas peticiones paralelas. Si persiste, reinicia el servidor NestJS para liberar el lock. |
| **Tipos no encontrados** | NestJS no encuentra `@laurio/shared`. | Asegúrate de haber corrido `pnpm install` en la raíz y `pnpm build` dentro de `packages/shared`. Verifica que `package.json` del BFF tenga `"@laurio/shared": "workspace:*"`. |
| **Alucinaciones JSON** | El agente Python devuelve texto en vez de JSON. | En el System Prompt de los agentes, enfatiza: "You MUST return strict JSON. Do not include markdown formatting like ```json ... ```". Usa `response_schema` si el modelo lo soporta (Gemini 1.5 Pro lo soporta). |

### 7.6 Comandos de Verificación Rápida

Usa estos comandos para validar que cada pieza funciona aisladamente:

1.  **Validar Python:**
    ```bash
    curl -X POST http://localhost:8000/run-flow \
      -H "Content-Type: application/json" \
      -d '{"topics": ["test"], "context": "test"}'
    ```
2.  **Validar BFF:**
    ```bash
    curl http://localhost:3000/backlog
    ```
3.  **Validar DB:**
    ```bash
    npx prisma studio # Abre interfaz web para ver datos
    ```

### 7.7 Recomendaciones y Buenas Prácticas ADK (Investigación)

Basado en la documentación y patrones de diseño de Google GenAI Agents:

1.  **Patrón ReACT (Reasoning + Acting):**
    *   Para el `ScoutAgent`, usa el patrón ReACT. No le pidas solo "busca X", sino "piensa qué necesitas buscar, busca, analiza si es suficiente, y busca más si hace falta".
    *   ADK facilita esto permitiendo que el agente llame a sus tools en un bucle hasta satisfacer la query.

2.  **Gestión de Estado (Session Management):**
    *   Usa `InMemorySessionService` (o su equivalente en la versión de ADK que usemos) para mantener el contexto de la conversación si decidimos hacer el flujo interactivo en el futuro.
    *   Para el MVP (batch), el estado es efímero, pero estructurar el código pensando en sesiones facilitará agregar un chat de "refinamiento" después.

3.  **Jerarquía de Agentes:**
    *   Mantén los agentes pequeños y especializados.
    *   **Scout:** Solo busca y resume.
    *   **Curator:** Solo filtra y decide formatos.
    *   **Editor:** Solo redacta.
    *   **Visual:** Solo describe imágenes.
    *   No intentes hacer un "Super Agente" que haga todo; es difícil de depurar y propenso a errores.

4.  **Observabilidad:**
    *   Habilita logs detallados en desarrollo. Ver el "pensamiento" (chain of thought) del modelo es crucial para entender por qué eligió un tema o descartó otro.

### 7.8 Consideraciones Avanzadas para Producción (Nuevos Insights)

**Integración Node.js <-> ADK (Desafíos):**
*   **No existe SDK oficial de Node:** La integración requiere trabajo manual (HTTP + SSE).
*   **Recomendación:** Usar o inspirarse en librerías como `google-adk-client` para manejar la conexión y el streaming de eventos sin reinventar la rueda.
*   **Gestión de Sesiones:** El BFF (NestJS) debe ser el "dueño" de la sesión. Debe mapear `UserId` de la app a `SessionId` de ADK y persistir este mapeo.

**Riesgos de Orquestación y Mitigación:**
1.  **Pérdida de Contexto:** Si un agente delega mal, el contexto se rompe.
    *   *Solución:* Usar `SequentialAgent` o `ParallelAgent` de ADK para flujos estructurados en lugar de confiar solo en el prompt del LLM para coordinar pasos.
2.  **Cold Starts (Serverless):**
    *   Si desplegamos en Cloud Run, el primer request puede tardar >20s.
    *   *Solución:* Mantener instancias "calientes" (min instances > 0) o usar imports diferidos en Python.
3.  **Costos y Tokens:**
    *   ADK puede ser verboso enviando contexto repetido.
    *   *Solución:* Monitorear uso de tokens desde el día 1. Implementar caching manual de resultados de tools si es posible.

**Escalabilidad:**
*   **Persistencia:** Para ir más allá del MVP, necesitaremos persistir el estado de los agentes en Firestore (o similar), ya que la memoria RAM se pierde al reiniciar.
*   **Evaluación:** Usar el framework de evaluación de ADK para crear "tests de unidad" de los agentes (ej: "Dada esta entrada, el ScoutAgent DEBE llamar a la tool de búsqueda").

---
Sigue este plan al pie de la letra. Si encuentras una ambigüedad, detente y pregunta al usuario.