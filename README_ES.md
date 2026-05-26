# Combo UI Editor

<img src="https://vida.guillermovalentin.es/combo/comboui.svg" width="128" height="128" alt="Combo UI" align="right" />

Un editor visual de sistemas de diseño que te permite crear, personalizar y sincronizar temas de componentes UI en tiempo real entre tus aplicaciones Vue, React, Angular y Vanilla JS.

**[Descargar el Editor](https://github.com/masweb/combo-ui-editor/releases/)** 

---

## Cómo Funciona

1. **Diseña** — Abre el editor de escritorio y configura visualmente tus componentes: colores, tipografía, bordes, sombras y más.
2. **Instala** — Añade el paquete combo-ui para tu framework como dependencia npm.
3. **Construye** — Crea las páginas de tu app usando las clases CSS de combo-ui. Los componentes se renderizan con los estilos de tu tema automáticamente.
4. **Sincroniza** — Edita tu tema en vivo mientras observas los cambios en tu propia app en tiempo real.
5. **Publica** — Cuando tu tema esté listo, exporta el JSON y inclúyelo en tu app.

---

## Características

### Generador de Temas

Añade pares de colores claro/oscuro y genera automáticamente un tema completo con variantes consistentes en todos los componentes. Elige tipografía, radio de borde y sombras externas/internas para todos los componentes de una sola vez.

### Vista Previa en Vivo

Conecta el editor a cualquier app que ejecute combo-ui-vue, combo-ui-react o combo-ui-angular mediante WebSocket. Activa la edición en vivo y ve el resultado de tus cambios directamente en la app cliente — sin recargar la página.

```
Editor (App de escritorio Tauri 2)
  │  Hooks de Dexie → buildThemeData() con debounce → WebSocket
  ▼
theme-sync-server (puerto 3001)
  │  Almacena el tema actual, retransmite a todos los clientes conectados
  ├──► Vue runtime — ComboUIPlugin → regenerar CSS
  └──► Vanilla runtime — ComboUX → regenerar CSS
```

Los cambios aplican un debounce de 300ms, con `broadcastImmediate()` disponible para ajustes de color en tiempo real que omiten el debounce.

### Modo Oscuro Integrado

Cada tema incluye soporte para modo oscuro listo para usar. Los paquetes incluyen un componente `ThemeToggler` personalizable compatible con las convenciones de modo oscuro de VueUse y Tailwind.

### Multi-Framework

| Paquete | Framework | Estado |
|---------|-----------|--------|
| combo-ui-vue | Vue 3 | Disponible |
| combo-ux-vanilla | Vanilla JS | Planificado |
| combo-ui-react | React | Planificado |
| combo-ui-angular | Angular | Planificado |

Todos los paquetes consumen el mismo JSON de tema, por lo que puedes compartir diseños en toda tu pila tecnológica.

### Variantes Ilimitadas

Crea temas con un número ilimitado de variantes por componente. El editor está diseñado para mantener un bajo consumo de memoria — solo carga las variantes del componente que estás editando activamente, no todos a la vez.

### Control de Tipografía

Gestiona fuentes, tamaños, pesos e interlineados globalmente desde el panel de Tipografía, o sobrescríbelos por componente y por formulario. Las Google Fonts se cargan automáticamente desde los datos del tema.

### Persistencia con Auto-Guardado

Todos los cambios se guardan automáticamente en IndexedDB mediante Dexie. Nunca pierdas tu trabajo — cierra el editor y continúa en cualquier momento.

### BASSCSS y Reset

Todos los temas incluyen clases utilitarias [BASSCSS](https://basscss.com/) para el diseño rápido de plantillas, además de un reset CSS para un renderizado consistente entre navegadores.

---

## Componentes Soportados

| Componente | Editor | Generación CSS | Componente Vue |
|------------|--------|----------------|----------------|
| Typography | Sí | Sí | — |
| Forms | Sí | Sí | — |
| Button | Sí | Sí | — |
| Card | Sí | Sí | — |
| Alert | Sí | Sí | — |
| Avatar | Sí | Sí | — |
| Progress | Sí | Sí | — |
| Spinner | Sí | Sí | Sí |
| Badge | Sí | Sí | — |
| Chip | Sí | Sí | — |
| Tooltip | Sí | Sí | Sí |
| Popover | Sí | Sí | Sí |
| Table | Sí | Sí | — |
| ListGroup | Sí | Sí | — |
| Accordion | Sí | Sí | — |
| Pagination | Sí | Sí | — |

Los componentes con renderizado solo CSS usan clases como `cui-button.--primary`. Los componentes marcados con "Sí" en Componente Vue también tienen un componente Vue dinámico para estructura HTML dependiente de la variante o comportamiento JavaScript.

---

## Estructura JSON del Tema

El editor exporta un JSON plano con el siguiente esquema:

```typescript
{
  name: string
  version: string                          // "1.0"
  typography?: {
    globalConfig: TypographyGlobalConfig
    variants: TypographyVariant[]
    selectedVariantIndex: number
  }
  forms?: {
    globalConfig: FormsGlobalConfig
    variants: FormsVariant[]
    selectedVariantIndex: number
    currentState?: string
  }
  buttons?: { variants: ButtonVariant[]; selectedVariantIndex: number }
  cards?: { ... }
  alerts?: { ... }
  spinners?: { ... }
  // ... una clave por componente
}
```

---

## Generación de CSS

Cada paquete sigue el mismo proceso de generación de CSS:

1. `ComboUI.init()` carga el tema desde URL, objeto o archivo
2. Para cada componente con variantes:
   - Cargar Google Fonts desde los datos de la variante
   - Llamar a `generate[Component]CSS(variants, globalConfig)`
   - Inyectar el CSS combinado en `<style id="cui-styles">`

El CSS usa propiedades personalizadas para la tematización:

- **Clase base** `.cui-component` declara propiedades personalizadas `--cui-*`
- **Clase de variante** `.cui-component.--variant-name` sobrescribe esas propiedades
- **Modo oscuro** `body[color-scheme="dark"] .cui-component.--variant-name`

Orden de inyección: Reset → Estilos base → Basscss → CSS de componentes

---

## Descarga

[Última Versión](https://github.com/masweb/combo-ui-editor/releases/)

Disponible para macOS como aplicación de escritorio Tauri 2.
