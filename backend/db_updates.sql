USE stageGo
--
-- Views
--

DROP VIEW IF EXISTS `vw_resumen_ventas`;
CREATE VIEW `vw_resumen_ventas` AS
SELECT 
    v.id_venta,
    v.fecha,
    v.total,
    v.impuestos,
    c.nombre_completo AS nombre_cliente,
    c.email AS email_cliente,
    e.nombre AS nombre_empleado,
    mp.nombre_metodo,
    COUNT(b.id_boleto) AS cantidad_boletos
FROM Ventas v
JOIN Clientes c ON v.id_cliente = c.id_cliente
JOIN Empleado e ON v.id_empleado = e.id_empleado
JOIN Metodo_Pago mp ON v.id_metodo = mp.id_metodo
LEFT JOIN Boletos b ON v.id_venta = b.id_venta
GROUP BY v.id_venta;

--
-- Triggers
--

DELIMITER ;;
DROP TRIGGER IF EXISTS `trg_actualizar_estadisticas_funcion`;;
CREATE TRIGGER `trg_actualizar_estadisticas_funcion` AFTER INSERT ON `Boletos` FOR EACH ROW
BEGIN
    IF NEW.id_estado_boleto = 3 THEN -- 3 = Vendido
        UPDATE Funciones 
        SET boletos_vendidos = boletos_vendidos + 1,
            recaudacion = recaudacion + NEW.precio_final
        WHERE id_funcion = NEW.id_funcion;
    END IF;
END ;;

DROP TRIGGER IF EXISTS `trg_actualizar_uso_promocion`;;
CREATE TRIGGER `trg_actualizar_uso_promocion` AFTER INSERT ON `Ventas` FOR EACH ROW
BEGIN
    IF NEW.id_promocion IS NOT NULL THEN
        UPDATE Promociones 
        SET usos_actuales = usos_actuales + 1
        WHERE id_promocion = NEW.id_promocion;
    END IF;
END ;;
DELIMITER ;

--
-- Stored Procedures
--

DELIMITER ;;
DROP PROCEDURE IF EXISTS `sp_registrar_compra`;;
CREATE PROCEDURE `sp_registrar_compra`(
    IN p_id_cliente INT,
    IN p_total DECIMAL(10,2),
    IN p_id_empleado INT,
    IN p_id_metodo INT,
    IN p_id_promocion INT,
    IN p_detalles_json JSON,
    OUT p_id_venta INT
)
BEGIN
    DECLARE v_id_venta INT;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_count INT;
    DECLARE v_item JSON;
    DECLARE v_id_funcion INT;
    DECLARE v_asiento VARCHAR(10);
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_id_tipo_boleto INT DEFAULT 2; -- General por defecto
    DECLARE v_id_estado_vendido INT DEFAULT 3; -- Vendido

    -- Iniciar transacción (manejada por el caller o implícita)
    
    -- Insertar Venta
    INSERT INTO Ventas (fecha, total, impuestos, id_cliente, id_empleado, id_metodo, id_promocion)
    VALUES (CURDATE(), p_total, p_total * 0.16, p_id_cliente, p_id_empleado, p_id_metodo, p_id_promocion);
    
    SET v_id_venta = LAST_INSERT_ID();
    SET p_id_venta = v_id_venta;

    -- Procesar JSON de boletos
    SET v_count = JSON_LENGTH(p_detalles_json);
    
    WHILE v_i < v_count DO
        SET v_item = JSON_EXTRACT(p_detalles_json, CONCAT('$[', v_i, ']'));
        SET v_id_funcion = JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.id_funcion'));
        SET v_asiento = JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.asiento'));
        SET v_precio = JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.precio'));
        
        -- Insertar Boleto
        INSERT INTO Boletos (asiento, precio_final, vigente, id_tipo_boleto, id_estado_boleto, id_funcion, id_venta)
        VALUES (v_asiento, v_precio, 1, v_id_tipo_boleto, v_id_estado_vendido, v_id_funcion, v_id_venta);
        
        SET v_i = v_i + 1;
    END WHILE;
    
    -- Commit manejado externamente si es necesario
END ;;

DROP PROCEDURE IF EXISTS `sp_reporte_ventas_evento`;;
CREATE PROCEDURE `sp_reporte_ventas_evento`(
    IN p_id_evento INT
)
BEGIN
    SELECT 
        f.fecha,
        f.hora,
        f.boletos_vendidos,
        f.recaudacion,
        s.nombre_sede
    FROM Funciones f
    JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
    JOIN Sede s ON a.id_sede = s.id_sede
    WHERE f.id_evento = p_id_evento;
END ;;
DELIMITER ;
