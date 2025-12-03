-- Limpiar tablas en orden inverso (por foreign keys)
TRUNCATE conversiones, usuario_vendedor, usuario_comprador, interesado, citas, contrato, propiedad, categoria_persona, categoria, personas, usuarios, rol RESTART IDENTITY CASCADE;

INSERT INTO rol (nombre_rol) VALUES ('Administrador');
INSERT INTO rol (nombre_rol) VALUES ('Asesor');

-- Usuarios: 1 administrador y 2 asesores
INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombres, apellidos,supervisor_id, id_rol)
VALUES ('admin1', 'pass123', 'admin1@email.com', 'Admin', 'Uno', NULL,1);

INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombres, apellidos, supervisor_id, id_rol)
VALUES ('asesor1', 'pass123', 'asesor1@email.com', 'Asesor', 'Uno', 1, 2);

INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombres, apellidos, supervisor_id, id_rol)
VALUES ('asesor2', 'pass123', 'asesor2@email.com', 'Asesor', 'Dos', 1, 2);

-- Leads (10)
INSERT INTO personas (nombre, celular, tipo, fecha_captacion) VALUES
('Persona1', '932000001', 'Lead Alvas', '2025-12-01'),
('Persona2', '932000002', 'Lead Alvas', '2025-12-01'),
('Persona3', '932000003', 'Lead Propio', '2025-12-01'),
('Persona4', '932000004', 'Lead Propio', '2025-12-01'),
('Persona5', '932000005', 'Lead Alvas', '2025-12-01'),
('Persona6', '932000006', 'Lead Propio', '2025-12-01'),
('Persona7', '932000007', 'Lead Alvas', '2025-12-01'),
('Persona8', '932000008', 'Lead Propio', '2025-12-01'),
('Persona9', '932000009', 'Lead Alvas', '2025-12-01'),
('Persona10', '932000010', 'Lead Propio', '2025-12-01');

-- Clientes (15)
INSERT INTO personas (nombre, celular, tipo, fecha_captacion) VALUES
('Persona11', '933000001', 'Cliente', '2025-11-15'),
('Persona12', '933000002', 'Cliente', '2025-11-16'),
('Persona13', '933000003', 'Cliente', '2025-11-17'),
('Persona14', '933000004', 'Cliente', '2025-11-18'),
('Persona15', '933000005', 'Cliente', '2025-11-19'),
('Persona16', '933000006', 'Cliente', '2025-11-20'),
('Persona17', '933000007', 'Cliente', '2025-11-21'),
('Persona18', '933000008', 'Cliente', '2025-11-22'),
('Persona19', '933000009', 'Cliente', '2025-11-23'),
('Persona20', '933000010', 'Cliente', '2025-11-24'),
('Persona21', '933000011', 'Cliente', '2025-11-25'),
('Persona22', '933000012', 'Cliente', '2025-11-26'),
('Persona23', '933000013', 'Cliente', '2025-11-27'),
('Persona24', '933000014', 'Cliente', '2025-11-28'),
('Persona25', '933000015', 'Cliente', '2025-11-29');

INSERT INTO personas (nombre, celular, tipo, fecha_captacion) VALUES
('Persona26', '934000001', 'Referido', '2025-12-01'),
('Persona27', '934000002', 'Referido', '2025-12-02'),
('Persona28', '934000003', 'Referido', '2025-12-02'),
('Persona29', '934000004', 'Referido', '2025-12-03'),
('Persona30', '934000005', 'Referido', '2025-12-03');

INSERT INTO categoria (nombre_categoria) VALUES
('Vendedor'),
('Comprador');

INSERT INTO categoria_persona (id_persona, id_categoria) VALUES
(11, 1),  -- Persona11 -> Vendedor (Cliente)
(12, 1),  -- Persona12 -> Vendedor (Cliente)
(13, 1),  -- Persona13 -> Vendedor (Cliente)
(14, 1),  -- Persona14 -> Vendedor (Cliente)
(15, 1),  -- Persona15 -> Vendedor (Cliente)
(1, 1),
(2, 1),
(26, 1),
(27, 1),
(28, 1);
INSERT INTO categoria_persona (id_persona, id_categoria) VALUES
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 2),
(22, 2),
(23, 2),
(24, 2),
(25, 2),
(29, 2),
(30, 2);

INSERT INTO propiedad (direccion, descripcion, medidas, servicios_basicos, precio_negociable, partida_registral) VALUES
('Av. Perú 123', 'Terreno urbano en buena zona', '200 m2', 'Agua, luz', 65000.00, 'PR-011'),
('Calle Lima 450', 'Casa de 2 pisos remodelada', '140 m2', 'Agua, luz, desagüe', 120000.00, 'PR-012'),
('Jr. Primavera 321', 'Departamento en 3er piso', '85 m2', 'Servicios completos', 95000.00, 'PR-013'),
('Av. Los Robles 780', 'Terreno agrícola productivo', '500 m2', 'Solo agua', 35000.00, 'PR-014'),
('Calle Sol Naciente 600', 'Casa familiar 1 piso', '110 m2', 'Agua, luz', 78000.00, 'PR-015');

INSERT INTO contrato (fecha_emision, id_propiedad, id_persona) VALUES
('2025-01-10', 1, 11),
('2025-01-12', 2, 12),
('2025-01-15', 3, 13),
('2025-01-18', 4, 14),
('2025-01-20', 5, 15);

