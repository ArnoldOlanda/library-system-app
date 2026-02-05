# Módulo de Roles y Permisos

## Descripción
Módulo completo para la gestión de roles y permisos del sistema. Permite crear, editar y eliminar roles, así como asignar o remover permisos de manera visual e intuitiva.

## Estructura de Archivos

```
modules/Roles/
├── interfaces/
│   └── index.ts                    # Interfaces TypeScript
├── services/
│   ├── roles.service.ts            # Servicio de API para roles
│   └── permissions.service.ts      # Servicio de API para permisos
├── hooks/
│   ├── useRoles.ts                 # Custom hooks para roles
│   └── usePermissions.ts           # Custom hooks para permisos
├── components/
│   ├── RoleForm.tsx                # Formulario de rol con validación Zod
│   ├── RoleDialog.tsx              # Dialog para crear/editar rol
│   ├── RolesTable.tsx              # Tabla de roles con acciones
│   └── PermissionsAssignDialog.tsx # Dialog para gestionar permisos
└── pages/
    └── Roles.tsx                   # Página principal
```

## Características

### ✅ CRUD de Roles
- Crear nuevo rol con nombre y descripción
- Editar roles existentes
- Eliminar roles (con confirmación)
- Validación con Zod

### ✅ Gestión de Permisos
- Ver todos los permisos del sistema agrupados por entidad
- Asignar múltiples permisos a un rol
- Remover permisos de un rol
- Contador de permisos seleccionados
- Vista organizada por categorías (user, role, producto, etc.)

### ✅ Control de Acceso (RBAC)
- Botón "Nuevo Rol" protegido con `create:role`
- Botón "Editar" protegido con `update:role`
- Botón "Eliminar" protegido con `delete:role`
- Botón "Gestionar Permisos" protegido con `update:role`

### ✅ UI/UX
- Tabla responsiva con información clara
- Diálogos modales para formularios
- Confirmación antes de eliminar
- Notificaciones toast de éxito/error
- Indicador de carga en operaciones asíncronas
- ScrollArea para lista de permisos
- Checkboxes para selección múltiple
- Badge con contador de permisos

## Endpoints Utilizados

### Roles
- `GET /roles` - Listar todos los roles
- `GET /roles/:id` - Obtener un rol por ID
- `POST /roles` - Crear un nuevo rol
- `PATCH /roles/:id` - Actualizar un rol
- `DELETE /roles/:id` - Eliminar un rol

### Permisos de Roles
- `GET /roles/:id/permissions` - Obtener permisos de un rol
- `POST /roles/:id/permissions` - Asignar permisos a un rol
- `DELETE /roles/:id/permissions` - Remover permisos de un rol

### Permisos
- `GET /permissions` - Listar todos los permisos

## Uso

### Crear un Rol
1. Click en "Nuevo Rol"
2. Ingresar nombre y descripción
3. Click en "Guardar"

### Asignar Permisos
1. Click en botón de escudo (Shield) en la fila del rol
2. Seleccionar/deseleccionar permisos usando checkboxes
3. Click en "Guardar Cambios"

### Editar un Rol
1. Click en botón de lápiz (Pencil)
2. Modificar nombre o descripción
3. Click en "Guardar"

### Eliminar un Rol
1. Click en botón de basura (Trash)
2. Confirmar la eliminación

## Dependencias
- TanStack Query (React Query)
- React Hook Form
- Zod (validación)
- Radix UI (componentes primitivos)
- Lucide React (iconos)
- shadcn/ui (componentes UI)

## Permisos Requeridos
- `create:role` - Crear roles
- `read:role` - Ver roles
- `update:role` - Editar roles y gestionar permisos
- `delete:role` - Eliminar roles
