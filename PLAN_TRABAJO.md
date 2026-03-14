# Plan de Trabajo - Sistema de Administración de Proyectos

## FASE 1: CONFIGURACIÓN BASE ✓ COMPLETADA

### 1.1 Creación del Proyecto Angular
- [x] Crear proyecto con `ng new project-manager`
- [x] Configurar routing
- [x] Configurar SCSS como preprocesador de estilos

### 1.2 Creación de Módulos
- [x] Módulo Auth (Autenticación)
- [x] Módulo Dashboard
- [x] Módulo Users (Usuarios)
- [x] Módulo Modules (Módulos/Permisos)
- [x] Módulo Roles

### 1.3 Creación de Componentes
- [x] Login Component (Auth)
- [x] Dashboard Component
- [x] Usuario Container (Componente Padre)
  - [x] Listar Usuario
  - [x] Crear Usuario
  - [x] Editar Usuario
  - [x] Eliminar Usuario
- [x] Modulo Container (Componente Padre)
  - [x] Listar Módulo
  - [x] Crear Módulo
  - [x] Editar Módulo
  - [x] Eliminar Módulo

### 1.4 Creación de Servicios
- [x] AuthService (Autenticación y manejo de sesión)
- [x] UserService (CRUD de usuarios)
- [x] ModuleService (CRUD de módulos + asignación de roles)
- [x] RoleService (CRUD de roles)

### 1.5 Seguridad
- [x] AuthGuard (Proteger rutas)
- [x] AuthInterceptor (Agregar token Bearer a peticiones HTTP)

### 1.6 Modelos/Interfaces
- [x] User Model
- [x] Role Model
- [x] Module Model
- [x] Auth Model

---

## FASE 2: IMPLEMENTACIÓN DE COMPONENTES (PRÓXIMO PASO)

### 2.1 Componente de Login
**Ubicación:** `src/app/features/auth/pages/login/`

**Tareas:**
- [ ] Crear formulario reactivo (email, password)
- [ ] Validar campos
- [ ] Integrar AuthService
- [ ] Manejo de errores
- [ ] Redirección al Dashboard después del login
- [ ] Estilos responsivos

**Formulario:**
```
Email: [____________]
Password: [____________]
[Iniciar Sesión]
```

### 2.2 Componente Dashboard
**Ubicación:** `src/app/features/dashboard/pages/dashboard/`

**Tareas:**
- [ ] Mostrar información del usuario actual
- [ ] Mostrar módulos disponibles según el rol
- [ ] Mostrar estadísticas (usuarios, módulos, proyectos)
- [ ] Menú de navegación basado en permisos
- [ ] Opción de logout

**Contenido:**
- Bienvenida con nombre del usuario
- Cards con estadísticas
- Accesos rápidos a módulos
- Información de último acceso

### 2.3 Usuarios - Componente Padre
**Ubicación:** `src/app/features/users/pages/usuario-container/`

**Tareas:**
- [ ] Crear estructura padre con tabs o navbar
- [ ] Integrar componentes hijos
- [ ] Manejo de estado (formulario activo)
- [ ] Comunicación entre padre e hijos (Input/Output)

**Estructura:**
```
┌─ Usuarios ────────────────────────────┐
│ [Listar] [Crear] [Editar] [Eliminar] │
├───────────────────────────────────────┤
│                                       │
│  Componente activo se mostrará aquí   │
│                                       │
└───────────────────────────────────────┘
```

### 2.4 Listar Usuarios
**Ubicación:** `src/app/features/users/components/listar-usuario/`

**Tareas:**
- [ ] Consumir UserService.getAll()
- [ ] Mostrar tabla con columnas: ID, Nombre, Email, Rol, Acciones
- [ ] Botones: Editar, Eliminar
- [ ] Paginación (opcional)
- [ ] Búsqueda y filtros
- [ ] Cargando mientras se obtienen datos

**Tabla:**
```
| ID | Nombre | Email | Rol | Acciones |
|----+--------+-------+-----+----------|
| 1  | Juan   | juan@email.com | Admin | [Editar] [Eliminar] |
```

### 2.5 Crear Usuario
**Ubicación:** `src/app/features/users/components/crear-usuario/`

**Tareas:**
- [ ] Formulario reactivo con campos: Nombre, Email, Password, Rol
- [ ] Validaciones
- [ ] Consumir UserService.create()
- [ ] Manejo de errores
- [ ] Mensaje de éxito
- [ ] Limpiar formulario después de crear

**Formulario:**
```
Nombre: [____________]
Email: [____________]
Password: [____________]
Rol: [Seleccionar ▼]
[Crear Usuario]
```

### 2.6 Editar Usuario
**Ubicación:** `src/app/features/users/components/editar-usuario/`

