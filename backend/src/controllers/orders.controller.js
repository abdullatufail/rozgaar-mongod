import Order from '../models/order.model.js';
import Gig from '../models/gig.model.js';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import Message from '../models/message.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { gigId, requirements } = req.body;
    
    // Validate required fields
    if (!gigId || !requirements) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Validate that user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create orders' });
    }
    
    // Find the gig
    let gig;
    try {
      gig = await Gig.findById(gigId);
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ 
          message: 'Invalid gig ID format. MongoDB requires a valid 24-character hex string.',
          error: 'INVALID_ID_FORMAT'
        });
      }
      throw error;
    }
    
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    
    // Verify client has enough balance
    const client = await User.findById(req.user._id);
    if (client.balance < gig.price) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        required: gig.price,
        current: client.balance
      });
    }
    
    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + gig.durationDays);
    
    // Create order
    const order = await Order.create({
      gigId,
      clientId: req.user._id,
      freelancerId: gig.freelancerId,
      status: 'pending',
      price: gig.price,
      requirements,
      dueDate
    });
    
    // Deduct client balance
    await User.findByIdAndUpdate(req.user._id, { $inc: { balance: -gig.price } });
    
    // Populate relevant fields
    const populatedOrder = await Order.findById(order._id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders for current user (client or freelancer)
export const getOrders = async (req, res) => {
  try {
    let orders;
    
    if (req.user.role === 'client') {
      // Clients see their orders
      orders = await Order.find({ clientId: req.user._id })
        .populate('gig', 'title')
        .populate('client', 'name')
        .populate('freelancer', 'name')
        .populate('review');
    } else if (req.user.role === 'freelancer') {
      // Freelancers see orders assigned to them
      orders = await Order.find({ freelancerId: req.user._id })
        .populate('gig', 'title')
        .populate('client', 'name')
        .populate('freelancer', 'name')
        .populate('review');
    }
    
    // Check orders for late status
    const currentDate = new Date();
    for (let order of orders) {
      if (order.status === 'in_progress' && order.dueDate && new Date(order.dueDate) < currentDate) {
        order.isLate = true;
        order.status = 'late';
        await order.save();
      }
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single order by ID
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .populate('review');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is associated with the order
    if (
      order.clientId.toString() !== req.user._id.toString() && 
      order.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    // Check if order is late
    const currentDate = new Date();
    if (order.status === 'in_progress' && order.dueDate && new Date(order.dueDate) < currentDate) {
      order.isLate = true;
      order.status = 'late';
      await order.save();
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is associated with the order
    if (
      order.clientId.toString() !== req.user._id.toString() && 
      order.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    // Apply status change logic
    if (status === 'in_progress' && order.status === 'pending') {
      // Freelancer started working on the order
      if (req.user._id.toString() !== order.freelancerId.toString()) {
        return res.status(403).json({ message: 'Only the freelancer can start working on the order' });
      }
    } else if (status === 'cancelled') {
      // Return funds to client if cancelling
      await User.findByIdAndUpdate(order.clientId, { $inc: { balance: order.price } });
    }
    
    // Update order
    order.status = status;
    await order.save();
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .populate('review');
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Deliver order
export const deliverOrder = async (req, res) => {
  try {
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is the freelancer
    if (req.user._id.toString() !== order.freelancerId.toString()) {
      return res.status(403).json({ message: 'Only the freelancer can deliver this order' });
    }
    
    // Check if order is in progress
    if (order.status !== 'in_progress' && order.status !== 'late') {
      return res.status(400).json({ message: `Cannot deliver an order with status: ${order.status}` });
    }
    
    // Save file if provided
    let deliveryFile = order.deliveryFile;
    if (req.file) {
      deliveryFile = `/uploads/${req.file.filename}`;
    }
    
    // Update order
    order.status = 'delivered';
    order.deliveryFile = deliveryFile;
    order.deliveryNotes = req.body.notes || '';
    await order.save();
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .populate('review');
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Deliver order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve delivery
export const approveDelivery = async (req, res) => {
  try {
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is the client
    if (req.user._id.toString() !== order.clientId.toString()) {
      return res.status(403).json({ message: 'Only the client can approve this delivery' });
    }
    
    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Cannot approve delivery for an order that has not been delivered' });
    }
    
    // Update order status
    order.status = 'completed';
    await order.save();
    
    // Transfer payment to freelancer
    await User.findByIdAndUpdate(order.freelancerId, { $inc: { balance: order.price } });
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .populate('review');
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Approve delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject delivery
export const rejectDelivery = async (req, res) => {
  try {
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is the client
    if (req.user._id.toString() !== order.clientId.toString()) {
      return res.status(403).json({ message: 'Only the client can reject this delivery' });
    }
    
    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Cannot reject delivery for an order that has not been delivered' });
    }
    
    // Update order status back to in_progress
    order.status = 'in_progress';
    await order.save();
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .populate('review');
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Reject delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request cancellation
export const requestCancellation = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Please provide a reason for cancellation' });
    }
    
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is associated with the order
    if (
      order.clientId.toString() !== req.user._id.toString() && 
      order.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to request cancellation for this order' });
    }
    
    // Check if order can be cancelled
    if (['completed', 'cancelled', 'cancellation_requested'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot request cancellation for an order with status: ${order.status}` });
    }
    
    // Update order
    order.status = 'cancellation_requested';
    order.cancellationReason = reason;
    order.cancellationRequestedBy = req.user._id;
    await order.save();
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .populate('review');
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Request cancellation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve cancellation
export const approveCancellation = async (req, res) => {
  try {
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is associated with the order
    if (
      order.clientId.toString() !== req.user._id.toString() && 
      order.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to approve cancellation for this order' });
    }
    
    // Verify cancellation was not requested by current user (need approval from the other party)
    if (order.cancellationRequestedBy && order.cancellationRequestedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot approve your own cancellation request' });
    }
    
    // Check if order has a cancellation request
    if (order.status !== 'cancellation_requested') {
      return res.status(400).json({ message: 'No cancellation request to approve' });
    }
    
    // Update order
    order.status = 'cancelled';
    order.cancellationApproved = true;
    await order.save();
    
    // Return funds to client
    await User.findByIdAndUpdate(order.clientId, { $inc: { balance: order.price } });
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .populate('review');
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Approve cancellation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject cancellation
export const rejectCancellation = async (req, res) => {
  try {
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is associated with the order
    if (
      order.clientId.toString() !== req.user._id.toString() && 
      order.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to reject cancellation for this order' });
    }
    
    // Verify cancellation was not requested by current user
    if (order.cancellationRequestedBy && order.cancellationRequestedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot reject your own cancellation request' });
    }
    
    // Check if order has a cancellation request
    if (order.status !== 'cancellation_requested') {
      return res.status(400).json({ message: 'No cancellation request to reject' });
    }
    
    // Restore previous status (default to in_progress)
    order.status = 'in_progress';
    order.cancellationReason = null;
    order.cancellationRequestedBy = null;
    await order.save();
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('gig', 'title')
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .populate('review');
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Reject cancellation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add review to order
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating (1-5)' });
    }
    
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is the client
    if (req.user._id.toString() !== order.clientId.toString()) {
      return res.status(403).json({ message: 'Only the client can review this order' });
    }
    
    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot review an order that is not completed' });
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({ orderId: order._id });
    if (existingReview) {
      return res.status(400).json({ message: 'Order has already been reviewed' });
    }
    
    // Create review
    const review = await Review.create({
      orderId: order._id,
      rating,
      comment
    });
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get freelancer reviews
export const getFreelancerReviews = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;
    
    // Get all completed orders for this freelancer
    const orders = await Order.find({ 
      freelancerId, 
      status: 'completed' 
    });
    
    const orderIds = orders.map(order => order._id);
    
    // Get reviews for these orders
    const reviews = await Review.find({ 
      orderId: { $in: orderIds } 
    }).populate({
      path: 'order',
      select: 'gigId clientId',
      populate: [
        { path: 'client', select: 'name' },
        { path: 'gig', select: 'title' }
      ]
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Get freelancer reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get gig reviews
export const getGigReviews = async (req, res) => {
  try {
    const gigId = req.params.gigId;
    
    // Get all completed orders for this gig
    const orders = await Order.find({ 
      gigId, 
      status: 'completed' 
    });
    
    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }
    
    const orderIds = orders.map(order => order._id);
    
    // Get reviews for these orders
    const reviews = await Review.find({ 
      orderId: { $in: orderIds } 
    }).populate({
      path: 'orderId',
      select: 'clientId',
      populate: {
        path: 'clientId',
        model: 'User',
        select: 'name'
      }
    });
    
    // Format the reviews for the frontend
    const formattedReviews = reviews.map(review => {
      return {
        id: review._id,
        orderId: review.orderId._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        client: {
          name: review.orderId.clientId.name
        }
      };
    });
    
    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error('Get gig reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add message to order
export const addMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is associated with the order
    if (
      order.clientId.toString() !== req.user._id.toString() && 
      order.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to send messages for this order' });
    }
    
    // Create message
    const message = await Message.create({
      orderId: order._id,
      senderId: req.user._id,
      content
    });
    
    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for an order
export const getOrderMessages = async (req, res) => {
  try {
    // Find order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify user is associated with the order
    if (
      order.clientId.toString() !== req.user._id.toString() && 
      order.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view messages for this order' });
    }
    
    // Get messages
    const messages = await Message.find({ orderId: order._id })
      .sort('createdAt')
      .populate('sender', 'name');
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Get order messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 