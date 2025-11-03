DROP TABLE IF EXISTS ventas_cerradas, interacciones, leads, clientes, lead_estados, personas, usuario_roles, usuarios, roles CASCADE;

CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    fecha_contratacion DATE,

    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITHOUT TIME ZONE
);

CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();


CREATE TABLE usuario_roles (
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_rol INTEGER NOT NULL REFERENCES roles(id_rol) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, id_rol)
);

CREATE TABLE personas (
    id_persona SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL,
    observacion TEXT,
    id_usuario_registro INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

CREATE TABLE clientes (
    id_persona INTEGER PRIMARY KEY REFERENCES personas(id_persona) ON DELETE CASCADE,
    contrato_cantidad NUMERIC(10, 2) NOT NULL
);

CREATE TABLE lead_estados (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE leads (
    id_persona INTEGER PRIMARY KEY REFERENCES personas(id_persona) ON DELETE CASCADE,

    id_estado INTEGER NOT NULL REFERENCES lead_estados(id_estado) ON DELETE RESTRICT,

    id_usuario_asignado INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);


CREATE TABLE interacciones (
    id_interaccion SERIAL PRIMARY KEY,
    id_lead INTEGER NOT NULL REFERENCES leads(id_persona) ON DELETE CASCADE,
    id_usuario_asesor INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    tipo_interaccion VARCHAR(50) NOT NULL,
    fecha_hora TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    notas TEXT
);


CREATE TABLE ventas_cerradas (
    id_venta SERIAL PRIMARY KEY,

    -- UNIQUE para asegurar que un Lead se cierra solo una vez
    id_lead INTEGER NOT NULL UNIQUE REFERENCES leads(id_persona) ON DELETE RESTRICT,

    id_usuario_cierre INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    monto_final NUMERIC(10, 2) NOT NULL,
    fecha_cierre DATE DEFAULT CURRENT_DATE,
    comision_asesor NUMERIC(5, 2) DEFAULT 0
);
