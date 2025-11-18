import express from 'express';
import Worker from '../models/Worker.js';
import User from '../models/User.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all verified workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find({ verification_status: 'verified' })
      .populate('user_id', 'full_name phone email avatar_url')
      .sort({ created_at: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all workers (admin only)
router.get('/all', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate('user_id', 'full_name phone email avatar_url')
      .sort({ created_at: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available workers for a service category
router.get('/available/:category', async (req, res) => {
  try {
    const workers = await Worker.find({
      verification_status: 'verified',
      availability_status: 'available',
      skills: { $in: [req.params.category] }
    })
      .populate('user_id', 'full_name phone email avatar_url')
      .sort({ rating: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get worker by ID
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user_id', 'full_name phone email avatar_url');
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update worker verification (admin only)
router.patch('/:id/verification', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { verification_status } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(verification_status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }
    
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { verification_status },
      { new: true }
    ).populate('user_id', 'full_name phone email avatar_url');
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    
    res.json(worker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update worker profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    
    // Check if user owns this worker profile
    if (worker.user_id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    Object.assign(worker, req.body);
    await worker.save();
    
    const updatedWorker = await Worker.findById(req.params.id)
      .populate('user_id', 'full_name phone email avatar_url');
    
    res.json(updatedWorker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

