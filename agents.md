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
- **Tipado Explícito:** Todo argumento de función, valor de retorno, prop de componente y estado complejo debe estar tipado explícitamente.
- **Estructuras de Datos:** Usa `interface` para definir la estructura de las entidades de la base de datos y modelos del dominio (ej. `JornadaP2P`, `Transaccion`). Usa `type` para uniones, intersecciones o alias de tipos primitivos.
- **Inferencia Inteligente:** No dupliques tipados donde TypeScript pueda inferirlos de forma trivial (ej. `const isOpen = false;`).

---

## 3. Estándares del Frontend (React + TypeScript)

- **Componentes Funcionales:** Usa exclusivamente arrow functions (`const Component = () => {}`) y exportaciones nombradas.
- **Modularidad:** Un componente por archivo. Si un componente o vista supera las 150 líneas de código, debe ser refactorizado y dividido en subcomponentes más pequeños.
- **Separación de Conceptos:** La lógica de negocio, cálculos de capital, hooks de manejo de estado y peticiones HTTP a la API **nunca** deben vivir directamente dentro del TSX. Extráelos siempre a Custom Hooks independientes (ej. `useDailyBalance.ts`).
- **Diseño y UI Coherente:** El diseño visual se rige estrictamente por tokens de diseño centralizados. El soporte para Light y Dark Mode se maneja inyectando la clase `.dark` en el `<html>` o `<body>`. Queda prohibido hardcodear códigos hexadecimales; se deben usar exclusivamente las siguientes variables CSS globales:
    - **Fondo General de la App:** `var(--background)`
    - **Contenedores y Tarjetas:** `var(--card-background)`
    - **Botón Principal (Fondo):** `var(--btn-primary)`
    - **Texto dentro de Botones:** `var(--btn-text)`
    - **Texto Principal (Títulos/Labels):** `var(--text-primary)`
    - **Texto Secundario (Subtítulos/Muted):** `var(--text-secondary)`
    - **Estados Financieros:**
        - **Ganancias (Éxito/Capital Positivo):** `var(--status-success)`
        - **Pérdidas (Alerta/Capital Negativo):** `var(--status-error)`
- **Estilos y Coherencia de Rutas CSS (Estricto):** Queda totalmente prohibido el uso de librerías externas (Tailwind, Bootstrap, etc.); todo el diseño se basará en CSS puro. La ubicación de los archivos `.css` debe ser un espejo exacto y mandatorio de la estructura del componente o pantalla al que pertenecen:
    1. **Para Vistas/Pantallas (Screens):** Si el archivo de la pantalla está en `src/screens/NombreScreen.tsx` o dentro de una subcarpeta protegida como `src/screens/_authenticated/NombreScreen.tsx`, su archivo CSS DEBE guardarse exclusivamente en `src/styles/NombreScreen.css`.
        - _Ejemplo 1:_ `src/screens/LoginScreen.tsx` $\rightarrow$ `src/styles/LoginScreen.css`
        - _Ejemplo 2:_ `src/screens/_authenticated/DetailsScreen.tsx` $\rightarrow$ `src/styles/DetailsScreen.css`
    2. **Para Contenedores Estructurales (Layouts):** Si el archivo `.tsx` está en `src/layouts/NombreLayout.tsx`, su CSS DEBE guardarse exclusivamente en `src/layouts/styles/NombreLayout.css`.
    3. **Para Componentes Específicos por Screen:** La ruta de los componentes pertenecientes a una pantalla está anidada en `src/components/NombreDeLaScreen/NombreComponente.tsx`. Los estilos de dicho componente DEBEN guardarse obligatoriamente dentro de la subcarpeta `styles/` en esa misma ubicación del componente: `src/components/NombreDeLaScreen/styles/NombreComponente.css`.
        - _Ejemplo 1:_ `src/components/BalanceScreen/AmountField.tsx` $\rightarrow$ `src/components/BalanceScreen/styles/AmountField.css`
        - _Ejemplo 2:_ `src/components/DetailsScreen/Balance.tsx` $\rightarrow$ `src/components/DetailsScreen/styles/Balance.css`
