import { Router } from 'express';
import {
  getCarouselSlides,
  getAllCarouselSlides,
  updateCarouselSlide,
  createCarouselSlide,
  deleteCarouselSlide
} from '../controllers/carouselController';

const router = Router();

// Rutas públicas
router.get('/', getCarouselSlides);

// Rutas admin (TODO: agregar middleware de autenticación)
router.get('/all', getAllCarouselSlides);
router.post('/', createCarouselSlide);
router.put('/:id', updateCarouselSlide);
router.delete('/:id', deleteCarouselSlide);

export default router;

