INSERT INTO rol (nombre_rol) VALUES 
('Administrador'), ('Asesor');

INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombres, apellidos, id_rol) VALUES 
('admin_jefe', 'hash123', 'jefe@alvas.com', 'Carlos', 'Mendoza', 1),
('asesor_golfer', 'hash123', 'golfer@alvas.com', 'Golfer', 'Rivas', 2),
('admin', 'hash123', 'admin@alvas.com', 'Admin', 'Sistema', 1);

INSERT INTO categoria_persona (nombre_rol) VALUES 
('Vendedor'), ('Comprador');

INSERT INTO personas (nombre, celular, tipo, fecha_captacion) VALUES 
('Reynaldo Jhon',      '952604870', 'Lead Alvas', '2025-09-03'),
('René Lupaca',        '918258270', 'Lead Alvas', '2025-09-02'),
('Diego',              '983819894', 'Lead Alvas', '2025-09-01'),
('German',   '959483073', 'Lead Alvas', '2025-09-01'),
('Luis Rodríguez',     '929769574', 'Lead Alvas', '2025-09-03'),
('Fernando Abel',      '985730695', 'Lead Alvas', '2025-08-26'),
('Ares',               '968968118', 'Lead Alvas', '2025-08-25'),
('Elio Sucoticona',    '913583022', 'Lead Alvas', '2025-09-01'),
('Ruth',               '901305949', 'Lead Alvas', '2025-09-15'),
('Jorge Campos',       '963026623', 'Lead Alvas', '2025-09-16'),
('Serapio Choquecota','963286758', 'Lead Alvas', '2025-09-19'),
('Lerman',             '953557571',  'Lead Alvas', '2025-09-22'),
('Construye Inmob.',   '916330916', 'Lead Alvas', '2025-09-22'),
('Nicanor',            '944500881', 'Lead Alvas', '2025-09-22'),
('Juan Cáceres',       '952893505', 'Lead Alvas', '2025-09-23'),
('Ever Calizaya',      '915911982', 'Lead Alvas', '2025-09-29');

INSERT INTO persona_categoria (id_persona, id_categoria)
SELECT id_persona, 2 FROM personas; 

INSERT INTO persona_categoria (id_persona, id_categoria) VALUES (3, 1);

INSERT INTO propiedad (direccion, descripcion, medidas, servicios_basicos, precio_negociable, partida_registral) VALUES 
('Av. Industrial Nº 259-B - Tacna', 'Terreno con servicios', '20.5 x 6 = 123 m²', 'Luz, Agua, Desagüe', 330000.00, 'PR-259-B-TAC'),
('Sector 25 Viñani Mz.12 Lt.16 - Gal', 'Terreno sin servicios', '19.2 x 8 = 153.6 m²', 'Por solicitar', 28000.00, 'PR-MZ12-LT16');

INSERT INTO contrato (fecha_emision, id_propiedad, id_persona) VALUES 
('2025-09-05', 1, 3),
('2025-09-10', 2, 3);

INSERT INTO citas (fecha_agendada, observacion, estado_visita_guiada, id_persona, id_usuario) VALUES 
('2025-09-05 10:00:00', 'Conversación con familiares', 'Reprogramó', 1, 2),
('2025-09-04 15:00:00', 'El costo de la propiedad muy elevado', 'Canceló', 2, 2),
('2025-09-03 09:30:00', 'No llegó a concretar su viaje', 'Reprogramó', 8, 2),
('2025-09-30 11:00:00', 'No asistió a la cita programada', 'No realizó visita', 16, 2);

INSERT INTO interesado (id_propiedad, id_persona, estado_comprador, separado) VALUES 
(1, 1, 'Agendó visita guiada', TRUE),  
(1, 2, 'No está interesado', FALSE),  
(1, 8, 'Esperando respuesta', FALSE), 
(1, 16, 'Agendó visita guiada', FALSE), 
(1, 4, 'Aún no se ha contactado', FALSE),  
(1, 12, 'Aún no se ha contactado', FALSE), 
(1, 15, 'Aún no se ha contactado', FALSE), 
(2, 10, 'Esperando respuesta', FALSE),   
(2, 11, 'Esperando respuesta', FALSE);   


INSERT INTO usuario_vendedor (id_usuario, id_persona, estado_vendedor) VALUES 
(2, 3, 'Cierre'); 


INSERT INTO propiedad_asesor (id_propiedad, id_usuario) VALUES 
(1, 2), (2, 2);