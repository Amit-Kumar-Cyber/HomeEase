import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import serviceRoutes from './routes/services.js';
import workerRoutes from './routes/workers.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homeease';

// URL encode the password if it contains special characters
if (MONGODB_URI.includes('mongodb+srv://')) {
  try {
    // Extract and encode password from connection string
    const uriMatch = MONGODB_URI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@(.+)/);
    if (uriMatch) {
      const username = uriMatch[1];
      const password = uriMatch[2];
      const rest = uriMatch[3];
      
      // URL encode the password to handle special characters
      const encodedPassword = encodeURIComponent(password);
      MONGODB_URI = `mongodb+srv://${username}:${encodedPassword}@${rest}`;
    }
  } catch (err) {
    console.warn('Could not encode MongoDB URI, using original');
  }
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n🔍 Troubleshooting steps:');
    console.error('1. Verify username and password in MongoDB Atlas → Database Access');
    console.error('2. Check Network Access in MongoDB Atlas (add your IP or 0.0.0.0/0)');
    console.error('3. Ensure the database user has read/write permissions');
    console.error('4. Try creating a new database user in MongoDB Atlas');
    console.error('\n📝 Connection string format:');
    console.error('   mongodb+srv://username:password@cluster.mongodb.net/databaseName');
    console.error('\n💡 Tip: Get the connection string from MongoDB Atlas → Connect → Drivers');
    process.exit(1); // Exit on connection failure
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HomeEase API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

