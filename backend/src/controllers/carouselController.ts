import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const CAROUSEL_FILE = path.join(__dirname, '../../carousel.json');

// Obtener slides del carrusel
export const getCarouselSlides = async (_req: Request, res: Response) => {
  try {
    const data = await fs.readFile(CAROUSEL_FILE, 'utf-8');
    const slides = JSON.parse(data);
    
    // Filtrar solo los activos
    const activeSlides = slides.filter((slide: any) => slide.active);
    
    res.json(activeSlides);
  } catch (error) {
    console.error('Error al leer carrusel:', error);
    res.status(500).json({ error: 'Error al obtener slides del carrusel' });
  }
};

// Obtener todos los slides (incluyendo inactivos) - Solo para admin
export const getAllCarouselSlides = async (_req: Request, res: Response) => {
  try {
    const data = await fs.readFile(CAROUSEL_FILE, 'utf-8');
    const slides = JSON.parse(data);
    
    res.json(slides);
  } catch (error) {
    console.error('Error al leer carrusel:', error);
    res.status(500).json({ error: 'Error al obtener slides del carrusel' });
  }
};

// Actualizar slide del carrusel - Solo para admin
export const updateCarouselSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedSlide = req.body;

    const data = await fs.readFile(CAROUSEL_FILE, 'utf-8');
    let slides = JSON.parse(data);
    
    const index = slides.findIndex((slide: any) => slide.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Slide no encontrado' });
    }
    
    slides[index] = { ...slides[index], ...updatedSlide, id: parseInt(id) };
    
    await fs.writeFile(CAROUSEL_FILE, JSON.stringify(slides, null, 2));
    
    res.json({ 
      message: 'Slide actualizado exitosamente',
      slide: slides[index]
    });
  } catch (error) {
    console.error('Error al actualizar slide:', error);
    res.status(500).json({ error: 'Error al actualizar slide' });
  }
};

// Crear nuevo slide - Solo para admin
export const createCarouselSlide = async (req: Request, res: Response) => {
  try {
    const newSlide = req.body;

    const data = await fs.readFile(CAROUSEL_FILE, 'utf-8');
    const slides = JSON.parse(data);
    
    // Generar nuevo ID
    const maxId = slides.reduce((max: number, slide: any) => 
      slide.id > max ? slide.id : max, 0);
    
    const slideToAdd = {
      id: maxId + 1,
      ...newSlide,
      active: newSlide.active !== undefined ? newSlide.active : true
    };
    
    slides.push(slideToAdd);
    
    await fs.writeFile(CAROUSEL_FILE, JSON.stringify(slides, null, 2));
    
    res.status(201).json({ 
      message: 'Slide creado exitosamente',
      slide: slideToAdd
    });
  } catch (error) {
    console.error('Error al crear slide:', error);
    res.status(500).json({ error: 'Error al crear slide' });
  }
};

// Eliminar slide - Solo para admin
export const deleteCarouselSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const data = await fs.readFile(CAROUSEL_FILE, 'utf-8');
    let slides = JSON.parse(data);
    
    slides = slides.filter((slide: any) => slide.id !== parseInt(id));
    
    await fs.writeFile(CAROUSEL_FILE, JSON.stringify(slides, null, 2));
    
    res.json({ message: 'Slide eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar slide:', error);
    res.status(500).json({ error: 'Error al eliminar slide' });
  }
};

