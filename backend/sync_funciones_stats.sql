-- Script para sincronizar estadísticas de funciones con boletos existentes
-- Este script actualiza los campos boletos_vendidos y recaudacion de la tabla Funciones

USE stageGo;

-- Actualizar las estadísticas de todas las funciones basándose en los boletos vendidos
UPDATE Funciones f
LEFT JOIN (
    SELECT 
        b.id_funcion,
        COUNT(*) as total_boletos,
        SUM(b.precio_final) as total_recaudacion
    FROM Boletos b
    WHERE b.id_estado_boleto = 3 -- Solo boletos vendidos
    GROUP BY b.id_funcion
) stats ON f.id_funcion = stats.id_funcion
SET 
    f.boletos_vendidos = COALESCE(stats.total_boletos, 0),
    f.recaudacion = COALESCE(stats.total_recaudacion, 0.00);

-- Mostrar el resultado
SELECT 
    f.id_funcion,
    e.nombre_evento,
    f.fecha,
    f.hora,
    f.boletos_vendidos,
    f.recaudacion,
    a.capacidad
FROM Funciones f
INNER JOIN Evento e ON f.id_evento = e.id_evento
INNER JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
WHERE f.boletos_vendidos > 0
ORDER BY f.boletos_vendidos DESC;

