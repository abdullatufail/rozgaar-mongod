import express from 'express';
import { auth, authorize } from '../middleware/auth.middleware.js';
import * as gigsController from '../controllers/gigs.controller.js';

const router = express.Router();

// Protected specific routes
router.get('/my/gigs', auth, authorize('freelancer'), gigsController.getMyGigs);
router.get('/freelancer/:freelancerId', gigsController.getFreelancerGigs);

// Public routes
router.get('/', gigsController.getGigs);
router.get('/:id', gigsController.getGig);

// Protected general routes
router.post('/', auth, authorize('freelancer'), gigsController.createGig);
router.put('/:id', auth, gigsController.updateGig);
router.delete('/:id', auth, gigsController.deleteGig);

export default router; 