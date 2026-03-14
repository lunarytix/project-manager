# Diagrama de Arquitectura - Sistema de Administración de Proyectos

## Estructura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                      APLICACIÓN ANGULAR                            │
│                    Project Manager v1.0                            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────────┐ │
│  │  MÓDULO AUTH     │  │ MÓDULO DASHBOARD │  │  MÓDULO USUARIOS  │ │
│  ├──────────────────┤  ├──────────────────┤  ├───────────────────┤ │
│  │ • Login Page     │  │ • Dashboard Page │  │ • Container       │ │
│  │                  │  │                  │  │ • Listar          │ │
│  │                  │  │                  │  │ • Crear           │ │
│  │                  │  │                  │  │ • Editar          │ │
│  │                  │  │                  │  │ • Eliminar        │ │
│  └──────────────────┘  └──────────────────┘  └───────────────────┘ │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────────────────────────────┐ │
│  │  MÓDULO ROLES    │  │      MÓDULO MÓDULOS (Permisos)          │ │
│  ├──────────────────┤  ├──────────────────────────────────────────┤ │
│  │ • Listar Roles   │  │ • Container                              │ │
│  │ • Crear Rol      │  │ • Listar Módulos                         │ │
│  │ • Editar Rol     │  │ • Crear Módulo                           │ │
│  │ • Eliminar Rol   │  │ • Editar Módulo (con checkboxes roles)  │ │
│  │                  │  │ • Eliminar Módulo                        │ │
│  └──────────────────┘  └──────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CAPA DE SERVICIOS                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌────────────────┐  ┌─────────────────────┐ │
│  │ AuthService     │  │ UserService    │  │ ModuleService       │ │
│  ├─────────────────┤  ├────────────────┤  ├─────────────────────┤ │
│  │ • login()       │  │ • getAll()     │  │ • getAll()          │ │
│  │ • logout()      │  │ • getById()    │  │ • getById()         │ │
│  │ • getToken()    │  │ • create()     │  │ • create()          │ │
│  │ • getCurrentUser│  │ • update()     │  │ • update()          │ │
│  │ • isAuth()      │  │ • delete()     │  │ • delete()          │ │
│  │                 │  │ • getByRole()  │  │ • assignRoles()     │ │
│  └─────────────────┘  └────────────────┘  └─────────────────────┘ │
│                                                                     │
│  ┌────────────────────────┐      ┌──────────────────────────┐      │
│  │  RoleService           │      │  AuthInterceptor         │      │
│  ├────────────────────────┤      ├──────────────────────────┤      │
│  │ • getAll()             │      │ • Agregar Bearer Token   │      │
│  │ • getById()            │      │ • Manejo de Headers      │      │
│  │ • create()             │      │ • Autenticación HTTP     │      │
│  │ • update()             │      │                          │      │
│  │ • delete()             │      │                          │      │
│  │ • getDefaultRoles()    │      │                          │      │
│  └────────────────────────┘      └──────────────────────────┘      │
│                                                                     │
│  ┌────────────────────────┐      ┌──────────────────────────┐      │
│  │  AuthGuard             │      │  Modelos/Interfaces      │      │
│  ├────────────────────────┤      ├──────────────────────────┤      │
│  │ • canActivate()        │      │ • User                   │      │
│  │ • Proteger rutas       │      │ • Role                   │      │
│  │ • Redireccionar        │      │ • Module                 │      │
│  │ • Login verification   │      │ • AuthState              │      │
│  └────────────────────────┘      └──────────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND API (Node.js/Express)                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────────┐ │
│  │ Auth Controller  │  │ User Controller  │  │ Module Controller │ │
│  │                  │  │                  │  │                   │ │
│  │ POST /login      │  │ GET /users       │  │ GET /modules      │ │
│  │ POST /logout     │  │ POST /users      │  │ POST /modules     │ │
│  │ GET /profile     │  │ PUT /users/:id   │  │ PUT /modules/:id  │ │
│  │                  │  │ DELETE /users/:id│  │ DELETE /modules/:id
│  │                  │  │                  │  │ POST /:id/roles   │ │
│  └──────────────────┘  └──────────────────┘  └───────────────────┘ │
│                                                                     │
│  ┌──────────────────┐                                              │
│  │ Role Controller  │                                              │
│  │                  │                                              │
│  │ GET /roles       │                                              │
│  │ POST /roles      │                                              │
│  │ PUT /roles/:id   │                                              │
│  │ DELETE /roles/:id│                                              │
│  └──────────────────┘                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS (MongoDB/SQL)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Colecciones/Tablas:                                          │ │
│  │                                                              │ │
│  │ • Users (id, nombre, email, password, roleId, activo)      │ │
│  │ • Roles (id, nombre, descripcion, permisos, activo)        │ │
│  │ • Modules (id, nombre, descripcion, ruta, rolesPermitidos) │ │
│  │ • Projects (id, nombre, descripcion, categoría, ...)       │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Flujo de Autenticación y Autorización

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ 1. Ingresa credenciales
       ▼
   ┌────────────────────┐
   │  Login Component    │
   │                    │
   │ - Formulario       │
   │ - Validaciones     │
   └────────┬───────────┘
            │ 2. Llama AuthService.login()
            ▼
   ┌──────────────────────────┐
   │  AuthService             │
   │                          │
   │ - Envía POST /login      │
   │ - Guarda token en LS     │
   │ - Actualiza authState$   │
   └────────┬─────────────────┘
            │ 3. Backend valida credenciales
            ▼
   ┌──────────────────────────┐
   │  Backend API             │
   │                          │
   │ - Verifica email/pwd     │
   │ - Genera JWT Token       │
   │ - Retorna token + usuario│
   └────────┬─────────────────┘
            │ 4. Token guardado en localStorage
            ▼
   ┌──────────────────────────┐
   │  Redirección a Dashboard │
   │                          │
   │ - AuthGuard verifica     │
   │ - isAuthenticated() true │
   │ - Permite acceso         │
   └──────────────────────────┘
