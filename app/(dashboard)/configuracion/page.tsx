"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Settings, User, Database, Bell, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ConfiguracionPage() {
  const [config, setConfig] = React.useState({
    // General settings
    nombreEmpresa: 'ASSISTRAVEL',
    emailContacto: 'admin@assistravel.com',
    timezone: 'America/Argentina/Buenos_Aires',
    idioma: 'es',
    
    // Notifications
    notificacionesCasos: true,
    notificacionesFacturas: true,
    notificacionesEmail: false,
    
    // Appearance
    tema: 'light',
    
    // Case settings
    diasVencimientoFactura: 30,
    monedaDefault: 'USD',
    
    // Backup settings
    backupAutomatico: true,
    frecuenciaBackup: 'diario'
  })
  
  const { toast } = useToast()

  const handleSave = () => {
    // Here you would save to your backend/localStorage
    toast({
      title: 'Configuración guardada',
      description: 'Las configuraciones han sido actualizadas exitosamente.',
    })
  }

  const handleReset = () => {
    if (confirm('¿Estás seguro de que deseas restablecer todas las configuraciones?')) {
      setConfig({
        nombreEmpresa: 'ASSISTRAVEL',
        emailContacto: 'admin@assistravel.com',
        timezone: 'America/Argentina/Buenos_Aires',
        idioma: 'es',
        notificacionesCasos: true,
        notificacionesFacturas: true,
        notificacionesEmail: false,
        tema: 'light',
        diasVencimientoFactura: 30,
        monedaDefault: 'USD',
        backupAutomatico: true,
        frecuenciaBackup: 'diario'
      })
      toast({
        title: 'Configuración restablecida',
        description: 'Todas las configuraciones han sido restablecidas a los valores por defecto.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra las configuraciones del sistema ASSISTRAVEL
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
              <Input
                id="nombreEmpresa"
                value={config.nombreEmpresa}
                onChange={(e) => setConfig({...config, nombreEmpresa: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailContacto">Email de Contacto</Label>
              <Input
                id="emailContacto"
                type="email"
                value={config.emailContacto}
                onChange={(e) => setConfig({...config, emailContacto: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zona Horaria</Label>
              <Select 
                value={config.timezone} 
                onValueChange={(value) => setConfig({...config, timezone: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Argentina/Buenos_Aires">Buenos Aires (UTC-3)</SelectItem>
                  <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid (UTC+1)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select 
                value={config.idioma} 
                onValueChange={(value) => setConfig({...config, idioma: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones de Casos</Label>
                <p className="text-sm text-muted-foreground">Recibir alertas sobre cambios en casos</p>
              </div>
              <Switch
                checked={config.notificacionesCasos}
                onCheckedChange={(checked) => setConfig({...config, notificacionesCasos: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones de Facturas</Label>
                <p className="text-sm text-muted-foreground">Alertas sobre vencimientos de facturas</p>
              </div>
              <Switch
                checked={config.notificacionesFacturas}
                onCheckedChange={(checked) => setConfig({...config, notificacionesFacturas: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">Enviar notificaciones por correo electrónico</p>
              </div>
              <Switch
                checked={config.notificacionesEmail}
                onCheckedChange={(checked) => setConfig({...config, notificacionesEmail: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-5 w-5" />
            Apariencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Tema</Label>
            <Select 
              value={config.tema} 
              onValueChange={(value) => setConfig({...config, tema: value})}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Case Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Gestión de Casos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diasVencimiento">Días para Vencimiento de Factura</Label>
              <Input
                id="diasVencimiento"
                type="number"
                value={config.diasVencimientoFactura}
                onChange={(e) => setConfig({...config, diasVencimientoFactura: parseInt(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Moneda por Defecto</Label>
              <Select 
                value={config.monedaDefault} 
                onValueChange={(value) => setConfig({...config, monedaDefault: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                  <SelectItem value="BRL">BRL - Real Brasileño</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Respaldo de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Respaldo Automático</Label>
              <p className="text-sm text-muted-foreground">Realizar respaldos automáticos de los datos</p>
            </div>
            <Switch
              checked={config.backupAutomatico}
              onCheckedChange={(checked) => setConfig({...config, backupAutomatico: checked})}
            />
          </div>
          
          {config.backupAutomatico && (
            <div className="space-y-2">
              <Label>Frecuencia de Respaldo</Label>
              <Select 
                value={config.frecuenciaBackup} 
                onValueChange={(value) => setConfig({...config, frecuenciaBackup: value})}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diario</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset}>
          Restablecer
        </Button>
        <Button onClick={handleSave}>
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}