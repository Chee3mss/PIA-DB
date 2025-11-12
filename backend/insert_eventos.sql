-- Este script inserta todos los eventos si no existen
USE stageGo;

-- Primero, eliminar eventos existentes para evitar duplicados
DELETE FROM Evento WHERE id_evento > 0;

-- Reiniciar el auto_increment
ALTER TABLE Evento AUTO_INCREMENT = 1;

-- Insertar todos los eventos
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

-- Verificar que se insertaron
SELECT COUNT(*) as total_eventos FROM Evento;
SELECT te.nombre_tipo, COUNT(*) as cantidad
FROM Evento e
JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
GROUP BY te.nombre_tipo;