```

## Relaciones de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                      Relaciones                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  User  ──── belongs to ──→  Role                            │
│   │                                                          │
│   │ (1 usuario = 1 rol)                                     │
│   │                                                          │
│   └──→ Role ──── has many ──→ Modules                       │
│                                                              │
│         (1 rol puede ver múltiples módulos)                 │
│                                                              │
│  Module ──── has many ──→ Roles (rolesPermitidos)          │
│                                                              │
│         (1 módulo puede ser visto por múltiples roles)      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Componentes por Rol

```
┌─────────────────────────────────────────────────────────────┐
│                ADMIN                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✓ Dashboard                                               │
│  ✓ Usuarios (Ver, Crear, Editar, Eliminar)               │
│  ✓ Roles (Ver, Crear, Editar, Eliminar)                  │
│  ✓ Módulos (Ver, Crear, Editar, Eliminar, Permisos)     │
│  ✓ Gestionar visibilidad de módulos por rol              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              COLABORADOR                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✓ Dashboard (Limitado)                                    │
│  ✗ Usuarios (No acceso)                                    │
│  ✗ Roles (No acceso)                                       │
│  ✓ Módulos (Solo lectura, según sus permisos)            │
│  ✗ Gestionar permisos (No acceso)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Estructura de Carpetas Creada

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── models/
│   │   │   ├── auth.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── role.model.ts
│   │   │   └── module.model.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── user.service.ts
│   │       ├── module.service.ts
│   │       └── role.service.ts
│   │
│   └── features/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth-routing.module.ts
│       │   └── pages/
│       │       └── login/
│       │           ├── login.component.ts
│       │           ├── login.component.html
│       │           └── login.component.scss
│       │
│       ├── dashboard/
│       │   ├── dashboard.module.ts
│       │   ├── dashboard-routing.module.ts
│       │   └── pages/
│       │       └── dashboard/
│       │           ├── dashboard.component.ts
│       │           ├── dashboard.component.html
│       │           └── dashboard.component.scss
│       │
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users-routing.module.ts
│       │   ├── pages/
│       │   │   └── usuario-container/
│       │   │       ├── usuario-container.component.ts
│       │   │       ├── usuario-container.component.html
│       │   │       └── usuario-container.component.scss
│       │   └── components/
│       │       ├── listar-usuario/
│       │       ├── crear-usuario/
│       │       ├── editar-usuario/
│       │       └── eliminar-usuario/
│       │
│       ├── modules/
│       │   ├── modules.module.ts
│       │   ├── modules-routing.module.ts
│       │   ├── pages/
│       │   │   └── modulo-container/
│       │   │       ├── modulo-container.component.ts
│       │   │       ├── modulo-container.component.html
│       │   │       └── modulo-container.component.scss
│       │   └── components/
│       │       ├── listar-modulo/
│       │       ├── crear-modulo/
│       │       ├── editar-modulo/
│       │       └── eliminar-modulo/
│       │
│       └── roles/
│           ├── roles.module.ts
│           ├── roles-routing.module.ts
│           └── pages/
│               └── role-container/
│
```