**Tareas:**
- [ ] Formulario reactivo precargado con datos del usuario
- [ ] Campos editables: Nombre, Email, Rol, Estado (Activo/Inactivo)
- [ ] Consumir UserService.update()
- [ ] Validaciones
- [ ] Manejo de errores
- [ ] Mensaje de éxito

### 2.7 Eliminar Usuario
**Ubicación:** `src/app/features/users/components/eliminar-usuario/`

**Tareas:**
- [ ] Modal de confirmación
- [ ] Mostrar datos del usuario a eliminar
- [ ] Consumir UserService.delete()
- [ ] Manejo de errores
- [ ] Confirmación de eliminación

**Modal:**
```
¿Está seguro de eliminar a Juan?
[Cancelar] [Eliminar]
```

### 2.8 Módulos - Componente Padre
**Ubicación:** `src/app/features/modules/pages/modulo-container/`

**Tareas:**
- [ ] Estructura padre similar a usuarios
- [ ] Integrar componentes hijos
- [ ] Manejo de estado

### 2.9 Listar Módulos
**Ubicación:** `src/app/features/modules/components/listar-modulo/`

**Tareas:**
- [ ] Consumir ModuleService.getAll()
- [ ] Tabla con: ID, Nombre, Descripción, Roles Permitidos, Acciones
- [ ] Botones: Editar, Eliminar
- [ ] Mostrar checkboxes de roles permitidos (lectura)

### 2.10 Crear Módulo
**Ubicación:** `src/app/features/modules/components/crear-modulo/`

**Tareas:**
- [ ] Formulario: Nombre, Descripción, Icono, Ruta
- [ ] Checkboxes para seleccionar roles permitidos
- [ ] Consumir ModuleService.create()
- [ ] Validaciones

**Formulario:**
```
Nombre: [____________]
Descripción: [____________________________]
Icono: [____________]
Ruta: [____________]

Roles Permitidos:
☐ Admin
☐ Colaborador
☐ [Otros roles disponibles]

[Crear Módulo]
```

### 2.11 Editar Módulo
**Ubicación:** `src/app/features/modules/components/editar-modulo/`

**Tareas:**
- [ ] Precargir datos del módulo
- [ ] Campos editables
- [ ] Checkboxes de roles con valores precargados
- [ ] Consumir ModuleService.update()
- [ ] Opción para cambiar orden (orden del módulo en menú)

### 2.12 Eliminar Módulo
**Ubicación:** `src/app/features/modules/components/eliminar-modulo/`

**Tareas:**
- [ ] Modal de confirmación
- [ ] Mostrar módulo a eliminar
- [ ] Consumir ModuleService.delete()

---

## FASE 3: RUTAS Y NAVEGACIÓN

### 3.1 Configuración de Rutas
- [ ] Actualizar auth-routing.module.ts
- [ ] Actualizar dashboard-routing.module.ts
- [ ] Actualizar users-routing.module.ts
- [ ] Actualizar modules-routing.module.ts

**Estructura de Rutas:**
```
/auth/login              → Login Component
/dashboard              → Dashboard Component
/users                  → Usuario Container
  /users/list           → Listar Usuarios
  /users/create         → Crear Usuario
  /users/edit/:id       → Editar Usuario
/modules                → Modulo Container
  /modules/list         → Listar Módulos
  /modules/create       → Crear Módulo
  /modules/edit/:id     → Editar Módulo
```

### 3.2 Sidebar/Navbar
- [ ] Componente de navegación principal
- [ ] Mostrar módulos disponibles según rol del usuario
- [ ] Opción de logout
- [ ] Menú dinámico basado en permisos

---

## FASE 4: BACKEND (API REST - Node.js/Express)

### 4.1 Estructura del Backend
```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── module.controller.ts
│   │   └── role.controller.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── role.model.ts
│   │   └── module.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── module.routes.ts
│   │   └── role.routes.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── errorHandler.middleware.ts
│   ├── database/
│   │   └── connection.ts
│   └── server.ts
├── package.json
└── .env
```

### 4.2 Endpoints Backend

#### Auth
```
POST   /api/auth/login           - Iniciar sesión
POST   /api/auth/logout          - Cerrar sesión
GET    /api/auth/profile         - Obtener perfil actual
POST   /api/auth/register        - Registrar nuevo usuario (opcional)
```

#### Users
```
GET    /api/users                - Listar todos los usuarios
GET    /api/users/:id            - Obtener usuario por ID
POST   /api/users                - Crear usuario
PUT    /api/users/:id            - Actualizar usuario
DELETE /api/users/:id            - Eliminar usuario
GET    /api/users/role/:roleId   - Listar usuarios por rol
```

