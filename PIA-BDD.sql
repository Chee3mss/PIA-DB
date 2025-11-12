
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
       ('Administrador', 'Gestiona eventos y personal', 15000.00),
       ('Superusuario', 'Control total del sistema', 20000.00);

-- EMPLEADOS
-- Nota: Los passwords son hasheados con bcrypt
-- password123: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- admin123: $2a$10$rOOqKCqW8x.9pzB.WQe0me7cO5n3YZGk5Xhh5Z7gXZdH4YkMQFjW6
-- En producción, NUNCA uses contraseñas predecibles
INSERT INTO Empleado (nombre, apellido, email, password_hash, telefono, salario, id_estado_empleado, id_tipo_empleado)
VALUES ('Admin', 'Sistema', 'admin@stagego.com', '$2a$10$rOOqKCqW8x.9pzB.WQe0me7cO5n3YZGk5Xhh5Z7gXZdH4YkMQFjW6', '8199999999', 20000.00, 1, 3),
       ('Luis', 'Salinas', 'luis.salinas@stagego.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '8123456789', 9500.00, 1, 1),
       ('Ana', 'Garcia', 'ana.garcia@stagego.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '8111122233', 16000.00, 1, 2);

-- TIPO EVENTO (Categorías)
INSERT INTO Tipo_Evento (nombre_tipo, descripcion, activo)
VALUES ('Concierto', 'Eventos musicales en vivo', 1),
       ('Obra de Teatro', 'Representaciones teatrales', 1),
       ('Deportes', 'Eventos deportivos', 1),
       ('Stand-Up Comedy', 'Shows de comedia', 1),
       ('Festival', 'Festivales y eventos masivos', 1),
       ('Conferencia', 'Charlas y conferencias', 1);

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

-- EVENTOS
INSERT INTO Evento (nombre_evento, descripcion, imagen_url, clasificacion, fecha_inicio, fecha_fin, id_tipo_evento, id_empleado)
VALUES 
-- Conciertos (id_tipo_evento = 1)
('Concierto de Coldplay', 'Presentación de la banda británica con su tour mundial 2025. Una experiencia musical inolvidable.', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 'Todo Público', '2025-12-01 20:00:00', '2025-12-01 23:00:00', 1, 1),
('Bad Bunny World Tour', 'El conejo malo regresa a México con su tour más esperado del año.', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 'Todo Público', '2025-11-15 21:00:00', '2025-11-15 23:30:00', 1, 1),
('Karol G - Mañana Será Bonito Tour', 'La bichota llega con su mejor show. Una noche llena de reggaetón y emociones.', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', 'Mayor 12', '2025-11-28 21:00:00', '2025-11-28 23:30:00', 1, 1),
('Metallica En Concierto', 'Los reyes del metal regresan con un show épico lleno de clásicos.', 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800', 'Mayor 18', '2025-12-18 20:00:00', '2025-12-18 23:00:00', 1, 1),
('Grupo Firme - Tour 2025', 'La banda mexicana más popular presenta su nuevo tour.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'Todo Público', '2025-12-22 21:00:00', '2025-12-22 23:30:00', 1, 1),
('Luis Miguel - Tour 2025', 'El Sol de México regresa con sus mejores éxitos.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'Todo Público', '2025-11-22 21:00:00', '2025-11-22 23:30:00', 1, 1),

-- Teatro (id_tipo_evento = 2)
('El Rey León', 'Obra de teatro musical basada en la película de Disney. Una experiencia mágica.', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', 'Todo Público', '2025-11-20 19:00:00', '2025-11-30 21:30:00', 2, 1),
('Romeo y Julietaa', 'La clásica obra de Shakespeare en una adaptación moderna y emocionante.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'Mayor 12', '2025-12-10 20:00:00', '2025-12-20 22:00:00', 2, 1),
('Hamilton México', 'El musical más aclamado de Broadway llega a México por primera vez.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', 'Mayor 12', '2025-11-30 20:00:00', '2025-12-15 22:00:00', 2, 1),
('La Casa de Bernarda Alba', 'Una de las obras más emblemáticas del teatro español. Imperdible.', 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800', 'Mayor 15', '2026-01-05 19:00:00', '2026-01-20 21:00:00', 2, 1),

-- Deportes (id_tipo_evento = 3)
('Final Liga MX', 'Gran final del torneo de fútbol mexicano. ¡No te lo pierdas!', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 'Todo Público', '2025-12-15 19:00:00', '2025-12-15 21:00:00', 3, 1),
('NBA Mexico Game', 'Juego de la NBA en territorio mexicano. Espectáculo deportivo de clase mundial.', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 'Todo Público', '2025-12-05 20:00:00', '2025-12-05 22:30:00', 3, 1),
('WWE Monday Night Raw', 'La WWE llega a México con sus mejores superestrellas en vivo.', 'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=800', 'Todo Público', '2025-11-30 20:00:00', '2025-11-30 23:00:00', 3, 1),
('Pelea Canelo Álvarez', 'El mejor boxeador mexicano defiende su título mundial.', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800', 'Mayor 18', '2025-12-20 20:00:00', '2025-12-20 23:00:00', 3, 1),

-- Stand-Up Comedy (id_tipo_evento = 4)
('Franco Escamilla', 'El comediante más famoso de México presenta su nuevo show.', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800', 'Mayor 18', '2025-11-25 21:00:00', '2025-11-25 23:00:00', 4, 1),
('Eugenio Derbez Live', 'El actor y comediante presenta un show único lleno de risas.', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', 'Mayor 12', '2025-12-08 20:00:00', '2025-12-08 22:00:00', 4, 1),
('Chumel Torres - El Pulso', 'Análisis político con humor. El conductor más polémico de México.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800', 'Mayor 18', '2025-12-02 21:00:00', '2025-12-02 23:00:00', 4, 1),
('Adal Ramones - Otro Rollo Live', 'El legendario conductor regresa con su show de comedia.', 'https://images.unsplash.com/photo-1489710020360-66e504159b2a?w=800', 'Mayor 12', '2025-12-16 20:00:00', '2025-12-16 22:00:00', 4, 1),

-- Festival (id_tipo_evento = 5)
('Festival Pa\'l Norte 2025', 'El festival más grande del norte de México con artistas internacionales.', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', 'Mayor 18', '2025-03-20 14:00:00', '2025-03-22 02:00:00', 5, 1),
('Vive Latino 2025', 'El festival de música alternativa más importante de Latinoamérica.', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', 'Mayor 18', '2025-03-15 12:00:00', '2025-03-17 02:00:00', 5, 1),

-- Conferencia (id_tipo_evento = 6)
('Tech Summit 2025', 'La conferencia de tecnología más importante de Latinoamérica.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'Todo Público', '2025-11-18 09:00:00', '2025-11-19 18:00:00', 6, 1),
('Marketing Digital Expo', 'Aprende de los mejores expertos en marketing digital y redes sociales.', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800', 'Mayor 18', '2025-12-12 10:00:00', '2025-12-12 19:00:00', 6, 1),
('Cumbre de Innovación', 'Los líderes empresariales más influyentes comparten sus experiencias.', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', 'Todo Público', '2025-12-08 08:00:00', '2025-12-08 19:00:00', 6, 1);

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
