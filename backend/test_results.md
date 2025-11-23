# Resultados de Prueba - Objetos de Base de Datos

## ✅ View: `vw_resumen_ventas`
**Estado**: FUNCIONA CORRECTAMENTE

La vista devuelve correctamente el resumen de ventas con la siguiente información:
- ID de venta
- Fecha
- Total e impuestos
- Nombre y email del cliente
- Nombre del empleado
- Método de pago
- Cantidad de boletos

**Ejemplo de datos devueltos**:
```json
{
  "id_venta": 1,
  "fecha": "2025-11-05T06:00:00.000Z",
  "total": "2400.00",
  "impuestos": "384.00",
  "nombre_cliente": "Carlos Perez",
  "email_cliente": "carlos.perez@email.com",
  "nombre_empleado": "Admin",
  "nombre_metodo": "Tarjeta de crédito",
  "cantidad_boletos": 2
}
```

## ❌ Stored Procedure: `sp_reporte_ventas_evento`
**Estado**: ERROR DE PERMISOS

Error: `execute command denied to user 'mysql'@'%' for routine 'stageGo.sp_reporte_ventas_evento'`

**Causa**: El usuario de MySQL no tiene permisos para ejecutar stored procedures.

**Solución**: Ejecutar en MySQL:
```sql
GRANT EXECUTE ON stageGo.* TO 'mysql'@'%';
FLUSH PRIVILEGES;
```

## ❌ Stored Procedure: `sp_registrar_compra`
**Estado**: EN USO EN LA API (no probado directamente)

Este SP está siendo utilizado en `paymentsController.ts` para registrar compras. Los permisos deberían otorgarse con el mismo comando anterior.

## ⚠️ Triggers
**Estado**: ERROR DE SINTAXIS EN LA CONSULTA DE PRUEBA

Error en la query `SHOW TRIGGERS`. Necesita ser corregida.

**Verificación manual**: Para verificar que los triggers existen, ejecutar en MySQL:
```sql
SHOW TRIGGERS FROM stageGo;
```

Deberías ver:
- `trg_actualizar_estadisticas_funcion` - Actualiza estadísticas cuando se vende un boleto
- `trg_actualizar_uso_promocion` - Incrementa el contador de uso de promociones

## Resumen

| Objeto | Estado | Comentarios |
|--------|--------|-------------|
| `vw_resumen_ventas` | ✅ Funciona | Vista operativa |
| `sp_reporte_ventas_evento` | ⚠️ Permisos | Necesita GRANT EXECUTE |
| `sp_registrar_compra` | ⚠️ Permisos | Necesita GRANT EXECUTE |
| Triggers | ❓ No verificado | Requiere verificación manual en MySQL |

## Endpoints de Testing

- **View**: `GET /api/test/view/resumen-ventas`
- **SP Reporte**: `GET /api/test/sp/reporte-evento/:id_evento`
- **Triggers**: `GET /api/test/triggers` (necesita corrección)
