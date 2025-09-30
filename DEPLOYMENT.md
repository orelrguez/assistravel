# Guía de Deployment para ASSISTRAVEL

Esta guía te ayudará a deployar la aplicación ASSISTRAVEL en Vercel con Supabase como backend.

## 📋 Prerequisitos

1. **Cuenta de GitHub** - Para alojar el código fuente
2. **Cuenta de Supabase** - Para la base de datos y backend
3. **Cuenta de Vercel** - Para el deployment del frontend

## 🗄️ Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crear un nuevo proyecto:
   - Nombre: `assistravel-app`
   - Región: Selecciona la más cercana a tus usuarios
   - Base de datos: Crea una contraseña segura

### 2. Configurar la base de datos

1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Ejecuta el contenido del archivo `database/schema.sql`
3. Opcionalmente, ejecuta `database/seed-data.sql` para datos de ejemplo

### 3. Obtener credenciales

En **Settings > API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `Project API keys > anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `Project API keys > service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 🚀 Deployment en Vercel

### 1. Subir código a GitHub

```bash
# Inicializar repositorio (si no está hecho)
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: ASSISTRAVEL app"

# Crear repositorio en GitHub y agregar remote
git remote add origin https://github.com/tu-usuario/assistravel-app.git

# Subir código
git push -u origin main
```

### 2. Conectar Vercel con GitHub

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Click en **"New Project"**
4. Importa tu repositorio de GitHub
5. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next
   - **Install Command**: `npm install`

### 3. Configurar variables de entorno en Vercel

En la configuración del proyecto de Vercel, agrega estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 4. Deploy

1. Click en **"Deploy"**
2. Espera que termine el proceso de build
3. Una vez completado, tendrás tu URL de producción

## 🔧 Configuración adicional

### 1. Configurar dominio personalizado (Opcional)

1. En Vercel, ve a **Settings > Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

### 2. Configurar redirects (si es necesario)

Crea un archivo `vercel.json` en la raíz con:

```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/dashboard",
      "permanent": false
    }
  ]
}
```

## 🔄 Actualizaciones automáticas

Con esta configuración:
- Cada push a `main` desplegará automáticamente
- Cada pull request creará un preview deployment
- Los logs están disponibles en el dashboard de Vercel

## 🛠️ Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Iniciar en modo producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📊 Monitoreo y Analytics

### Vercel Analytics
1. Ve a tu proyecto en Vercel
2. Navega a **Analytics**
3. Habilita Vercel Analytics para métricas de rendimiento

### Supabase Monitoring
1. En tu proyecto de Supabase
2. Ve a **Reports** para ver métricas de la base de datos

## 🐛 Solución de problemas

### Error de build en Vercel
```bash
# Verificar build localmente
npm run build

# Verificar tipos TypeScript
npm run type-check
```

### Error de conexión a Supabase
1. Verificar que las variables de entorno estén configuradas correctamente
2. Confirmar que las políticas RLS permitan las operaciones necesarias
3. Revisar los logs en Supabase

### Error 404 en rutas
- Verificar que el archivo `next.config.js` esté configurado correctamente
- Confirmar que las rutas existan en la estructura `app/`

## 📈 Escalabilidad

### Base de datos
- Supabase escala automáticamente
- Considera crear índices adicionales para consultas frecuentes
- Monitorea el uso de la base de datos en el dashboard

### Frontend
- Vercel escala automáticamente
- Considera usar Vercel Edge Functions para lógica adicional
- Implementa caché estratégico para mejorar rendimiento

## 🔐 Seguridad

### Variables de entorno
- Nunca commits archivos `.env` con datos reales
- Usa variables de entorno específicas para cada ambiente
- Rota las claves periódicamente

### Supabase
- Revisa las políticas RLS regularmente
- Activa autenticación cuando sea necesario
- Monitorea accesos inusuales

## 📞 Soporte

Si encuentras problemas:

1. **Vercel**: [vercel.com/support](https://vercel.com/support)
2. **Supabase**: [supabase.com/docs](https://supabase.com/docs)
3. **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

## ✅ Checklist de deployment

- [ ] Código subido a GitHub
- [ ] Proyecto creado en Supabase
- [ ] Base de datos configurada con schema.sql
- [ ] Variables de entorno configuradas en Vercel
- [ ] Proyecto importado en Vercel
- [ ] Deploy exitoso
- [ ] Funcionalidad básica probada
- [ ] Dominio personalizado configurado (opcional)
- [ ] Analytics habilitado (opcional)

¡Tu aplicación ASSISTRAVEL debería estar funcionando en producción!