-- Crear las tablas de la base de datos para ASSISTRAVEL

-- Tabla de Corresponsales
CREATE TABLE IF NOT EXISTS "Corresponsal" (
    id_corresponsal SERIAL PRIMARY KEY,
    nombre_corresponsalia VARCHAR(255) NOT NULL,
    nombre_contacto VARCHAR(255),
    telefono VARCHAR(50),
    correo VARCHAR(255),
    pagina_web VARCHAR(255),
    direccion VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Casos
CREATE TABLE IF NOT EXISTS "Caso" (
    id_caso SERIAL PRIMARY KEY,
    id_corresponsal INTEGER NOT NULL,
    nro_caso_assistravel VARCHAR(100) UNIQUE NOT NULL,
    nro_caso_corresponsal VARCHAR(100),
    fecha_inicio_caso DATE NOT NULL,
    estado_caso_interno VARCHAR(20) CHECK (estado_caso_interno IN ('Activo', 'Cerrado', 'Cancelado', 'Pausado')) NOT NULL,
    estado_del_caso VARCHAR(20) CHECK (estado_del_caso IN ('On going', 'No FEE', 'Para Refacturar', 'Refacturado')) NOT NULL,
    im_informe_medico BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (id_corresponsal) REFERENCES "Corresponsal"(id_corresponsal) ON DELETE RESTRICT
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS "Factura" (
    id_factura SERIAL PRIMARY KEY,
    id_caso INTEGER UNIQUE NOT NULL,
    fee DECIMAL(10, 2),
    costo_usd DECIMAL(10, 2),
    costo_moneda_local DECIMAL(10, 2),
    tiene_factura BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_emision DATE,
    fecha_vto DATE,
    fecha_pago DATE,
    nro_de_factura VARCHAR(100),
    monto_agregado DECIMAL(10, 2),
    observaciones_factura TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (id_caso) REFERENCES "Caso"(id_caso) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_caso_corresponsal ON "Caso"(id_corresponsal);
CREATE INDEX IF NOT EXISTS idx_caso_estado_interno ON "Caso"(estado_caso_interno);
CREATE INDEX IF NOT EXISTS idx_caso_estado_del_caso ON "Caso"(estado_del_caso);
CREATE INDEX IF NOT EXISTS idx_caso_fecha_inicio ON "Caso"(fecha_inicio_caso);
CREATE INDEX IF NOT EXISTS idx_factura_caso ON "Factura"(id_caso);
CREATE INDEX IF NOT EXISTS idx_factura_tiene_factura ON "Factura"(tiene_factura);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers a todas las tablas
DROP TRIGGER IF EXISTS update_corresponsal_updated_at ON "Corresponsal";
CREATE TRIGGER update_corresponsal_updated_at
    BEFORE UPDATE ON "Corresponsal"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_caso_updated_at ON "Caso";
CREATE TRIGGER update_caso_updated_at
    BEFORE UPDATE ON "Caso"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_factura_updated_at ON "Factura";
CREATE TRIGGER update_factura_updated_at
    BEFORE UPDATE ON "Factura"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security) para usar con Supabase Auth
ALTER TABLE "Corresponsal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Caso" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Factura" ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad básicas (permitir todo para usuarios autenticados)
CREATE POLICY "Users can view all corresponsales" ON "Corresponsal"
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert corresponsales" ON "Corresponsal"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update corresponsales" ON "Corresponsal"
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete corresponsales" ON "Corresponsal"
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all casos" ON "Caso"
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert casos" ON "Caso"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update casos" ON "Caso"
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete casos" ON "Caso"
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all facturas" ON "Factura"
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert facturas" ON "Factura"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update facturas" ON "Factura"
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete facturas" ON "Factura"
    FOR DELETE USING (auth.role() = 'authenticated');