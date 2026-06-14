# Agent Instructions & Project Rules

## 1. Contexto del Proyecto

- **Descripción:** Aplicación web personal de gestión financiera para un comerciante P2P de Binance. La app registra balances diarios, calcula ganancias/pérdidas netas y almacena capturas de pantalla (vouchers, chats) como comprobantes de transacciones.
- **Arquitectura:**
    - **Frontend:** React + TypeScript + Vite (Desplegado en GitHub Pages).
    - **Backend:** Node.js + TypeScript (Alojado en Render).
    - **Base de Datos y Almacenamiento:** Supabase (PostgreSQL para datos relacionales y Supabase Storage para las imágenes).
    - **Navegación:** TanStack Router.

---

## 2. Reglas Estrictas de TypeScript

- **Cero `any`:** Prohibido el uso de `any`. Si un tipo es verdaderamente desconocido o dinámico, utiliza `unknown`.
- **Tipado Explicito:** Todo argumento de función, valor de retorno, prop de componente y estado complejo debe estar tipado explícitamente.
- **Estructuras de Datos:** Usa `interface` para definir la estructura de las entidades de la base de datos y modelos del dominio (ej. `JornadaP2P`, `Transaccion`). Usa `type` para uniones, intersecciones o alias de tipos primitivos.
- **Inferencia Inteligente:** No dupliques tipados donde TypeScript pueda inferirlos de forma trivial (ej. `const isOpen = false;`).

---

## 3. Estándares del Frontend (React + TypeScript)

- **Componentes Funcionales:** Usa exclusivamente arrow functions (`const Component = () => {}`) y exportaciones nombradas.
- **Modularidad:** Un componente por archivo. Si un componente o vista supera las 150 líneas de código, debe ser refactorizado y dividido en subcomponentes más pequeños.
- **Separación de Conceptos:** La lógica de negocio, cálculos de capital, hooks de manejo de estado y peticiones HTTP a la API **nunca** deben vivir directamente dentro del JSX. Extráelos siempre a Custom Hooks independientes (ej. `useBalanceDiario.ts`).
- **Diseño y UI Coherente:** Implementa soporte nativo para Light y Dark Mode utilizando las siguientes variables de color exactas:
    - **Modo Claro (Light):** Fondo `#F8FAFC`, Tarjetas `#FFFFFF`, Botón Principal `#0F172A`, Texto `#334155`.
    - **Modo Oscuro (Dark):** Fondo `#0B0F19`, Tarjetas `#1E293B`, Botón Principal `#38BDF8`, Texto `#F8FAFC`.
    - **Estados Financieros:**
        - **Ganancias (Éxito):** Light `#10B981` | Dark `#34D399`
        - **Pérdidas (Alerta):** Light `#E11D48` | Dark `#FB7185`
- **Estilos:** No se utilizaran librerias externas como Tailwind ni nada similar, todos los estilos se basaran en CSS puro manteniendo las mejores practicas. Los achivos css correspondientes a las Screen se almacenaran en la carpeta src/styles con el mismo nombre del archivo tsx al que correspondan. Y los archivos css de los componentes se almacenaran en la carpeta src/components/styles con el mismo nombre del componente al que corresponden

## 4. Estándares del Backend (Node.js + TypeScript)

- **Arquitectura Limpia:** Divide el servidor siguiendo el patrón de capas: Rutas $\rightarrow$ Controladores $\rightarrow$ Servicios/Modelos. El controlador solo gestiona la petición y la respuesta; la lógica financiera y la comunicación con Supabase se aíslan en los servicios.
- **Validación de Datos:** Toda petición entrante (`req.body`, `req.query`, `req.params`) que contenga datos numéricos (como capital inicial/final) debe ser estrictamente validada en el backend antes de operar, utilizando esquemas de **Zod**.
- **Manejo de Errores Rígido:** Envuelve todas las operaciones asíncronas en bloques `try/catch`. Centraliza las respuestas de error a través de un middleware personalizado. Nunca expongas stack traces crudos del servidor al frontend.

---

## 5. Reglas de Interacción y Formato de Respuesta de la IA

- **Código Primero:** Proporciona soluciones de código directas, limpias y listas para producción. Reduce las explicaciones teóricas al mínimo necesario.
- **Rutas de Archivos Claras:** Añade siempre un comentario con la ruta exacta del archivo al principio de cada bloque de código (ej. `// src/components/Dashboard.tsx`).
- **Scripts Completos:** No utilices marcadores de posición perezosos como `// ... resto del código aquí ...` a menos que sea una edición menor explícitamente solicitada. Proporciona las estructuras completas para evitar errores de copia.
