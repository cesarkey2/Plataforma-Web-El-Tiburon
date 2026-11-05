# CAPÍTULO 3 — DESARROLLO DE LA SOLUCIÓN

> **Documento de trabajo académico — Curso Integrador II: Sistemas**  
> **Proyecto:** Plataforma web para la Cevichería El Tiburón  
> **Integrantes:** Alanya Lopez, Aldo Lenny (U22222392) y Sosa Llave, Edson Giancarlo (U22231229)  
> **Estado:** Borrador técnico del segundo entregable; debe complementarse con las capturas, actas y datos exactos del Sprint 4 del equipo.

## Introducción del capítulo

El presente capítulo describe el análisis, diseño e implementación inicial de la solución tecnológica propuesta para la Cevichería El Tiburón. La solución responde al problema identificado en los capítulos anteriores: el negocio atiende principalmente de forma presencial y no cuenta con un canal digital propio que centralice el catálogo, facilite el registro de pedidos y permita administrar la información operativa.

Para este avance se decidió **reutilizar y adaptar el prototipo existente en Figma denominado “MacBook Pro 16 - Inicio”**, en lugar de crear una interfaz nueva. Esta decisión permite conservar la identidad visual ya validada para el negocio y dedicar el esfuerzo del Sprint 4 a convertir el prototipo en una plataforma funcional. La pantalla de inicio conserva el encabezado, la sección hero, el bloque Nosotros, el catálogo visual, las reseñas, el formulario de contacto y el pie de página. Sobre esa base se agregaron los flujos del MVP: catálogo navegable, detalle de producto, carrito, confirmación de pedidos, seguimiento, autenticación, Libro de Reclamaciones y panel administrativo.

La implementación se encuentra en el proyecto `/home/ubuntu/eltiburon` y utiliza React, Vite, Express, tRPC, Drizzle ORM y una base de datos MySQL administrada. En el documento se diferencia la funcionalidad **implementada y verificada** de la funcionalidad **parcial o pendiente de completar**, evitando presentar como terminadas aquellas actividades que todavía requieren evidencia del equipo.

---

## 3.1 ANÁLISIS DEL SISTEMA

### 3.1.1 Situación problemática y alcance del MVP

La Cevichería El Tiburón necesita un canal digital complementario a la atención presencial. El sistema propuesto permite mostrar los platos marinos, registrar pedidos y ordenar la gestión interna de productos, promociones, pedidos y reclamos.

El MVP comprende:

- Página de inicio responsiva basada en el diseño de Figma.
- Catálogo de productos con nombre, descripción, precio, imagen y disponibilidad.
- Detalle individual de cada producto.
- Carrito con incremento, reducción y eliminación de productos.
- Registro de pedidos con modalidad de delivery o recojo en local.
- Generación de código de pedido y estado inicial “Pendiente”.
- Consulta pública del pedido mediante código.
- Inicio de sesión y registro mediante el flujo seguro de autenticación de la plataforma.
- Libro de Reclamaciones.
- Formulario de contacto.
- Panel administrativo protegido por autenticación y rol.
- Gestión inicial de productos, promociones y estados de pedidos.

No forman parte de este MVP una aplicación móvil nativa, una pasarela de pagos real, la integración con empresas externas de delivery, un módulo avanzado de inventario o compras a proveedores, ni una auditoría operativa avanzada.

### 3.1.2 Actores del sistema

| Actor | Responsabilidad principal |
|---|---|
| Cliente | Consultar productos, gestionar el carrito, registrar pedidos, consultar su estado, autenticarse y presentar reclamos. |
| Administrador | Gestionar productos, promociones, pedidos y, en la siguiente iteración, la bandeja completa de reclamos y mensajes. |
| Personal de atención/cocina | Participar en la preparación y actualización del estado de los pedidos mediante el flujo administrativo. |
| Sistema | Validar datos, calcular importes, registrar información, autenticar usuarios y controlar permisos. |

### 3.1.3 Relación entre objetivos y solución