- **Aislamiento de Estilos (Cero Contaminación):** Cada componente funcional, layout o screen debe tener su propio archivo CSS individual e independiente. Queda estrictamente PROHIBIDO agrupar, combinar o escribir estilos de un componente dentro del archivo CSS de otro componente, layout o screen. Si un elemento requiere estilos, se le crea su propio archivo CSS en su respectiva ubicación según las reglas anteriores.
- **Estructura de Directorios Estricta:** El proyecto se divide rigurosamente en tres conceptos arquitectónicos:
    1. `src/layouts/`: Aloja exclusivamente los cascarones estructurales (ej. `DashboardLayout.tsx`). Sus estilos van en `src/layouts/styles/`.
    2. `src/screens/`: Aloja las páginas o vistas finales de la app (ej. `LoginScreen.tsx`, `_authenticated/DetailsScreen.tsx`). Sus estilos van exclusivamente en `src/styles/`.
    3. `src/components/`: Aloja los subcomponentes organizados por pantalla (`src/components/NombreDeLaScreen/`). Sus estilos van obligatoriamente en `src/components/NombreDeLaScreen/styles/`.

---

## 4. Estándares del Backend (Node.js + TypeScript)

- **Arquitectura Limpia:** Divide el servidor siguiendo el patrón de capas: Rutas $\rightarrow$ Controladores $\rightarrow$ Servicios/Modelos. El controlador solo gestiona la petición y la respuesta; la lógica financiera y la comunicación con Supabase se aislan en los servicios a través del cliente oficial (`@supabase/supabase-js`).
- **Validación de Datos:** Toda petición entrante (`req.body`, `req.query`, `req.params`) que contenga datos numéricos (como capital inicial/final) debe ser estrictamente validada en el backend antes de operar, utilizando esquemas de **Zod**.
- **Manejo de Errores Rígido:** Envuelve todas las operaciones asíncronas en bloques `try/catch`. Centraliza las respuestas de error a través de un middleware personalizado. Nunca expongas stack traces crudos del servidor al frontend.

---

## 5. Reglas de Interacción y Formato de Respuesta de la IA

- **Código Primero:** Proporciona soluciones de código directas, limpias y listas para producción. Reduce las explicaciones teóricas al mínimo necesario.
- **Rutas de Archivos Claras:** Añade siempre un comentario con la ruta exacta del archivo al principio de cada bloque de código (ej. `// src/components/BalanceScreen/styles/AmountField.css`).
- **Scripts Completos:** No utilices marcadores de posición perezosos como `// ... resto del código aquí ...` a menos que sea una edición menor explícitamente solicitada. Proporciona las estructuras completas para evitar errores de copia.

---

## 6. Reglas de Internacionalización (i18n)

Para mantener una arquitectura multiidioma highly escalable y prevenir errores en tiempo de compilación, el Agente de IA debe cumplir estrictamente con las siguientes reglas:

### ⚙️ Directrices de Implementación

1. **Seguridad de Tipos Estricta (Type-Safe Keys):**
    - El proyecto utiliza `i18next` con definiciones de tipos de módulo personalizadas mapeadas directamente al archivo base `src/locales/es.json`.
    - Queda prohibido hardcodear o adivinar una llave de traducción. Cada llave pasada a la función `t()` DEBE ser verificada contra la estructura del JSON para garantizar que la compilación de TypeScript sea exitosa.
    - Ejemplo de llamada válida: `{t('LoginScreen.title')}`
2. **Absolutamente Cero Texto Plano:**
    - No se permite escribir ninguna cadena de texto visible para el usuario, etiqueta, placeholder, título, texto de botón o mensaje de error como texto plano dentro de los archivos TSX.
    - Cada texto debe ser extraído obligatoriamente a los archivos `src/locales/es.json` y `src/locales/en.json` bajo estructuras de objetos idénticas antes de modificar la vista.
