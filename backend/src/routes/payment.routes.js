import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', authenticateToken, createOrder);
router.post('/verify-payment', authenticateToken, verifyPayment);

export default router;