| Objetivo del proyecto | Respuesta de la solución |
|---|---|
| Incrementar la visibilidad del negocio | Página de inicio con identidad visual, catálogo y datos de contacto. |
| Reducir errores en la toma de pedidos | Carrito estructurado, validaciones y registro de cabecera y detalle del pedido. |
| Mejorar la atención al cliente | Confirmación con código, consulta de estado, contacto y Libro de Reclamaciones. |
| Apoyar la administración | Panel protegido para catálogo, promociones y estados de pedidos. |

### 3.1.4 Decisión de reutilización del diseño de Figma

El diseño de Figma se utiliza como **base visual y de experiencia**, no como un elemento decorativo aislado. El código exportado se transfirió al proyecto mediante `setup-figma.py`, se conservaron los recursos gráficos locales y se reemplazaron las rutas de imágenes para que no dependan de URLs externas. A partir de la pantalla inicial se desarrollaron componentes semánticos y responsivos que convierten los botones, enlaces y formularios en interacciones reales.

La decisión es coherente con el alcance porque la pantalla inicial ya contiene los elementos principales de comunicación del negocio. Crear un diseño completamente nuevo habría duplicado trabajo sin resolver los flujos faltantes del sistema.

---

## 3.1.1 REQUISITOS FUNCIONALES

| Código | Requisito funcional | Actor | Prioridad | Criterio de aceptación | Estado en este avance |
|---|---|---|---|---|---|
| RF-01 | Consultar catálogo | Cliente | Alta | Se muestran productos activos con nombre, descripción, precio, imagen y disponibilidad. | Implementado y verificado |
| RF-02 | Consultar detalle de producto | Cliente | Alta | El cliente puede abrir un producto y consultar su información ampliada. | Implementado |
| RF-03 | Gestionar carrito | Cliente | Alta | Se pueden agregar productos, modificar cantidades, eliminar productos y visualizar el total. | Implementado y verificado |
| RF-04 | Registrar pedido | Cliente | Alta | El sistema valida datos y registra cabecera y detalles en la base de datos. | Implementado en backend y flujo |
| RF-05 | Confirmar pedido | Cliente | Alta | Se muestra un código de pedido y el estado inicial “Pendiente”. | Implementado |
| RF-06 | Consultar estado del pedido | Cliente | Media | El cliente ingresa un código y visualiza el estado del pedido. | Implementado mediante `/estado-pedido` |
| RF-07 | Registrarse | Cliente | Media | El usuario puede crear una cuenta mediante el flujo de autenticación habilitado. | Implementado mediante autenticación de plataforma |
| RF-08 | Iniciar y cerrar sesión | Cliente/Administrador | Alta | El sistema permite iniciar y cerrar una sesión. | Implementado |
| RF-09 | Gestionar productos | Administrador | Alta | El administrador puede consultar y registrar productos; edición y activación avanzada quedan para el siguiente incremento. | Parcial funcional |
| RF-10 | Gestionar promociones | Administrador | Alta | El administrador puede registrar y consultar promociones desde el panel. | Parcial funcional |
| RF-11 | Gestionar pedidos | Administrador | Alta | El administrador consulta pedidos y actualiza sus estados. | Implementado |
| RF-12 | Gestionar reclamos | Administrador | Media | El sistema guarda reclamos y el backend permite consultarlos y actualizar su estado. La bandeja visual completa queda pendiente. | Parcial funcional |
| RF-13 | Registrar reclamo | Cliente | Media | El formulario valida y registra la información del Libro de Reclamaciones. | Implementado |
| RF-14 | Enviar mensaje de contacto | Cliente | Baja | El formulario valida y registra los mensajes recibidos. | Implementado |
| RF-15 | Controlar acceso administrativo | Sistema/Administrador | Alta | Solo un usuario autenticado con rol `admin` puede utilizar los procedimientos administrativos. | Implementado y verificado por código |

### Reglas de negocio principales

1. Un pedido debe contener por lo menos un producto.
2. La cantidad de cada producto debe ser un entero positivo.
3. El precio unitario se obtiene del catálogo persistido y se conserva en el detalle del pedido.
4. La modalidad `delivery` requiere una dirección; la modalidad `pickup` corresponde al recojo en local.
5. Todo pedido nuevo comienza en estado `pending`.
6. Los estados operativos disponibles son `pending`, `confirmed`, `preparing`, `ready`, `delivered` y `cancelled`.
7. Solo los usuarios con rol `admin` pueden acceder a los procedimientos del panel.
8. Los reclamos se registran con estado inicial `registered`.

