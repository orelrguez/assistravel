-- Consultas útiles para reportes y análisis

-- 1. Resumen general de casos por estado
SELECT 
    estado_caso_interno,
    COUNT(*) as total_casos,
    AVG(f.fee) as fee_promedio,
    SUM(f.costo_usd) as costo_total_usd
FROM "Caso" c
LEFT JOIN "Factura" f ON c.id_caso = f.id_caso
GROUP BY estado_caso_interno
ORDER BY total_casos DESC;

-- 2. Corresponsales con mayor volumen de casos
SELECT 
    cor.nombre_corresponsalia,
    COUNT(c.id_caso) as total_casos,
    COUNT(CASE WHEN c.estado_caso_interno = 'Activo' THEN 1 END) as casos_activos,
    SUM(CASE WHEN f.tiene_factura THEN f.fee ELSE 0 END) as fee_total
FROM "Corresponsal" cor
LEFT JOIN "Caso" c ON cor.id_corresponsal = c.id_corresponsal
LEFT JOIN "Factura" f ON c.id_caso = f.id_caso
GROUP BY cor.id_corresponsal, cor.nombre_corresponsalia
ORDER BY total_casos DESC;

-- 3. Casos pendientes de facturación
SELECT 
    c.nro_caso_assistravel,
    cor.nombre_corresponsalia,
    c.fecha_inicio_caso,
    c.estado_del_caso,
    f.tiene_factura
FROM "Caso" c
JOIN "Corresponsal" cor ON c.id_corresponsal = cor.id_corresponsal
LEFT JOIN "Factura" f ON c.id_caso = f.id_caso
WHERE (f.tiene_factura = false OR f.tiene_factura IS NULL)
    AND c.estado_caso_interno = 'Activo'
ORDER BY c.fecha_inicio_caso;

-- 4. Facturas vencidas sin pagar
SELECT 
    c.nro_caso_assistravel,
    cor.nombre_corresponsalia,
    f.nro_de_factura,
    f.fecha_vto,
    f.fee,
    CURRENT_DATE - f.fecha_vto as dias_vencidos
FROM "Factura" f
JOIN "Caso" c ON f.id_caso = c.id_caso
JOIN "Corresponsal" cor ON c.id_corresponsal = cor.id_corresponsal
WHERE f.tiene_factura = true 
    AND f.fecha_pago IS NULL 
    AND f.fecha_vto < CURRENT_DATE
ORDER BY dias_vencidos DESC;

-- 5. Resumen financiero mensual
SELECT 
    DATE_TRUNC('month', c.fecha_inicio_caso) as mes,
    COUNT(c.id_caso) as casos_iniciados,
    SUM(f.fee) as fee_total,
    SUM(f.costo_usd) as costo_total_usd,
    COUNT(CASE WHEN f.fecha_pago IS NOT NULL THEN 1 END) as facturas_pagadas
FROM "Caso" c
LEFT JOIN "Factura" f ON c.id_caso = f.id_caso
WHERE c.fecha_inicio_caso >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', c.fecha_inicio_caso)
ORDER BY mes DESC;

-- 6. Casos con informe médico por corresponsal
SELECT 
    cor.nombre_corresponsalia,
    COUNT(CASE WHEN c.im_informe_medico = true THEN 1 END) as casos_con_informe,
    COUNT(c.id_caso) as total_casos,
    ROUND(
        COUNT(CASE WHEN c.im_informe_medico = true THEN 1 END) * 100.0 / COUNT(c.id_caso), 
        2
    ) as porcentaje_con_informe
FROM "Corresponsal" cor
LEFT JOIN "Caso" c ON cor.id_corresponsal = c.id_corresponsal
GROUP BY cor.id_corresponsal, cor.nombre_corresponsalia
HAVING COUNT(c.id_caso) > 0
ORDER BY porcentaje_con_informe DESC;

-- 7. Vista para dashboard principal
CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT 
    (
        SELECT COUNT(*) 
        FROM "Caso" 
        WHERE estado_caso_interno = 'Activo'
    ) as casos_activos,
    (
        SELECT COUNT(*) 
        FROM "Caso" c
        LEFT JOIN "Factura" f ON c.id_caso = f.id_caso
        WHERE (f.tiene_factura = false OR f.tiene_factura IS NULL) 
            OR c.estado_del_caso = 'Para Refacturar'
    ) as casos_pendientes_facturar,
    (
        SELECT COALESCE(SUM(f.fee), 0)
        FROM "Factura" f
        JOIN "Caso" c ON f.id_caso = c.id_caso
        WHERE f.tiene_factura = false OR f.fecha_pago IS NULL
    ) as fee_total_pendiente,
    (
        SELECT COALESCE(SUM(f.costo_usd), 0)
        FROM "Factura" f
        JOIN "Caso" c ON f.id_caso = c.id_caso
        WHERE c.estado_caso_interno = 'Activo'
    ) as costo_usd_total_estimado,
    (
        SELECT COUNT(*)
        FROM "Corresponsal"
    ) as total_corresponsales,
    (
        SELECT COUNT(DISTINCT c.id_corresponsal)
        FROM "Caso" c
        WHERE c.estado_caso_interno = 'Activo'
    ) as corresponsales_con_casos_activos;

-- 8. Función para obtener estadísticas de un corresponsal
CREATE OR REPLACE FUNCTION get_corresponsal_stats(corresponsal_id INTEGER)
RETURNS TABLE(
    total_casos INTEGER,
    casos_activos INTEGER,
    casos_cerrados INTEGER,
    fee_total DECIMAL,
    fee_pagado DECIMAL,
    fee_pendiente DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(c.id_caso)::INTEGER as total_casos,
        COUNT(CASE WHEN c.estado_caso_interno = 'Activo' THEN 1 END)::INTEGER as casos_activos,
        COUNT(CASE WHEN c.estado_caso_interno = 'Cerrado' THEN 1 END)::INTEGER as casos_cerrados,
        COALESCE(SUM(f.fee), 0) as fee_total,
        COALESCE(SUM(CASE WHEN f.fecha_pago IS NOT NULL THEN f.fee ELSE 0 END), 0) as fee_pagado,
        COALESCE(SUM(CASE WHEN f.fecha_pago IS NULL AND f.tiene_factura = true THEN f.fee ELSE 0 END), 0) as fee_pendiente
    FROM "Caso" c
    LEFT JOIN "Factura" f ON c.id_caso = f.id_caso
    WHERE c.id_corresponsal = corresponsal_id;
END;
$$ LANGUAGE plpgsql;