import express from 'express';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Worker from '../models/Worker.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a worker
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ worker_id: req.params.workerId })
      .populate('user_id', 'full_name')
      .populate('booking_id')
      .sort({ created_at: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;
    
    // Check if booking exists and is completed
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.user_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'You can only review your own bookings' });
    }
    
    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({ booking_id });
    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this booking' });
    }
    
    const review = new Review({
      booking_id,
      user_id: req.userId,
      worker_id: booking.worker_id,
      rating,
      comment: comment || null
    });
    
    await review.save();
    
    // Update worker rating
    const reviews = await Review.find({ worker_id: booking.worker_id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Worker.findByIdAndUpdate(booking.worker_id, {
      rating: avgRating
    });
    
    const populatedReview = await Review.findById(review._id)
      .populate('user_id', 'full_name')
      .populate('booking_id');
    
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update review
router.put('/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (review.user_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    Object.assign(review, req.body);
    await review.save();
    
    // Update worker rating
    const reviews = await Review.find({ worker_id: review.worker_id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Worker.findByIdAndUpdate(review.worker_id, {
      rating: avgRating
    });
    
    const populatedReview = await Review.findById(review._id)
      .populate('user_id', 'full_name')
      .populate('booking_id');
    
    res.json(populatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