---

## 3.1.2 REQUISITOS NO FUNCIONALES

| Código | Categoría | Requisito verificable |
|---|---|---|
| RNF-01 | Usabilidad | La interfaz debe permitir consultar el menú y avanzar al pedido sin instrucciones externas. |
| RNF-02 | Adaptabilidad | La interfaz debe ajustarse a computadora, tablet y celular. |
| RNF-03 | Rendimiento | Las páginas públicas deben mostrar el contenido sin bloqueos visibles y las consultas deben tener estados de carga. |
| RNF-04 | Seguridad | Las operaciones administrativas deben requerir autenticación y autorización por rol. |
| RNF-05 | Integridad | No se registra un pedido sin productos, cantidades positivas y datos obligatorios. |
| RNF-06 | Validación | Los formularios se validan en el cliente y los procedimientos se validan nuevamente en el servidor con Zod. |
| RNF-07 | Mantenibilidad | El código se organiza por páginas, componentes, contexto del carrito, routers, esquema y migraciones. |
| RNF-08 | Disponibilidad | El backend expone `/api/health` y la aplicación devuelve una respuesta de salud `200`. |
| RNF-09 | Compatibilidad | Se emplean tecnologías web estándar y diseño responsive para navegadores modernos. |
| RNF-10 | Trazabilidad | Pedidos, reclamos, promociones y productos conservan fechas de creación y actualización. |
| RNF-11 | Protección de datos | Las credenciales y variables sensibles permanecen fuera del código del frontend. |
| RNF-12 | Accesibilidad básica | Las imágenes relevantes tienen texto alternativo, los campos tienen etiquetas y se mantienen estados de foco visibles. |

---

## 3.2 DISEÑO DEL SISTEMA

### 3.2.1 Arquitectura propuesta

La solución utiliza una arquitectura cliente-servidor organizada en capas:

- **Presentación:** React, Vite, Wouter, componentes reutilizables y estilos responsive.
- **Aplicación:** Express y procedimientos tRPC para exponer operaciones tipadas.
- **Persistencia:** Drizzle ORM y MySQL administrado.
- **Identidad y seguridad:** sesión de autenticación, usuario, rol y procedimientos `adminProcedure`.
- **Recursos estáticos:** imágenes y SVG exportados desde Figma dentro de `client/public/figma`.

El navegador consume la aplicación React. Las operaciones de negocio se envían a `/api/trpc`; el servidor valida los datos, aplica reglas de acceso y consulta la base de datos mediante Drizzle.

### 3.2.2 CASOS DE USO

#### Catálogo de casos de uso

| Código | Caso de uso | Actor principal | Requisitos relacionados |
|---|---|---|---|
| CU-01 | Consultar catálogo | Cliente | RF-01 |
| CU-02 | Consultar detalle de producto | Cliente | RF-02 |
| CU-03 | Gestionar carrito | Cliente | RF-03 |
| CU-04 | Registrar y confirmar pedido | Cliente | RF-04, RF-05 |
| CU-05 | Consultar estado de pedido | Cliente | RF-06 |
| CU-06 | Registrarse, iniciar y cerrar sesión | Cliente | RF-07, RF-08 |
| CU-07 | Gestionar productos | Administrador | RF-09 |
| CU-08 | Gestionar promociones | Administrador | RF-10 |
| CU-09 | Consultar y actualizar pedidos | Administrador | RF-11 |
| CU-10 | Registrar reclamo | Cliente | RF-13 |
| CU-11 | Consultar reclamos | Administrador | RF-12 |
| CU-12 | Enviar mensaje de contacto | Cliente | RF-14 |
| CU-13 | Autorizar acceso administrativo | Sistema | RF-15 |

El diagrama horizontal correspondiente se encuentra en `docs/diagrama-casos-uso.png` y su fuente editable de referencia se conserva en `docs/diagrama-casos-uso.dot`.