INSERT INTO citas (fecha_agendada, observacion, estado_visita_guiada, id_persona, id_usuario)
VALUES
('2025-01-10 09:30:00', 'Cliente interesado en lote 102', 'Realizó visita', 3, 2),
('2025-01-11 14:00:00', 'Quiere ver opciones cerca a avenida principal', 'Reprogramó', 5,2),
('2025-01-12 16:30:00', 'Evaluando financiamiento', 'Canceló', 7, 3),
('2025-01-13 10:00:00', 'Cliente muy interesado, probable cierre', 'Realizó visita', 8, 2),
('2025-01-14 15:45:00', 'No atendió la llamada', 'No realizó visita', 10, 3),
('2025-01-15 11:00:00', 'Visita a propiedad en Lurín', 'Reprogramó', 12, 3),
('2025-01-16 09:00:00', 'Pidió ver planos y documentos', 'Realizó visita', 4, 3),
('2025-01-17 13:30:00', 'Cliente indeciso sobre forma de pago', 'Canceló', 6, 2),
('2025-01-18 17:00:00', 'Le gustó la ubicación, quiere segunda visita', 'Realizó visita', 9, 3),
('2025-01-19 12:30:00', 'No asistió sin avisar', 'No realizó visita', 11, 2);

INSERT INTO interesado (id_propiedad, id_persona, vendido, separado) VALUES
-- Propiedad 1 (PR-011)
(1, 3, FALSE, FALSE),
(1, 4, FALSE, FALSE),

-- Propiedad 2 (PR-012)
(2, 5, FALSE, FALSE),
(2, 6, FALSE, FALSE),
(2, 7, FALSE, FALSE),

-- Propiedad 3 (PR-013)
(3, 8, FALSE, FALSE),
(3, 9, FALSE, FALSE),

-- Propiedad 4 (PR-014)
(4, 10, FALSE, FALSE),
(4, 16, FALSE, FALSE),
(4, 17, FALSE, FALSE),

-- Propiedad 5 (PR-015)
(5, 18, FALSE, FALSE),
(5, 19, FALSE, FALSE),
(5, 20, FALSE, FALSE);

INSERT INTO usuario_comprador (id_usuario, id_persona, estado_comprador, observacion)
VALUES
-- Compradores derivados de leads
(2, 3, 'Aún no se ha contactado', 'Lead entregado al asesor1.'),
(3, 4, 'Esperando respuesta', 'Pendiente de contestar mensaje.'),
(2, 5, 'Agendó visita guiada', 'Visita programada en Lima Norte.'),
(2, 6, 'Aún no se ha contactado', 'Aún no responde.'),
(3, 7, 'No está interesado', 'Cliente canceló la visita anterior.'),
(2, 8, 'Agendó visita guiada', 'Muy interesado, segunda visita.'),
(3, 9, 'Agendó visita guiada', 'Requiere información adicional.'),
(3, 10, 'No está interesado', 'Indicó que compró en otro proyecto.'),

-- Compradores que ya eran clientes
(2, 16, 'Aún no se ha contactado', 'Cliente antiguo.'),
(3, 17, 'Esperando respuesta', 'Revisando propuesta.'),
(2, 18, 'Agendó visita guiada', 'Quiere ver 2 propiedades.'),
(3, 19, 'Aún no se ha contactado', 'Se le envió información por WhatsApp.'),
(2, 20, 'Aún no se ha contactado', 'Cliente nuevo.'),
(3, 21, 'Esperando respuesta', 'Pidió más detalles.'),
(2, 22, 'Agendó visita guiada', 'Se programó visita para mañana.'),
(3, 23, 'Aún no se ha contactado', 'Reciente conversión.'),
(2, 24, 'Agendó visita guiada', 'Interesado en zona sur.'),
(3, 25, 'Aún no se ha contactado', 'En etapa de evaluación.'),

-- Referidos compradores
(2, 29, 'Aún no se ha contactado', 'Referido de cliente.'),
(3, 30, 'Esperando respuesta', 'Cliente mostró interés inicial.');

INSERT INTO usuario_vendedor (id_usuario, id_persona, estado_vendedor, observacion)
VALUES
-- Clientes vendedores con propiedad
(2, 11, 'Seguimiento', 'Cliente vendedor con contrato activo.'),
(3, 12, 'Cierre', 'A punto de cerrar negociación.'),
(2, 13, 'Seguimiento', 'Documentación en proceso.'),
(3, 14, 'No responde', 'No contesta llamadas recientes.'),
(2, 15, 'Seguimiento', 'Revisando oferta económica.'),

-- Leads vendedores (1, 2)
(2, 1, 'Seguimiento', 'Lead con intención de vender.'),
(3, 2, 'No responde', 'No contesta mensaje inicial.'),

-- Referidos vendedores
(2, 26, 'Seguimiento', 'Referido quiere vender propiedad.'),
(3, 27, 'Cierre', 'Negociación avanzada.'),
(2, 28, 'No responde', 'No atiende llamadas.');

INSERT INTO conversiones (id_persona, id_usuario, tipo_anterior, tipo_nuevo)
VALUES
(11, 2, 'Referido', 'Cliente'),
(12, 2, 'Lead Alvas', 'Cliente'),
(13, 2, 'Lead Alvas', 'Cliente'),
(14, 3, 'Lead Propio', 'Cliente'),
(15, 3, 'Referido', 'Cliente'),
(16, 3, 'Lead Alvas', 'Cliente'),
(17, 3, 'Lead Propio', 'Cliente'),
(18, 2, 'Lead Alvas', 'Cliente'),
(19, 2, 'Lead Propio', 'Cliente'),
(20, 2, 'Referido', 'Cliente'),
(21, 2, 'Lead Propio', 'Cliente'),
(22, 2, 'Lead Alvas', 'Cliente'),
(23, 2, 'Referido', 'Cliente'),
(24, 3, 'Lead Propio', 'Cliente'),
(25, 3, 'Referido', 'Cliente');
