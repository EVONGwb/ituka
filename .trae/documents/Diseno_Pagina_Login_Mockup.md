# Diseño de página: Inicio de sesión (replicar mockup)

## Objetivo
Definir el diseño UI/UX para replicar **exactamente** la pantalla de login del mockup:
- Logo arriba
- Inputs: email y contraseña
- Botón principal
- Link secundario
- Divisor
- Botón “Continuar con Google”
- Footer
Sin animaciones (ni CSS transitions ni keyframes).

---

## Layout
- Enfoque desktop-first.
- Contenedor de página centrado vertical y horizontalmente.
- Layout principal con **Flexbox**:
  - Wrapper: `min-height: 100vh` (o equivalente), `display: flex`, `align-items: center`, `justify-content: center`.
  - Card: ancho fijo/limitado según mockup (recomendado: `max-width: 420–480px`), padding y radio idénticos al mockup.
- Espaciado: usar una escala consistente (p. ej. 8px base) y replicar márgenes internos/externos del mockup.

## Meta Information
- Title: `Iniciar sesión | ITUKA`
- Description: `Accede a tu cuenta ITUKA.`
- Open Graph:
  - `og:title`: `Iniciar sesión | ITUKA`
  - `og:description`: `Accede a tu cuenta ITUKA.`

## Global Styles (tokens sugeridos; valores exactos deben igualar el mockup)
- Fondo de página: neutro claro (p. ej. #F7F7F5) o el definido por el mockup.
- Card:
  - Fondo: blanco
  - Borde: 1px neutro suave
  - Sombra: suave (sin animación)
  - Radio: según mockup
- Tipografía:
  - Base: 14–16px
  - Títulos: 24–32px, peso 600–700
  - Labels: 12–14px, peso 500
- Botón primario:
  - Fondo: verde marca (según mockup)
  - Texto: blanco
  - Estados: default/hover/focus/disabled **sin transición** (cambio instantáneo)
- Inputs:
  - Altura y padding según mockup
  - Estado focus con outline/ring (instantáneo)
- Links:
  - Color de marca
  - Hover: subrayado instantáneo

## Page Structure
Patrón: “Centered auth card”. Estructura apilada (stack) dentro de la card.

## Secciones & Componentes

### 1) Logo (arriba)
- Ubicación: parte superior de la card, centrado.
- Recurso: logo de marca (si aplica, `frontend/src/assets/logo.png`).
- Reglas:
  - Mantener proporción.
  - Tamaño exacto y separación inferior según mockup.

### 2) Formulario de credenciales
- Componentes:
  - Label “Email”
  - Input email
  - Label “Contraseña”
  - Input password
- Reglas visuales:
  - Inputs de ancho completo.
  - Espaciado vertical idéntico al mockup.
- Estados:
  - Error: borde/ayuda de error bajo el campo o bloque superior (según mockup).
  - Disabled: estilo atenuado.

### 3) Botón principal
- Texto: según mockup (p. ej. “Iniciar sesión”).
- Ancho: full width.
- Estado loading:
  - Cambiar texto a estado de carga (p. ej. “Entrando…”) y deshabilitar.
  - No usar spinners animados; si se muestra indicador, debe ser estático.

### 4) Link secundario
- Ubicación: bajo el botón principal, alineado según mockup (centrado o alineado al texto).
- Texto: según mockup (p. ej. “¿No tienes cuenta? Regístrate”).
- Acción: navegar a `/register` (ruta existente).

### 5) Divisor
- Presentación típica:
  - Línea horizontal + texto centrado (p. ej. “o”) **si así lo define el mockup**.
  - Alternativa: doble línea con separación simétrica.
- Debe replicar grosor, color y márgenes del mockup.

### 6) Botón Google
- Texto: según mockup (p. ej. “Continuar con Google”).
- Estilo:
  - Botón secundario (fondo blanco o neutro), borde sutil.
  - Ícono de Google a la izquierda si aparece en mockup.
- Interacción:
  - Click inicia flujo OAuth Google (comportamiento definido por el producto).
  - Estados hover/focus/disabled sin transición.

### 7) Footer
- Ubicación: al final de la card o al final de la página (según mockup).
- Contenido: texto corto (legal/copyright/links) exactamente como en mockup.
- Estilo: tipografía secundaria, color neutro.

## Responsive behavior
- Desktop (>=1024px): card centrada con ancho fijo/limitado.
- Tablet/móvil: card ocupa casi todo el ancho con márgenes laterales; conservar jerarquía y espaciados.

## Restricción clave: Sin animaciones
- Prohibido: `transition`, `animation`, `keyframes`, efectos de fade/slide.
- Permitido: cambios instantáneos de color/borde/outline por estados (hover/focus/disabled).
