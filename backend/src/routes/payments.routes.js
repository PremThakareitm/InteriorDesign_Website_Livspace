import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Store orders and payments in memory (in a real app, this would be in a database)
const orders = new Map();
const payments = new Map();

// Razorpay test keys
const RAZORPAY_KEY_ID = 'rzp_test_kabcAk4bD3sobU';
const RAZORPAY_KEY_SECRET = '3IKoyNSqceBX3RTEwhnxMrsC';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

// Utility functions
const generateSignature = (orderId, paymentId, razorpaySignature) => {
  const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
  hmac.update(orderId + '|' + paymentId);
  return hmac.digest('hex');
};

// Get order status
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      details: error.message
    });
  }
});

// Create a new order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount, receipt, currency = 'INR', notes = {} } = req.body;

    logger.info('Creating order with data:', { amount, receipt, currency, notes });

    // Validate required fields
    if (!amount || !receipt) {
      logger.error('Missing required fields:', { amount, receipt });
      return res.status(400).json({
        success: false,
        error: 'Amount and receipt are required'
      });
    }

    // Validate amount
    if (amount <= 0 || !Number.isInteger(amount)) {
      logger.error('Invalid amount:', amount);
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive integer'
      });
    }

    // Create Razorpay order options
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer
      currency,
      receipt,
      notes: {
        ...notes,
        user_id: req.user._id.toString(),
        mode: 'test'
      },
      payment_capture: 1 // Auto-capture payment
    };

    logger.info('Creating Razorpay order with options:', orderOptions);

    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create(orderOptions);
    
    logger.info('Razorpay order created:', razorpayOrder);

    // Create order object
    const order = {
      id: razorpayOrder.id,
      amount,
      currency,
      receipt,
      notes,
      status: razorpayOrder.status,
      attempts: 0,
      created_at: new Date(),
      user_id: req.user._id
    };

    // Store order
    orders.set(razorpayOrder.id, order);
    logger.info('Order stored in memory:', order);

    res.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: Math.round(amount * 100), // Send amount in paise to frontend
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
        notes: razorpayOrder.notes
      }
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
      details: error.message
    });
  }
});

// Verify payment
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    logger.info('Verifying payment:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature
    });

    // Get order from memory
    const order = orders.get(razorpay_order_id);
    if (!order) {
      logger.error('Order not found:', razorpay_order_id);
      return res.status(400).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Verify that the order belongs to the current user
    if (order.user_id.toString() !== req.user._id.toString()) {
      logger.error('Order does not belong to user:', {
        order_user: order.user_id,
        current_user: req.user._id
      });
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to order'
      });
    }

    // Create signature verification data
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const secret = '3IKoyNSqceBX3RTEwhnxMrsC';
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    logger.info('Verifying signature:', {
      received: razorpay_signature,
      generated: generated_signature
    });

    // Verify signature
    if (generated_signature === razorpay_signature) {
      // Update order status
      order.status = 'paid';
      order.payment_id = razorpay_payment_id;
      order.signature = razorpay_signature;
      order.updated_at = new Date();

      logger.info('Payment verified successfully:', order);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order: {
          id: order.id,
          status: order.status,
          amount: order.amount,
          currency: order.currency
        }
      });
    } else {
      logger.error('Payment verification failed - Invalid signature');
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    logger.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment',
      details: error.message
    });
  }
});

// Get payment status
router.get('/payment/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = payments.get(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Check if payment belongs to user
    if (payment.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to payment'
      });
    }

    res.json({
      success: true,
      payment: {
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        created_at: payment.created_at,
        completed_at: payment.completed_at,
        signature: payment.signature
      }
    });
  } catch (error) {
    logger.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment',
      details: error.message
    });
  }
});

export default router;
