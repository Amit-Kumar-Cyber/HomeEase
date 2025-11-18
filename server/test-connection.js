import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

console.log('🔍 Testing MongoDB connection...');
console.log('📍 Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

// URL encode password if needed
let uri = MONGODB_URI;
if (uri.includes('mongodb+srv://')) {
  try {
    const uriMatch = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@(.+)/);
    if (uriMatch) {
      const username = uriMatch[1];
      const password = uriMatch[2];
      const rest = uriMatch[3];
      const encodedPassword = encodeURIComponent(password);
      uri = `mongodb+srv://${username}:${encodedPassword}@${rest}`;
      console.log('🔐 Password encoded for special characters');
    }
  } catch (err) {
    console.warn('⚠️  Could not encode URI');
  }
}

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ CONNECTION FAILED');
    console.error('Error:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.error('\n🔴 ROOT CAUSE: Authentication Failed');
      console.error('\n📋 Solutions:');
      console.error('1. Go to MongoDB Atlas → Database Access');
      console.error('2. Verify username "Amit" exists');
      console.error('3. Click "Edit" on the user and reset the password');
      console.error('4. Update the password in your .env file');
      console.error('5. Make sure password has no spaces or special characters that need encoding');
      console.error('\n6. Check Network Access:');
      console.error('   - Go to MongoDB Atlas → Network Access');
      console.error('   - Click "Add IP Address"');
      console.error('   - Add "0.0.0.0/0" for development (or your specific IP)');
      console.error('   - Click "Confirm"');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n🔴 ROOT CAUSE: Network/DNS Issue');
      console.error('Check your internet connection and cluster URL');
    } else {
      console.error('\n🔴 ROOT CAUSE:', error.codeName || 'Unknown');
    }
    
    process.exit(1);
  });

