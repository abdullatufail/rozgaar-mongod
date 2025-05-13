import express from 'express';
import { auth, authorize } from '../middleware/auth.middleware.js';
import * as ordersController from '../controllers/orders.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Order management
router.post('/', auth, authorize('client'), ordersController.createOrder);
router.get('/', auth, ordersController.getOrders);
router.get('/:id', auth, ordersController.getOrder);
router.patch('/:id/status', auth, ordersController.updateOrderStatus);

// Delivery management
router.post('/:id/deliver', auth, upload.single('file'), ordersController.deliverOrder);
router.post('/:id/approve', auth, ordersController.approveDelivery);
router.post('/:id/reject', auth, ordersController.rejectDelivery);

// Cancellation management
router.post('/:id/cancel', auth, ordersController.requestCancellation);
router.post('/:id/approve-cancellation', auth, ordersController.approveCancellation);
router.post('/:id/reject-cancellation', auth, ordersController.rejectCancellation);

// Reviews
router.post('/:id/review', auth, ordersController.addReview);
router.get('/freelancer/:freelancerId/reviews', ordersController.getFreelancerReviews);
router.get('/gig/:gigId/reviews', ordersController.getGigReviews);

// Messages
router.post('/:id/messages', auth, ordersController.addMessage);
router.get('/:id/messages', auth, ordersController.getOrderMessages);

export default router; 