#### Modules
```
GET    /api/modules              - Listar todos los módulos
GET    /api/modules/:id          - Obtener módulo por ID
POST   /api/modules              - Crear módulo
PUT    /api/modules/:id          - Actualizar módulo
DELETE /api/modules/:id          - Eliminar módulo
GET    /api/modules/role/:roleId - Obtener módulos por rol
POST   /api/modules/:id/roles    - Asignar roles a módulo
```

#### Roles
```
GET    /api/roles                - Listar todos los roles
GET    /api/roles/:id            - Obtener rol por ID
POST   /api/roles                - Crear rol
PUT    /api/roles/:id            - Actualizar rol
DELETE /api/roles/:id            - Eliminar rol
GET    /api/roles/default        - Obtener roles por defecto
```

### 4.3 Autenticación
- [ ] JWT Token (JSON Web Token)
- [ ] Hash de contraseñas (bcrypt)
- [ ] Middleware de autenticación
- [ ] Refresh tokens (opcional)

### 4.4 Base de Datos
- [ ] Diseñar esquema de base de datos
- [ ] Crear modelos Mongoose (MongoDB) o Sequelize (SQL)
- [ ] Relaciones: User → Role, Module → Role[]
- [ ] Índices en campos clave

---

## FASE 5: TESTING Y VALIDACIÓN

### 5.1 Testing Frontend
- [ ] Tests unitarios de componentes
- [ ] Tests de servicios
- [ ] Tests de guards
- [ ] E2E testing

### 5.2 Testing Backend
- [ ] Tests de controladores
- [ ] Tests de rutas
- [ ] Tests de autenticación
- [ ] Tests de validación

---

## FASE 6: DESPLIEGUE

### 6.1 Frontend
- [ ] Build de producción: `ng build --configuration production`
- [ ] Despliegue en Netlify, Vercel o servidor propio

### 6.2 Backend
- [ ] Configurar variables de entorno (.env)
- [ ] Despliegue en Heroku, AWS, Azure o servidor propio

---

## Tabla de Dependencias

| Tarea | Depende de | Estado |
|-------|-----------|--------|
| Login Component | AuthService | ✓ Servicios listos |
| Dashboard | AuthService, AuthGuard | ✓ Servicios listos |
| Usuarios (Padre) | UserService | ✓ Servicios listos |
| Listar Usuarios | Usuarios (Padre), UserService | Pendiente |
| Crear Usuario | Usuarios (Padre), UserService, RoleService | Pendiente |
| Editar Usuario | Usuarios (Padre), UserService | Pendiente |
| Eliminar Usuario | Usuarios (Padre), UserService | Pendiente |
| Módulos (Padre) | ModuleService | ✓ Servicios listos |
| Listar Módulos | Módulos (Padre), ModuleService | Pendiente |
| Crear Módulo | Módulos (Padre), ModuleService, RoleService | Pendiente |
| Editar Módulo | Módulos (Padre), ModuleService, RoleService | Pendiente |
| Backend API | Diseño completado | Pendiente |

---

## Próximos Pasos Inmediatos

1. **Implementar Login Component** (FASE 2.1)
   - Crear formulario de login
   - Integrar con AuthService
   - Estilizar

2. **Implementar Dashboard** (FASE 2.2)
   - Panel principal
   - Mostrar información del usuario
   - Navegación basada en roles

3. **Implementar CRUD de Usuarios** (FASE 2.3 - 2.7)
   - Completar componente padre
   - Implementar cada componente hijo
   - Integrar con UserService

4. **Implementar CRUD de Módulos** (FASE 2.8 - 2.12)
   - Componente padre
   - Componentes hijos
   - Sistema de checkboxes para roles

5. **Crear Backend API** (FASE 4)
   - Estructura del servidor
   - Controladores y rutas
   - Autenticación JWT

---

## Notas Importantes

- **Seguridad:** Todas las rutas sensibles están protegidas con AuthGuard
- **Interceptor HTTP:** Todas las peticiones incluirán automáticamente el token Bearer
- **Roles:** Admin tiene acceso completo, Colaborador acceso limitado
- **LocalStorage:** Se usa para persistencia de sesión (token y datos usuario)
- **Componentes Reutilizables:** Los componentes CRUD son específicos pero pueden extrapolarse a otros módulos

---

## Tiempo Estimado

- **FASE 1:** ✓ Completada (Infrastructure setup)
- **FASE 2:** 3-4 días (Frontend implementation)
- **FASE 3:** 1 día (Routing)
- **FASE 4:** 3-4 días (Backend API)
- **FASE 5:** 1-2 días (Testing)
- **FASE 6:** 1 día (Deployment)

**Total:** ~10-12 días de desarrollo