#### CU-04 — Registrar y confirmar pedido

- **Actor:** Cliente.
- **Precondiciones:** el cliente tiene por lo menos un producto en el carrito; los productos están disponibles.
- **Flujo principal:**
  1. El cliente revisa el carrito y selecciona “Continuar pedido”.
  2. El sistema muestra el formulario de datos de atención.
  3. El cliente selecciona delivery o recojo en local.
  4. El sistema solicita dirección cuando la modalidad es delivery.
  5. El cliente confirma el pedido.
  6. El servidor valida los datos y consulta los precios persistidos.
  7. El servidor calcula subtotal y total, crea la cabecera y crea los detalles.
  8. El sistema devuelve el código y el estado `pending`.
- **Flujos alternativos:** datos incompletos, dirección faltante en delivery, producto no disponible o base de datos no disponible.
- **Postcondición:** el pedido queda almacenado con sus detalles y puede consultarse mediante su código.

#### CU-09 — Consultar y actualizar pedidos

- **Actor:** Administrador.
- **Precondición:** usuario autenticado con rol `admin`.
- **Flujo principal:** el administrador ingresa al panel, revisa los pedidos y actualiza el estado según la operación de cocina y atención.
- **Estados:** Pendiente → Confirmado → En preparación → Listo → Entregado. También se permite Cancelado cuando corresponda.
- **Postcondición:** el estado actualizado se almacena y queda disponible para la consulta del cliente.

#### CU-10 — Registrar reclamo

- **Actor:** Cliente.
- **Precondición:** contar con los datos obligatorios del reclamante.
- **Flujo principal:** el cliente completa nombres, documento, correo, teléfono, tipo y descripción; el sistema valida y registra el reclamo con estado `registered`.

---

### 3.2.3 DISEÑO DE CLASES

Las principales clases conceptuales del dominio son:

| Clase | Atributos principales | Responsabilidad |
|---|---|---|
| Usuario | id, openId, nombre, correo, rol, fechas | Representar la identidad y permisos. |
| Producto | id, nombre, descripción, precio, imagen, disponibilidad | Representar un plato del catálogo. |
| Promoción | id, nombre, descripción, tipo, valor, vigencia, estado | Representar una oferta administrable. |
| Pedido | id, código, usuario, cliente, modalidad, dirección, subtotal, total, estado | Representar la cabecera de una compra. |
| DetallePedido | id, pedido, producto, nombre histórico, cantidad, precio unitario, subtotal | Conservar el contenido del pedido. |
| Reclamo | id, usuario, datos del reclamante, tipo, descripción, estado | Registrar una queja o reclamo. |
| MensajeContacto | id, nombre, apellido, correo, mensaje, estado | Registrar solicitudes de contacto. |
| Sesión | identidad, cookie, vigencia | Mantener la autenticación del usuario. |

Relaciones:

- Un `Usuario` puede tener muchos `Pedido` y muchos `Reclamo`.
- Un `Pedido` contiene uno o varios `DetallePedido`.
- Un `Producto` puede aparecer en muchos `DetallePedido`.
- Un `DetallePedido` pertenece a un solo `Pedido` y referencia un `Producto`.
- Las promociones se administran como una entidad independiente para mantener vigencia y estado.

El diagrama de clases se encuentra en `docs/diagrama-clases.mmd`.

---

### 3.2.4 DISEÑO DE LA BASE DE DATOS

El modelo persistente está compuesto por las siguientes tablas:

| Tabla | Campos relevantes | Propósito |
|---|---|---|
| `users` | id, openId, name, email, role, createdAt, updatedAt | Usuarios y roles de autenticación. |
| `products` | id, name, description, price, imageUrl, isAvailable | Catálogo de platos. |
| `promotions` | id, name, description, type, value, startDate, endDate, isActive | Promociones y vigencia. |
| `orders` | id, code, userId, datos del cliente, attentionType, subtotal, total, status | Cabecera del pedido. |
| `order_items` | id, orderId, productId, productName, quantity, unitPrice, subtotal | Detalles y precio histórico. |
| `claims` | id, userId, fullName, email, phone, documentNumber, claimType, description, status | Libro de Reclamaciones. |
| `contact_messages` | id, name, lastName, email, message, status | Mensajes del formulario de contacto. |

