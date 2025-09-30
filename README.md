# ASSISTRAVEL - Sistema de Gestión de Casos

Una aplicación web moderna para la gestión de casos y corresponsales de ASSISTRAVEL, construida con Next.js, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- **Dashboard Intuitivo**: Vista general con métricas clave y gráficos informativos
- **Gestión de Casos**: CRUD completo para casos con validaciones y filtros
- **Gestión de Corresponsales**: Administración de información de corresponsales
- **Sistema de Facturación**: Manejo integral de facturas y costos
- **Reportes Avanzados**: Generación de reportes y exportación a CSV
- **Interfaz Responsiva**: Diseño adaptable para desktop y móvil
- **Modo Oscuro/Claro**: Soporte para temas personalizables
- **Notificaciones**: Sistema de notificaciones en tiempo real

## 💻 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes UI modernos y accesibles
- **React Hook Form** - Manejo eficiente de formularios
- **Zod** - Validación de esquemas TypeScript-first
- **Zustand** - Estado global simplificado
- **React Query** - Manejo de estado del servidor
- **Lucide React** - Íconos SVG optimizados

### Backend
- **Supabase** - Backend como servicio (BaaS)
- **PostgreSQL** - Base de datos relacional
- **Row Level Security** - Seguridad a nivel de fila

### Deployment
- **Vercel** - Plataforma de deployment optimizada para Next.js
- **GitHub** - Control de versiones y CI/CD

## 📊 Estructura de la Base de Datos

### Tablas Principales

1. **Corresponsal**
   - `id_corresponsal` (PK)
   - `nombre_corresponsalia`
   - `nombre_contacto`
   - `telefono`
   - `correo`
   - `pagina_web`
   - `direccion`

2. **Caso**
   - `id_caso` (PK)
   - `id_corresponsal` (FK)
   - `nro_caso_assistravel`
   - `nro_caso_corresponsal`
   - `fecha_inicio_caso`
   - `estado_caso_interno`
   - `estado_del_caso`
   - `im_informe_medico`
   - `observaciones`

3. **Factura**
   - `id_factura` (PK)
   - `id_caso` (FK)
   - `fee`
   - `costo_usd`
   - `costo_moneda_local`
   - `tiene_factura`
   - `fecha_emision`
   - `fecha_vto`
   - `fecha_pago`
   - `nro_de_factura`
   - `monto_agregado`
   - `observaciones_factura`

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Vercel (para deployment)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/assistravel-app.git
cd assistravel-app
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
```

### 4. Configurar base de datos en Supabase

1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script SQL en `database/schema.sql` en el SQL Editor
3. Opcionalmente, ejecutar `database/seed-data.sql` para datos de ejemplo
4. Configurar las políticas de seguridad según tus necesidades

### 5. Ejecutar en desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Deployment en Vercel

### 1. Conectar con GitHub
1. Sube el código a GitHub
2. Conecta tu repositorio a Vercel
3. Configura las variables de entorno en Vercel

### 2. Variables de entorno en Vercel
Configura las siguientes variables en el dashboard de Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Deploy automático
Vercel deployará automáticamente cuando hagas push a la rama principal.

## 📝 Estructura del Proyecto

```
assisttravel-app/
├── app/                          # App Router de Next.js
│   ├── (dashboard)/               # Grupo de rutas del dashboard
│   │   ├── casos/                 # Página de gestión de casos
│   │   ├── corresponsales/        # Página de gestión de corresponsales
│   │   ├── dashboard/             # Página del dashboard principal
│   │   ├── reportes/              # Página de reportes
│   │   ├── configuracion/         # Página de configuración
│   │   └── layout.tsx             # Layout del dashboard
│   ├── globals.css                # Estilos globales
│   ├── layout.tsx                 # Layout raíz
│   └── page.tsx                   # Página de inicio
├── components/                    # Componentes reutilizables
│   ├── dashboard/                 # Componentes del dashboard
│   ├── forms/                     # Formularios
│   ├── layout/                    # Componentes de layout
│   └── ui/                        # Componentes UI base
├── database/                      # Scripts de base de datos
│   ├── schema.sql                 # Esquema de la base de datos
│   ├── seed-data.sql              # Datos de ejemplo
│   └── queries.sql                # Consultas útiles
├── hooks/                         # Custom hooks
├── lib/                           # Utilidades
├── store/                         # Estado global (Zustand)
├── types/                         # Definiciones de TypeScript
└── utils/                         # Configuración de Supabase
```

## 🛠️ Funcionalidades Principales

### Dashboard
- Métricas en tiempo real
- Gráficos informativos
- Tabla de casos recientes
- Indicadores de rendimiento

### Gestión de Casos
- Crear, editar y eliminar casos
- Asignación de corresponsales
- Manejo de estados y fechas
- Gestión de informes médicos
- Sistema de facturación integrado

### Gestión de Corresponsales
- CRUD completo de corresponsales
- Información de contacto
- Estadísticas de casos por corresponsal
- Enlaces a sitios web

### Reportes
- Filtros por estado y fecha
- Exportación a CSV
- Métricas financieras
- Análisis de tendencias

## 🔒 Seguridad

- **Row Level Security (RLS)** en Supabase
- **Validación del lado del cliente y servidor** con Zod
- **Sanitización de datos** en formularios
- **Variables de entorno** para credenciales sensibles

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📧 Contacto

**ASSISTRAVEL Team**
- Email: admin@assistravel.com
- Website: [assistravel.com](https://assistravel.com)

## 🚀 Roadmap

- [ ] Sistema de autenticación con roles
- [ ] Notificaciones push
- [ ] API REST pública
- [ ] Integración con servicios de email
- [ ] Módulo de documentos
- [ ] Dashboard analítico avanzado
- [ ] Aplicación móvil