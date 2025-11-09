INSERT INTO rol (nombre_rol) VALUES 
('Administrador'), ('Asesor'), ('Vendedor');

INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombres, apellidos, id_rol) VALUES 
('admin', 'hash_admin', 'admin@inmobiliaria.com', 'Admin', 'Principal', 1),
('asesor1', 'hash_asesor', 'asesor1@inmobiliaria.com', 'Juan', 'Pérez', 2),
('vendedor1', 'hash_vendedor', 'vendedor1@inmobiliaria.com', 'María', 'Gómez', 3);

UPDATE usuarios SET id_supervisor = 1 WHERE id_usuario = 2;

INSERT INTO categoria_persona (nombre_rol) VALUES 
('Cliente Potencial'), ('Propietario'), ('Vendedor Externo');

INSERT INTO personas (nombre, celular, edad, tipo, estado, fecha_captacion) VALUES 
('Carlos López', '123456789', 35, 'Cliente', 'Activo', '2023-01-15'),
('Ana Martínez', '987654321', 42, 'Propietario', 'Activo', '2023-02-20');

INSERT INTO persona_categoria (id_persona, id_categoria) VALUES 
(1, 1), (2, 2);

INSERT INTO propiedad (direccion, descripcion, medidas, servicios_basicos, precio_negociable, partida_registral) VALUES 
('Calle Falsa 123', 'Casa de 3 habitaciones', '120 m²', 'Agua, Luz', 250000.00, 'PR-2023-001');

INSERT INTO contrato (fecha_emision, id_propiedad) VALUES 
('2023-03-10', 1);

INSERT INTO interesado (id_propiedad, id_persona, vendido, estado_comprador, separado) VALUES 
(1, 1, FALSE, 'Interesado', TRUE);

INSERT INTO propiedad_asesor (id_propiedad, id_usuario) VALUES 
(1, 2);

INSERT INTO citas (fecha_agendada, observacion, estado_visita_guiada, id_persona, id_usuario) VALUES 
('2023-03-15 10:00:00', 'Visita guiada programada', 'Pendiente', 1, 2);

INSERT INTO usuario_vendedor (id_usuario, id_persona, estado_vendedor) VALUES 
(3, 1, 'Activo');

INSERT INTO firma (id_contrato, id_persona) VALUES 
(1, 1);