El diseño incorpora claves primarias, índices por disponibilidad, estado y código de pedido, además de referencias entre `users`, `orders`, `order_items`, `products` y `claims`. Se utiliza `order_items.unitPrice` para conservar el precio con el que se registró cada pedido, incluso si el precio del catálogo cambia posteriormente.

La fuente del esquema se encuentra en `drizzle/schema.ts`, las relaciones conceptuales en `drizzle/relations.ts` y la migración inicial en `drizzle/0001_handy_switch.sql`. El diagrama entidad-relación se encuentra en `docs/diagrama-base-datos.mmd`.

---

### 3.2.5 CÓDIGO FUENTE

El código fuente se organizó por responsabilidades:

```text
client/src/
├── components/       # encabezado, pie de página, tarjetas y componentes UI
├── contexts/         # estado global del carrito
├── data/             # datos de respaldo para el catálogo
├── pages/            # Inicio, productos, carrito, checkout, login, reclamos, admin
├── lib/              # cliente tRPC
└── App.tsx           # rutas principales

drizzle/
├── schema.ts         # tablas y restricciones del modelo
├── relations.ts      # relaciones del dominio
└── 0001_handy_switch.sql

server/
├── routers.ts        # procedimientos tRPC del negocio
├── db.ts             # conexión y acceso a MySQL
└── _core/            # sesión, autenticación, contexto y servidor Express
```

#### Componente de tarjeta de producto

Archivo: `client/src/components/ProductCard.tsx`.

```tsx
<button className="buy-button" onClick={() => addItem(product)}>
  <ShoppingCart size={14} /> Comprar
</button>
```

El componente recibe un producto, muestra su imagen y precio, y usa `CartContext` para actualizar el carrito sin duplicar lógica entre páginas.

#### Gestión del carrito

Archivo: `client/src/contexts/CartContext.tsx`.

```tsx
const totalItems = items.reduce(
  (total, item) => total + item.quantity,
  0,
);

const subtotal = items.reduce(
  (total, item) => total + Number(item.price) * item.quantity,
  0,
);
```

El estado se conserva en `localStorage` para que el cliente pueda navegar entre páginas sin perder su selección. El total definitivo del pedido no se confía al navegador: el servidor vuelve a consultar los precios persistidos.

#### Registro del pedido

Archivo: `server/routers.ts`, procedimiento `orders.create`.

El procedimiento valida el objeto recibido con Zod, verifica que cada producto exista y esté disponible, calcula los importes en el servidor, registra la tabla `orders`, registra `order_items` y devuelve el código generado. Esta separación evita que el precio enviado desde el navegador sea la única fuente de verdad.

#### Validación y autorización

Archivos: `server/routers.ts` y `server/_core/trpc.ts`.

```ts
export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    if (!opts.ctx.user || opts.ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return opts.next({ ctx: { ...opts.ctx, user: opts.ctx.user } });
  }),
);
```

Las funciones administrativas usan `adminProcedure`. Además, los formularios del cliente aplican validaciones de usabilidad y el servidor aplica los esquemas Zod antes de procesar cualquier operación.

#### Verificación realizada

- `pnpm check`: ejecutado sin errores de TypeScript.
- `pnpm build`: ejecutado correctamente para frontend y backend.
- `GET /api/health`: respondió `200` con `{ "status": "ok" }`.
- `GET /manus-routes.json`: respondió `200` con el manifiesto de rutas.
- El catálogo persistido fue sembrado con 8 productos iniciales.
- Se revisaron visualmente las pantallas de inicio, productos, carrito y Libro de Reclamaciones en el preview.

---

### 3.2.5 Diseño de controles de seguridad

