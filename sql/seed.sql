INSERT INTO roles (nombre_rol) VALUES
('ADMINISTRADOR'),
('ASESOR_VENTAS');

INSERT INTO lead_estados (nombre_estado) VALUES
('NUEVO'),
('CONTACTADO'),
('NEGOCIACION'),
('CERRADO_EXITOSO'),
('CERRADO_FALLIDO');

INSERT INTO usuarios (nombre_usuario, password_hash, nombres, apellidos, telefono, fecha_contratacion, activo) VALUES
('william_admin', 'hash_dummy_admin', 'William', 'Vargas', '987654321', '2023-01-15', TRUE),
('pablo_asesor', 'hash_dummy_asesor1', 'Pablo', 'Gonzalez', '999123456', '2024-03-01', TRUE),
('katherine_asesora', 'hash_dummy_asesor2', 'Katherine', 'Navas', '988777666', '2024-05-20', TRUE);

INSERT INTO usuario_roles (id_usuario, id_rol) VALUES
(1, (SELECT id_rol FROM roles WHERE nombre_rol = 'ADMINISTRADOR')),
(1, (SELECT id_rol FROM roles WHERE nombre_rol = 'ASESOR_VENTAS')),
(2, (SELECT id_rol FROM roles WHERE nombre_rol = 'ASESOR_VENTAS')),
(3, (SELECT id_rol FROM roles WHERE nombre_rol = 'ASESOR_VENTAS'));

INSERT INTO personas (nombre, fecha_registro, id_usuario_registro) VALUES
('Interesado Carlos Soto', '2025-10-25', (SELECT id_usuario FROM usuarios WHERE nombre_usuario = 'pablo_asesor'));

INSERT INTO leads (id_persona, id_estado, id_usuario_asignado) VALUES
((SELECT id_persona FROM personas WHERE nombre = 'Interesado Carlos Soto'),
 (SELECT id_estado FROM lead_estados WHERE nombre_estado = 'NEGOCIACION'),
 (SELECT id_usuario FROM usuarios WHERE nombre_usuario = 'pablo_asesor'));

INSERT INTO personas (nombre, fecha_registro, id_usuario_registro) VALUES
('Cliente Laura Pérez', '2024-08-01', (SELECT id_usuario FROM usuarios WHERE nombre_usuario = 'william_admin'));

INSERT INTO leads (id_persona, id_estado, id_usuario_asignado) VALUES
((SELECT id_persona FROM personas WHERE nombre = 'Cliente Laura Pérez'),
 (SELECT id_estado FROM lead_estados WHERE nombre_estado = 'CERRADO_EXITOSO'),
 (SELECT id_usuario FROM usuarios WHERE nombre_usuario = 'william_admin'));

 INSERT INTO clientes (id_persona, contrato_cantidad) VALUES
((SELECT id_persona FROM personas WHERE nombre = 'Cliente Laura Pérez'), 150000.00);

INSERT INTO ventas_cerradas (id_lead, id_usuario_cierre, monto_final, fecha_cierre, comision_asesor) VALUES
((SELECT id_persona FROM personas WHERE nombre = 'Cliente Laura Pérez'),
 (SELECT id_usuario FROM usuarios WHERE nombre_usuario = 'william_admin'),
 150000.00,
 '2024-09-10',
 1.50);


INSERT INTO interacciones (id_lead, id_usuario_asesor, tipo_interaccion, fecha_hora, notas) VALUES
((SELECT id_persona FROM personas WHERE nombre = 'Interesado Carlos Soto'),
 (SELECT id_usuario FROM usuarios WHERE nombre_usuario = 'pablo_asesor'),
 'Llamada',
 '2025-10-26 10:00:00',
 'Presentación de propuesta. Cliente solicitó revisar financiamiento.'),

((SELECT id_persona FROM personas WHERE nombre = 'Interesado Carlos Soto'),
 (SELECT id_usuario FROM usuarios WHERE nombre_usuario = 'pablo_asesor'),
 'Email',
 '2025-10-28 15:30:00',
 'Envío de tabla de amortización. Cliente confirma interés.');
