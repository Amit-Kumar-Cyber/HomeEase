import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings (admin only)
router.get('/all', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service_id')
      .populate('user_id', 'full_name phone email')
      .populate({
        path: 'worker_id',
        populate: { path: 'user_id', select: 'full_name phone email' }
      })
      .sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.userId })
      .populate('service_id')
      .sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get worker's bookings
router.get('/my-jobs', authenticate, async (req, res) => {
  try {
    const worker = await Worker.findOne({ user_id: req.userId });
    if (!worker) {
      return res.status(404).json({ error: 'Worker profile not found' });
    }
    
    const bookings = await Booking.find({ worker_id: worker._id })
      .populate('service_id')
      .populate('user_id', 'full_name phone email')
      .sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service_id')
      .populate('user_id', 'full_name phone email')
      .populate({
        path: 'worker_id',
        populate: { path: 'user_id', select: 'full_name phone email' }
      });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check permissions
    const user = await User.findById(req.userId);
    const isOwner = booking.user_id._id.toString() === req.userId;
    const isWorker = booking.worker_id && booking.worker_id.user_id._id.toString() === req.userId;
    const isAdmin = user.role === 'admin';
    
    if (!isOwner && !isWorker && !isAdmin) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', authenticate, async (req, res) => {
  try {
    const { service_id, worker_id, booking_date, booking_time, address, notes } = req.body;
    
    const service = await Service.findById(service_id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const booking = new Booking({
      user_id: req.userId,
      worker_id: worker_id || null,
      service_id,
      booking_date: new Date(booking_date),
      booking_time,
      address,
      notes: notes || null,
      total_amount: service.base_price,
      status: 'pending'
    });
    
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('service_id')
      .populate('user_id', 'full_name phone email');
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const user = await User.findById(req.userId);
    const isOwner = booking.user_id.toString() === req.userId;
    
    // Check if user is the assigned worker
    let isWorker = false;
    if (booking.worker_id) {
      const worker = await Worker.findById(booking.worker_id);
      if (worker && worker.user_id.toString() === req.userId) {
        isWorker = true;
      }
    }
    
    const isAdmin = user.role === 'admin';
    
    // Users can only cancel pending bookings
    if (status === 'cancelled' && isOwner && booking.status === 'pending') {
      booking.status = 'cancelled';
      await booking.save();
      
      const populatedBooking = await Booking.findById(booking._id)
        .populate('service_id')
        .populate('user_id', 'full_name phone email');
      
      return res.json(populatedBooking);
    }
    
    // Workers can update status of their bookings
    if (isWorker || isAdmin) {
      booking.status = status;
      await booking.save();
      
      const populatedBooking = await Booking.findById(booking._id)
        .populate('service_id')
        .populate('user_id', 'full_name phone email');
      
      return res.json(populatedBooking);
    }
    
    return res.status(403).json({ error: 'Insufficient permissions' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

