-- Datos de ejemplo para la aplicación ASSISTRAVEL

-- Insertar corresponsales de ejemplo
INSERT INTO "Corresponsal" (nombre_corresponsalia, nombre_contacto, telefono, correo, pagina_web, direccion) VALUES
('Corresponsal ABC Legal', 'Juan Pérez', '+54-11-1234-5678', 'juan.perez@abclegal.com', 'https://www.abclegal.com', 'Av. Corrientes 1234, Buenos Aires, Argentina'),
('International Partners LLC', 'Maria Rodriguez', '+1-555-0123', 'maria.rodriguez@intpartners.com', 'https://www.intpartners.com', '123 Main St, New York, NY 10001, USA'),
('European Associates', 'Pierre Dubois', '+33-1-23-45-67-89', 'pierre.dubois@euroassoc.fr', 'https://www.euroassoc.fr', '15 Rue de Rivoli, 75001 Paris, France'),
('Global Assistance Co.', 'Carlos Silva', '+55-11-9999-8888', 'carlos.silva@globalassist.com.br', 'https://www.globalassist.com.br', 'Rua Augusta 1500, São Paulo, SP, Brasil'),
('Asia Pacific Partners', 'Yuki Tanaka', '+81-3-1234-5678', 'yuki.tanaka@asiapacific.jp', 'https://www.asiapacific.jp', '1-1-1 Shibuya, Tokyo 150-0002, Japan');

-- Insertar casos de ejemplo
INSERT INTO "Caso" (id_corresponsal, nro_caso_assistravel, nro_caso_corresponsal, fecha_inicio_caso, estado_caso_interno, estado_del_caso, im_informe_medico, observaciones) VALUES
(1, 'AT-2024-001', 'ABC-2024-001', '2024-01-15', 'Activo', 'On going', true, 'Caso de accidente de tránsito en Buenos Aires. Paciente en recuperación.'),
(2, 'AT-2024-002', 'IP-2024-005', '2024-01-20', 'Activo', 'Para Refacturar', false, 'Emergencia médica en Nueva York. Tratamiento finalizado.'),
(3, 'AT-2024-003', 'EA-2024-010', '2024-02-01', 'Cerrado', 'Refacturado', true, 'Asistencia médica en París. Caso cerrado exitosamente.'),
(1, 'AT-2024-004', 'ABC-2024-002', '2024-02-10', 'Activo', 'On going', false, 'Consulta médica de rutina en Buenos Aires.'),
(4, 'AT-2024-005', 'GA-2024-015', '2024-02-15', 'Pausado', 'No FEE', true, 'Caso complejo en São Paulo. Esperando documentación adicional.'),
(5, 'AT-2024-006', 'APP-2024-003', '2024-03-01', 'Activo', 'On going', true, 'Emergencia en Tokio. En proceso de evaluación.'),
(2, 'AT-2024-007', 'IP-2024-008', '2024-03-05', 'Cerrado', 'Refacturado', false, 'Asistencia dental de emergencia en Nueva York.'),
(3, 'AT-2024-008', 'EA-2024-012', '2024-03-10', 'Cancelado', 'No FEE', false, 'Caso cancelado por el cliente.'),
(4, 'AT-2024-009', 'GA-2024-018', '2024-03-15', 'Activo', 'Para Refacturar', true, 'Cirugía de emergencia en São Paulo.'),
(1, 'AT-2024-010', 'ABC-2024-003', '2024-03-20', 'Activo', 'On going', false, 'Consulta especializada en Buenos Aires.');

-- Insertar facturas de ejemplo
INSERT INTO "Factura" (id_caso, fee, costo_usd, costo_moneda_local, tiene_factura, fecha_emision, fecha_vto, fecha_pago, nro_de_factura, monto_agregado, observaciones_factura) VALUES
(1, 2500.00, 2000.00, 2100000.00, true, '2024-01-20', '2024-02-20', NULL, 'FACT-2024-001', 100.00, 'Factura por asistencia médica completa'),
(2, 1800.00, 1500.00, 1500.00, false, NULL, NULL, NULL, NULL, NULL, 'Pendiente de facturación'),
(3, 3200.00, 2800.00, 2600.00, true, '2024-02-05', '2024-03-05', '2024-02-28', 'FACT-2024-002', 200.00, 'Factura pagada - caso cerrado'),
(4, 800.00, 650.00, 685000.00, true, '2024-02-15', '2024-03-15', NULL, 'FACT-2024-003', 50.00, 'Consulta de rutina'),
(5, 0.00, 0.00, 0.00, false, NULL, NULL, NULL, NULL, NULL, 'Caso sin fee - documentación pendiente'),
(6, 4500.00, 4000.00, 540000.00, true, '2024-03-05', '2024-04-05', NULL, 'FACT-2024-004', 500.00, 'Emergencia compleja - factura pendiente de pago'),
(7, 1200.00, 1000.00, 1000.00, true, '2024-03-08', '2024-04-08', '2024-03-25', 'FACT-2024-005', 0.00, 'Asistencia dental - pagado'),
(8, 0.00, 0.00, 0.00, false, NULL, NULL, NULL, NULL, NULL, 'Caso cancelado - sin costos'),
(9, 5500.00, 4800.00, 4800.00, false, NULL, NULL, NULL, NULL, NULL, 'Cirugía mayor - pendiente de refacturación'),
(10, 1500.00, 1200.00, 1260000.00, true, '2024-03-25', '2024-04-25', NULL, 'FACT-2024-006', 150.00, 'Consulta especializada - en proceso');

-- Verificar que los datos se insertaron correctamente
SELECT 'Corresponsales insertados:' as info, COUNT(*) as total FROM "Corresponsal";
SELECT 'Casos insertados:' as info, COUNT(*) as total FROM "Caso";
SELECT 'Facturas insertadas:' as info, COUNT(*) as total FROM "Factura";