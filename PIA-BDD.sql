
-- 1. Ejecutar este archivo (PIA-BDD.sql) primero
-- 2. Luego ejecutar municipios_completos.sql

CREATE DATABASE IF NOT EXISTS stageGo;
USE stageGo;

CREATE TABLE Estado (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Municipio (
    id_municipio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_estado INT NOT NULL,
    FOREIGN KEY (id_estado) REFERENCES Estado(id_estado)
);


CREATE TABLE Estado_Empleado (
    id_estado_empleado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE Tipo_Empleado (
    id_tipo_empleado INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    salario_base DECIMAL(10,2)
);

CREATE TABLE Empleado (
    id_empleado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    salario DECIMAL(10,2),
    id_estado_empleado INT NOT NULL,
    id_tipo_empleado INT NOT NULL,
    FOREIGN KEY (id_estado_empleado) REFERENCES Estado_Empleado(id_estado_empleado),
    FOREIGN KEY (id_tipo_empleado) REFERENCES Tipo_Empleado(id_tipo_empleado)
);

-- TABLAS DE EVENTOS Y SEDES


CREATE TABLE Tipo_Evento (
    id_tipo_evento INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);

CREATE TABLE Sede (
    id_sede INT PRIMARY KEY AUTO_INCREMENT,
    nombre_sede VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    telefono VARCHAR(20),
    capacidad_total INT,
    activo BIT DEFAULT 1
);

CREATE TABLE Auditorio (
    id_auditorio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    capacidad INT,
    id_sede INT NOT NULL,
    FOREIGN KEY (id_sede) REFERENCES Sede(id_sede)
);

CREATE TABLE Zonas (
    id_zona INT PRIMARY KEY AUTO_INCREMENT,
    nombre_zona VARCHAR(100) NOT NULL,
    capacidad INT,
    descripcion VARCHAR(255),
    precio_multiplicador DECIMAL(5,2) DEFAULT 1.0,
    id_auditorio INT NOT NULL,
    FOREIGN KEY (id_auditorio) REFERENCES Auditorio(id_auditorio)
);

CREATE TABLE Tipo_Boleto (
    id_tipo_boleto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio_base DECIMAL(10,2),
    activo BIT DEFAULT 1,
    id_zona INT NOT NULL,
    FOREIGN KEY (id_zona) REFERENCES Zonas(id_zona)
);

CREATE TABLE Estado_Boleto (
    id_estado_boleto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE Evento (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nombre_evento VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(500),
    clasificacion VARCHAR(50),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    id_tipo_evento INT NOT NULL,
    id_empleado INT NOT NULL,
    FOREIGN KEY (id_tipo_evento) REFERENCES Tipo_Evento(id_tipo_evento),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);

CREATE TABLE Funciones (
    id_funcion INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(50) DEFAULT 'Programada',
    boletos_vendidos INT DEFAULT 0,
    recaudacion DECIMAL(10,2) DEFAULT 0,
    id_evento INT NOT NULL,
    id_auditorio INT NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES Evento(id_evento),
    FOREIGN KEY (id_auditorio) REFERENCES Auditorio(id_auditorio)
);

-- TABLAS DE PROMOCIONES Y PAGOS

CREATE TABLE Promociones (
    id_promocion INT PRIMARY KEY AUTO_INCREMENT,
    nombre_promocion VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    descuento DECIMAL(5,2),
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BIT DEFAULT 1,
    usos_maximos INT,
    usos_actuales INT DEFAULT 0
);

CREATE TABLE Metodo_Pago (
    id_metodo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_metodo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    comision DECIMAL(5,2) DEFAULT 0,
    activo BIT DEFAULT 1
);

-- ============================================
-- TABLAS DE CLIENTES Y VENTAS
-- ============================================

CREATE TABLE Clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    numero_registro VARCHAR(50) UNIQUE,
    fecha_registro DATE DEFAULT (CURRENT_DATE),
    id_municipio INT NOT NULL,
    FOREIGN KEY (id_municipio) REFERENCES Municipio(id_municipio)
);

CREATE TABLE Ventas (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    total DECIMAL(10,2),
    impuestos DECIMAL(10,2),
    id_cliente INT NOT NULL,
    id_empleado INT NOT NULL,
    id_metodo INT NOT NULL,
    id_promocion INT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY (id_metodo) REFERENCES Metodo_Pago(id_metodo),
    FOREIGN KEY (id_promocion) REFERENCES Promociones(id_promocion)
);

-- ============================================
-- TABLA DE BOLETOS (Relación entre Ventas y Funciones)
-- ============================================

CREATE TABLE Boletos (
    id_boleto INT PRIMARY KEY AUTO_INCREMENT,
    asiento VARCHAR(10),
    precio_final DECIMAL(10,2) NOT NULL,
    vigente BIT DEFAULT 1,
    id_tipo_boleto INT NOT NULL,
    id_estado_boleto INT NOT NULL,
    id_funcion INT NOT NULL,
    id_venta INT NULL,
    FOREIGN KEY (id_tipo_boleto) REFERENCES Tipo_Boleto(id_tipo_boleto),
    FOREIGN KEY (id_estado_boleto) REFERENCES Estado_Boleto(id_estado_boleto),
    FOREIGN KEY (id_funcion) REFERENCES Funciones(id_funcion),
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta)
);



-- ============================================
-- DATOS DE PRUEBA / INICIALES
-- ============================================
-- NOTA: Los Estados y Municipios se cargan desde municipios_completos.sql
-- Ejecuta primero PIA-BDD.sql y luego municipios_completos.sql

-- ESTADO EMPLEADO
INSERT INTO Estado_Empleado (nombre, descripcion)
VALUES ('Activo', 'Empleado en funciones'), ('Inactivo', 'Empleado dado de baja');

-- TIPO EMPLEADO
INSERT INTO Tipo_Empleado (nombre_tipo, descripcion, salario_base)
VALUES ('Taquillero', 'Encargado de venta de boletos', 8500.00),
       ('Administrador', 'Gestiona eventos y personal', 15000.00);

-- EMPLEADOS
-- Nota: Los passwords en este ejemplo son 'password123' hasheados con bcrypt
-- En producción, NUNCA uses contraseñas en texto plano
INSERT INTO Empleado (nombre, apellido, email, password_hash, telefono, salario, id_estado_empleado, id_tipo_empleado)
VALUES ('Luis', 'Salinas', 'luis.salinas@stagego.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '8123456789', 9500.00, 1, 1),
       ('Ana', 'Garcia', 'ana.garcia@stagego.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '8111122233', 16000.00, 1, 2);

-- TIPO EVENTO
INSERT INTO Tipo_Evento (nombre_tipo, descripcion, activo)
VALUES ('Concierto', 'Evento musical', 1),
       ('Obra de Teatro', 'Evento escenico', 1);

-- SEDE
INSERT INTO Sede (nombre_sede, direccion, ciudad, telefono, capacidad_total, activo)
VALUES ('Arena Monterrey', 'Av. Fundidora 501', 'Monterrey', '8122233344', 15000, 1),
       ('Teatro Diana', 'Av. 16 de Septiembre 710', 'Guadalajara', '3334455566', 2500, 1);

-- AUDITORIO
INSERT INTO Auditorio (nombre, capacidad, id_sede)
VALUES ('Auditorio Principal', 12000, 1),
       ('Sala Central', 2000, 2);

-- ZONAS
INSERT INTO Zonas (nombre_zona, capacidad, descripcion, precio_multiplicador, id_auditorio)
VALUES ('VIP', 500, 'Zona preferente', 2.0, 1),
       ('General', 11500, 'Zona general', 1.0, 1);

-- TIPO BOLETO
INSERT INTO Tipo_Boleto (nombre_tipo, descripcion, precio_base, activo, id_zona)
VALUES ('VIP Premium', 'Asiento en zona VIP', 1500.00, 1, 1),
       ('General', 'Asiento en zona general', 500.00, 1, 2);

-- ESTADO BOLETO
INSERT INTO Estado_Boleto (nombre, descripcion)
VALUES ('Disponible', 'Boleto disponible para la venta'),
       ('Reservado', 'Boleto temporalmente reservado'),
       ('Vendido', 'Boleto vendido y pagado'),
       ('Cancelado', 'Boleto cancelado');

-- EVENTO
INSERT INTO Evento (nombre_evento, descripcion, imagen_url, clasificacion, fecha_inicio, fecha_fin, id_tipo_evento, id_empleado)
VALUES ('Concierto de Coldplay', 'Presentación de la banda británica con su tour mundial 2025', '/images/eventos/coldplay.jpg', 'Todo Público', '2025-12-01 20:00:00', '2025-12-01 23:00:00', 1, 2),
       ('El Rey Leon', 'Obra de teatro musical basada en la película de Disney', '/images/eventos/rey_leon.jpg', 'Todo Público', '2025-11-20 19:00:00', '2025-11-30 21:30:00', 2, 2);

-- FUNCIONES
INSERT INTO Funciones (fecha, hora, estado, boletos_vendidos, recaudacion, id_evento, id_auditorio)
VALUES ('2025-12-01', '20:00', 'Programada', 0, 0, 1, 1),
       ('2025-11-25', '19:00', 'Programada', 0, 0, 2, 2);

-- PROMOCIONES
INSERT INTO Promociones (nombre_promocion, descripcion, descuento, fecha_inicio, fecha_fin, activo, usos_maximos, usos_actuales)
VALUES ('Black Friday', 'Descuento especial del 20%', 20.00, '2025-11-25', '2025-11-30', 1, 100, 0),
       ('Navidad', 'Descuento navideño del 15%', 15.00, '2025-12-10', '2025-12-25', 1, 50, 0);

-- METODOS DE PAGO
INSERT INTO Metodo_Pago (nombre_metodo, descripcion, comision, activo)
VALUES ('Tarjeta de crédito', 'Pago con tarjeta VISA/MasterCard', 2.5, 1),
       ('Efectivo', 'Pago en taquilla', 0.0, 1);