3. **Separación de Intereses (TSX Limpio):**
    - El hook `useTranslation` debe inicializarse de forma limpia en la parte superior del componente o dentro de los custom hooks: `const { t } = useTranslation('');`.
    - No se deben incrustar manipulaciones de cadenas complejas, condicionales o concatenaciones en línea dentro del TSX. Si se necesita texto dinámico, se deben usar las funciones nativas de interpolación o pluralización del motor de traducción.
4. **Protección contra Discrepancias Regionales:**
    - Asegurar siempre que se respete la propiedad `load: 'languageOnly'` en la configuración central para que las variantes regionales (ej. `es-VE`, `es-US`, `en-US`) sean manejadas limpiamente por los diccionarios base `es` o `en`.

### 🗂️ Estructura y Jerarquía Global de los JSON (es.json / en.json)

Los archivos de traducción se organizarán de forma estrictamente plana en su raíz, bajo las siguientes directrices de nomenclatura y reutilización:

1. **Módulos de Pantalla / Componentes (Nivel Raíz):**
    - Cada pantalla o componente complejo se declarará en el primer nivel utilizando **PascalCase** (ej. `"LoginScreen"`, `"DashboardScreen"`).
    - Las llaves internas de texto plano directo (como `"title"`, `"subtitle"`) deben escribirse en **camelCase**.
2. **Módulo Global de Acciones Reutilizables (`Actions`):**
    - Al mismo nivel raíz de las pantallas, existirá un único objeto global llamado `"Actions"` (en **PascalCase**).
    - Este objeto agrupará todos los textos de llamados a la acción (CTA) reutilizables en la app, como etiquetas de botones (`"enter"`, `"cancel"`, `"save"`), enlaces o interacciones comunes, evitando la duplicación de código en los diccionarios.

#### 📝 Ejemplo de Estructura Requerida:

```json
{
    "Actions": {
        "enter": "Ingresar",
        "cancel": "Cancelar",
        "save": "Guardar"
    },
    "LoginScreen": {
        "title": "Daily FI",
        "subtitle": "P2P Financial Management"
    }
}
```

### 🗂️️ Estándares para Servicios API e Interfaz de Datos (Frontend)

Para mantener la capa de comunicación HTTP desacoplada y fuertemente tipada, la creación de servicios e interfaces debe seguir estrictamente estas reglas:

1. **Ubicación y Nomenclatura de Servicios:**
    - Todo servicio de integración HTTP/API debe guardarse exclusivamente en la ruta `src/services/`.
    - El nombre del archivo y del servicio debe estar escrito en **PascalCase**, compuesto por el nombre del dominio o módulo seguido obligatoriamente de la palabra `Service` (ej. `RegisterService.ts`, `DailyBalanceService.ts`).
    - _Ruta de ejemplo:_ `src/services/RegisterService.ts`

2. **Ubicación y Nomenclatura de Interfaces:**
    - Todas las interfaces, tipos de petición/respuesta y contratos de datos vinculados a un servicio deben guardarse exclusivamente en la ruta `src/interfaces/`.
    - El nombre del archivo debe corresponder exactamente al nombre del servicio seguido de la extensión `.interface.ts` (ej. `RegisterService.interface.ts`, `DailyBalanceService.interface.ts`).
    - Queda estrictamente prohibido definir interfaces de la API dentro del archivo del servicio o del componente TSX.
    - _Ruta de ejemplo:_ `src/interfaces/RegisterService.interface.ts`

3. **Inmutabilidad y Tipado Estricto:**
    - Toda función dentro del servicio debe retornar promesas con tipos explícitos importados desde su respectivo archivo `.interface.ts`. Prohibido el uso de `any` en parámetros o respuestas.
