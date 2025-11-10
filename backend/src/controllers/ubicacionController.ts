import { Request, Response } from 'express';
import { query } from '../config/database';
import { Estado, Municipio, ApiResponse } from '../types';

// Obtener todos los estados
export const getEstados = async (req: Request, res: Response): Promise<void> => {
  try {
    const estados = await query<Estado[]>(
      'SELECT * FROM Estado ORDER BY nombre'
    );

    const response: ApiResponse<Estado[]> = {
      success: true,
      data: estados
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener estados:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estados'
    });
  }
};

// Obtener municipios por estado
export const getMunicipiosByEstado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idEstado } = req.params;

    const municipios = await query<Municipio[]>(
      'SELECT * FROM Municipio WHERE id_estado = ? ORDER BY nombre',
      [idEstado]
    );

    const response: ApiResponse<Municipio[]> = {
      success: true,
      data: municipios
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener municipios'
    });
  }
};

// Obtener todos los municipios
export const getAllMunicipios = async (req: Request, res: Response): Promise<void> => {
  try {
    const municipios = await query(
      `SELECT m.*, e.nombre as estado_nombre 
       FROM Municipio m
       LEFT JOIN Estado e ON m.id_estado = e.id_estado
       ORDER BY e.nombre, m.nombre`
    );

    const response: ApiResponse = {
      success: true,
      data: municipios
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener municipios'
    });
  }
};