| Control | Aplicación |
|---|---|
| Autenticación | El acceso se realiza mediante el flujo de autenticación habilitado por la plataforma. |
| Autorización | `adminProcedure` verifica que exista un usuario y que su rol sea `admin`. |
| Contraseñas | No se almacenan contraseñas propias en la aplicación; la identidad se delega al proveedor de autenticación. |
| Validación de entrada | Zod valida productos, pedidos, reclamos, promociones y mensajes en el servidor. |
| Consultas seguras | Drizzle ORM genera consultas parametrizadas y evita concatenar SQL proveniente del usuario. |
| Cookies de sesión | El proyecto utiliza cookies de sesión configuradas para el preview HTTPS y el flujo de autenticación. |
| Protección de secretos | Las variables sensibles se administran en el entorno del servidor y no se incluyen en el frontend. |
| Control de acceso directo | La protección se aplica en el procedimiento tRPC, no solamente en la visibilidad de botones. |
| Integridad de pedidos | El servidor valida productos disponibles, cantidades positivas y recalcula el total. |
| Manejo de errores | El usuario recibe mensajes generales; los detalles técnicos no se muestran como datos de negocio. |
| Trazabilidad | Pedidos, reclamos, promociones y productos mantienen fechas de creación y actualización. |
| Recursos locales | Las imágenes del diseño se guardan localmente en el proyecto y no se cargan desde URLs externas. |

Controles pendientes para una versión posterior: recuperación avanzada de cuenta, auditoría detallada de cambios, límites de intentos, monitoreo especializado, políticas de retención y conexión con un proveedor de pagos.

---

## 3.3 GESTIÓN AGIL

La gestión del desarrollo se mantiene bajo el marco Scrum utilizado en los avances anteriores. La información de fechas exactas, responsables por historia y resultados de pruebas con usuarios debe completarse con el acta o tablero oficial del equipo. En esta versión se documenta el incremento técnico que sí cuenta con evidencia en el proyecto.

### 3.3.1 Sprint 4 - Retrospectiva

| Aspecto | Resultado del Sprint 4 | Acción de mejora | Responsable |
|---|---|---|---|
| Qué salió bien | Se reutilizó el diseño de Figma, se trasladaron los assets a rutas locales y se implementó una interfaz responsive con los principales bloques de la página de inicio. | Mantener una guía visual con colores, tipografías y espaciados para las nuevas pantallas. | Equipo de desarrollo |
| Qué salió bien | Se integraron React, Express, tRPC, Drizzle y MySQL; el catálogo fue persistido y se verificó el endpoint de salud. | Agregar pruebas automatizadas para crear pedidos y cambiar estados. | Equipo backend |
| Qué salió bien | Se implementaron carrito, checkout, reclamos, contacto y estados de pedidos. | Completar la bandeja visual de reclamos y la edición avanzada del catálogo. | Equipo frontend |
| Qué se puede mejorar | La pantalla inicial de Figma tenía posiciones absolutas y fue necesario convertirla en una estructura responsive. | Revisar cada breakpoint con una captura de referencia antes de cerrar el sprint. | Equipo frontend |
| Qué se puede mejorar | La autenticación depende del proveedor habilitado por la plantilla, por lo que debe documentarse claramente en la exposición. | Validar con el docente si se requiere una pantalla local de correo/contraseña o si se acepta el flujo provisto. | Equipo / docente |
| Qué se puede mejorar | Aún faltan evidencias formales de pruebas de usabilidad y acta de Sprint 4. | Realizar una validación breve con usuarios y adjuntar capturas, comentarios y fecha. | Equipo de producto |

**Datos por completar por el equipo:** fechas de inicio y cierre del Sprint 4, duración, nombres de responsables de cada historia, incidencias registradas y métrica de cumplimiento del sprint.

### 3.3.2 Sprint 4 - Review

