
DROP TABLE IF EXISTS firma CASCADE;
DROP TABLE IF EXISTS interesado CASCADE;
DROP TABLE IF EXISTS propiedad_asesor CASCADE;
DROP TABLE IF EXISTS persona_categoria CASCADE;
DROP TABLE IF EXISTS usuario_vendedor CASCADE;

DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS contrato CASCADE;
DROP TABLE IF EXISTS propiedad CASCADE;
DROP TABLE IF EXISTS personas CASCADE;
DROP TABLE IF EXISTS categoria_persona CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS rol CASCADE;

CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    nombre_completo VARCHAR(200),
    estado BOOLEAN DEFAULT TRUE,
    id_rol INTEGER NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE RESTRICT
);

CREATE TABLE personas (
    id_persona SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    celular VARCHAR(20),
    edad INTEGER,
    tipo VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'Activo',
    fecha_captacion DATE
);

CREATE TABLE categoria_persona (
    id_categoria SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE propiedad (
    id_propiedad SERIAL PRIMARY KEY,
    direccion TEXT NOT NULL,
    descripcion TEXT,
    medidas VARCHAR(100),
    servicios_basicos TEXT,
    precio_negociable NUMERIC(12,2) NOT NULL,
    partida_registral VARCHAR(100) UNIQUE
);

CREATE TABLE contrato (
    id_contrato SERIAL PRIMARY KEY,
    fecha_emision DATE NOT NULL,
    id_propiedad INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad) ON DELETE CASCADE
);

CREATE TABLE citas (
    id_cita SERIAL PRIMARY KEY,
    fecha_agendada TIMESTAMP NOT NULL,
    observacion TEXT,
    estado_visita_guiada VARCHAR(50) DEFAULT 'Pendiente',
    id_persona INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE propiedad_asesor (
    id_propiedad INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    PRIMARY KEY (id_propiedad, id_usuario),
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE interesado (
    id_propiedad INTEGER NOT NULL,
    id_persona INTEGER NOT NULL,
    vendido BOOLEAN DEFAULT FALSE,
    estado_comprador VARCHAR(50) DEFAULT 'Interesado',
    separado BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_propiedad, id_persona),
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad) ON DELETE CASCADE,
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE
);

CREATE TABLE usuario_vendedor (
    id_usuario INTEGER NOT NULL,
    id_persona INTEGER,
    estado_vendedor VARCHAR(50) DEFAULT 'Activo',
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE SET NULL
);

CREATE TABLE persona_categoria (
    id_persona INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    PRIMARY KEY (id_persona, id_categoria),
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categoria_persona(id_categoria) ON DELETE CASCADE
);

CREATE TABLE firma (
    id_contrato INTEGER NOT NULL,
    id_persona INTEGER NOT NULL,
    PRIMARY KEY (id_contrato, id_persona),
    FOREIGN KEY (id_contrato) REFERENCES contrato(id_contrato) ON DELETE CASCADE,
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE
);

ALTER TABLE usuarios
ADD COLUMN id_supervisor INTEGER,
ADD CONSTRAINT fk_supervisor FOREIGN KEY (id_supervisor) REFERENCES usuarios(id_usuario) ON DELETE SET NULL;
