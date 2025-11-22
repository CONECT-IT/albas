
DROP TABLE IF EXISTS firma CASCADE;
DROP TABLE IF EXISTS interesado CASCADE;
DROP TABLE IF EXISTS usuario_vendedor CASCADE;
DROP TABLE IF EXISTS propiedad_asesor CASCADE;
DROP TABLE IF EXISTS persona_categoria CASCADE;
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
    edad INTEGER CHECK (edad BETWEEN 18 AND 99),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Cliente', 'Referido', 'Lead Alvas', 'Lead Propio')),
    fecha_captacion DATE DEFAULT CURRENT_DATE
);

CREATE TABLE categoria_persona (
    id_categoria SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE CHECK (nombre_rol IN ('Vendedor', 'Comprador'))
);

CREATE TABLE propiedad (
    id_propiedad SERIAL PRIMARY KEY,
    direccion TEXT NOT NULL,
    descripcion TEXT,
    medidas VARCHAR(100),
    servicios_basicos TEXT,
    precio_negociable NUMERIC(12,2) NOT NULL CHECK (precio_negociable > 0),
    partida_registral VARCHAR(100) UNIQUE
);

CREATE TABLE contrato (
    id_contrato SERIAL PRIMARY KEY,
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    id_propiedad INTEGER UNIQUE NOT NULL,
    id_persona INTEGER NOT NULL,
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad) ON DELETE CASCADE,
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE RESTRICT
);

CREATE TABLE citas (
    id_cita SERIAL PRIMARY KEY,
    fecha_agendada TIMESTAMP NOT NULL,
    observacion TEXT,
    estado_visita_guiada VARCHAR(30) NOT NULL 
        CHECK (estado_visita_guiada IN ('Reprogramó', 'Canceló', 'No realizó visita', 'Realizó visita')),
    id_persona INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE interesado (
    id_propiedad INTEGER NOT NULL,
    id_persona INTEGER NOT NULL,
    vendido BOOLEAN DEFAULT FALSE,
    estado_comprador VARCHAR(30) DEFAULT 'Aún no se ha contactado'
        CHECK (estado_comprador IN (
            'Aún no se ha contactado',
            'Esperando respuesta',
            'Agendó visita guiada',
            'Venta concretada',
            'No está interesado'
        )),
    separado BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_propiedad, id_persona),
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad) ON DELETE CASCADE,
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE
);

CREATE TABLE usuario_vendedor (
    id_usuario INTEGER NOT NULL,
    id_persona INTEGER NOT NULL,
    estado_vendedor VARCHAR(30) DEFAULT 'Seguimiento'
        CHECK (estado_vendedor IN ('Seguimiento', 'Cierre', 'No responde')),
    fecha_asignacion DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_usuario, id_persona),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE
);

CREATE TABLE propiedad_asesor (
    id_propiedad INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    PRIMARY KEY (id_propiedad, id_usuario),
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE persona_categoria (
    id_persona INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    PRIMARY KEY (id_persona, id_categoria),
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categoria_persona(id_categoria) ON DELETE CASCADE
);