| Incremento presentado | Resultado | Estado | Evidencia disponible |
|---|---|---|---|
| Inicio basado en Figma | Hero, Nosotros, productos, reseñas, contacto y footer responsivos. | Completado para MVP | Preview y assets locales de `client/public/figma`. |
| Catálogo | 8 productos persistidos, con imagen, precio y detalle. | Completado | Consulta tRPC, base de datos y pantalla `/productos`. |
| Carrito y pedido | Agregar, cambiar cantidades, eliminar y confirmar pedido. | Completado | Pantallas `/carrito` y `/checkout`; procedimiento `orders.create`. |
| Seguimiento | Consulta por código y avance de estados. | Completado | Pantalla `/estado-pedido` y procedimiento `orders.byCode`. |
| Autenticación | Inicio, registro y cierre mediante el flujo habilitado. | Completado con proveedor | Pantallas `/login`, `/registro` y `useAuth`. |
| Panel administrativo | Protección por rol, productos, promociones y estados de pedidos. | Funcional inicial | `/admin`, `adminProcedure`, routers administrativos. |
| Libro de Reclamaciones | Registro de reclamos con validación. | Completado para MVP | Pantalla `/reclamaciones`, tabla `claims`. |
| Contacto | Registro de mensajes del formulario. | Completado para MVP | Formulario `Home.tsx`, tabla `contact_messages`. |
| Pruebas de usabilidad | Retroalimentación estructurada de usuarios. | Pendiente | Se debe agregar acta, capturas o comentarios reales del equipo. |

La review debe presentarse con capturas del preview, el flujo de pedido, el control de acceso al panel y la respuesta del endpoint de salud. No se deben inventar resultados de usuarios ni métricas que todavía no hayan sido recogidos.

### 3.3.3 Despliegue MVP

#### Entorno y tecnologías

- Frontend: React + Vite + TypeScript.
- Backend: Express + tRPC.
- Persistencia: MySQL administrado + Drizzle ORM.
- Autenticación: flujo de autenticación de la plataforma, con usuario y rol.
- Recursos visuales: assets locales exportados desde Figma.
- Puerto de preview: `3000`.

#### Preparación y verificación

1. Se generó y aplicó la migración con `pnpm db:push` / `pnpm db:migrate`.
2. Se sembró el catálogo inicial con 8 productos mediante `scripts/seed.ts`.
3. Se inició el servidor con `pnpm dev`.
4. `GET /api/health` respondió correctamente con estado `ok`.
5. `GET /manus-routes.json` respondió con las rutas declaradas.
6. `pnpm check` terminó sin errores.
7. `pnpm build` terminó correctamente.
8. Se verificaron visualmente inicio, productos, carrito y reclamos en el navegador.

#### Repositorio y checkpoint

El avance fue sincronizado al repositorio canónico en el commit:

```text
c72708aa7fafce01df6e82c9661c0d918fb796ba
```

#### URL y alcance del despliegue

La evidencia disponible corresponde al **Preview HTTPS del proyecto**, no a una publicación productiva independiente:

<https://3000-imaay8umxr710gy7g4h8b-61894dbc.us1.manus.computer/>

Por tanto, en el entregable se debe escribir “MVP desplegado en entorno Preview” y no “sistema publicado en producción”, salvo que posteriormente el equipo realice y verifique la publicación productiva.

#### Funcionalidades incluidas

- Inicio visual basado en Figma.
- Productos y detalle.
- Carrito y checkout.
- Consulta de estado.
- Autenticación.
- Reclamos y contacto.
- Panel administrativo inicial.
- Base de datos y migraciones.
- Controles de seguridad básicos.

#### Limitaciones y trabajo futuro

- Completar la bandeja visual de reclamos y mensajes para el administrador.
- Implementar edición y activación/desactivación desde el panel.
- Confirmar y documentar las pruebas de usabilidad con usuarios reales.
- Confirmar los datos definitivos de precios, horarios y contacto con el dueño.
- Integrar pasarela de pagos y/o delivery externo si el alcance final lo exige.
- Realizar publicación productiva cuando el equipo y el docente validen el MVP.

---

## Conclusión del capítulo

El desarrollo de la solución permitió transformar el prototipo visual de Figma en una plataforma web responsive con un núcleo funcional de pedidos y administración. El sistema ya cuenta con catálogo persistido, carrito, registro de pedidos, seguimiento, autenticación, reclamos, contacto y controles básicos de seguridad. La implementación también deja una base extensible para completar las operaciones administrativas y las evidencias formales del Sprint 4.

La siguiente actividad académica es complementar este borrador con el diagrama renderizado, capturas del sistema, acta o tablero de Sprint 4, resultados de validación con usuarios y los datos definitivos solicitados por el docente.
