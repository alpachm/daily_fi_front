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
- **Separación de Conceptos:** La lógica de negocio, cálculos de capital, hooks de manejo de estado y peticiones HTTP a la API **nunca** deben vivir directamente dentro del TSX. Extráelos siempre a Custom Hooks independientes (ej. `useBalanceDiario.ts`).
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
- **Estilos:** No se utilizarán librerías externas como Tailwind ni nada similar, todos los estilos se basarán en CSS puro manteniendo las mejores prácticas. Los archivos CSS correspondientes a las Screens se almacenarán en la carpeta `src/styles` con el mismo nombre del archivo `.tsx` al que correspondan. Los archivos CSS de los componentes se almacenarán en la carpeta `src/components/styles` con el mismo nombre del componente al que corresponden.

---

## 4. Estándares del Backend (Node.js + TypeScript)

- **Arquitectura Limpia:** Divide el servidor siguiendo el patrón de capas: Rutas $\rightarrow$ Controladores $\rightarrow$ Servicios/Modelos. El controlador solo gestiona la petición y la respuesta; la lógica financiera y la comunicación con Supabase se aíslan en los servicios a través del cliente oficial (`@supabase/supabase-js`).
- **Validación de Datos:** Toda petición entrante (`req.body`, `req.query`, `req.params`) que contenga datos numéricos (como capital inicial/final) debe ser estrictamente validada en el backend antes de operar, utilizando esquemas de **Zod**.
- **Manejo de Errores Rígido:** Envuelve todas las operaciones asíncronas en bloques `try/catch`. Centraliza las respuestas de error a través de un middleware personalizado. Nunca expongas stack traces crudos del servidor al frontend.

---

## 5. Reglas de Interacción y Formato de Respuesta de la IA

- **Código Primero:** Proporciona soluciones de código directas, limpias y listas para producción. Reduce las explicaciones teóricas al mínimo necesario.
- **Rutas de Archivos Claras:** Añade siempre un comentario con la ruta exacta del archivo al principio de cada bloque de código (ej. `// src/components/Dashboard.tsx`).
- **Scripts Completos:** No utilices marcadores de posición perezosos como `// ... resto del código aquí ...` a menos que sea una edición menor explícitamente solicitada. Proporciona las estructuras completas para evitar errores de copia.

---

## 6. Reglas de Internacionalización (i18n)

Para mantener una arquitectura multiidioma altamente escalable y prevenir errores en tiempo de compilación, el Agente de IA debe cumplir estrictamente con las siguientes reglas:

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
