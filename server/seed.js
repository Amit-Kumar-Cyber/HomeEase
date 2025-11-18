import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Service from './models/Service.js';
import Worker from './models/Worker.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const services = [
  {
    name: 'Plumbing',
    description: 'Fix leaks, install fixtures, repair pipes and drains',
    image_url: 'https://trusteyman.com/wp-content/uploads/2019/02/how-does-plumbing-work-e1548696261445.jpeg',
    base_price: 749,
    category: 'Home Repair',
    is_active: true
  },
  {
    name: 'Electrical Work',
    description: 'Wiring, circuit repairs, outlet installation, electrical troubleshooting',
    image_url: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
    base_price: 899,
    category: 'Home Repair',
    is_active: true
  },
  {
    name: 'Carpentry',
    description: 'Furniture assembly, woodwork, cabinet installation',
    image_url: 'https://images.pexels.com/photos/5974396/pexels-photo-5974396.jpeg?auto=compress&cs=tinysrgb&w=400',
    base_price: 649,
    category: 'Home Improvement',
    is_active: true
  },
  {
    name: 'House Cleaning',
    description: 'Deep cleaning, regular maintenance, sanitization',
    image_url: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400',
    base_price: 599,
    category: 'Cleaning',
    is_active: true
  },
  {
    name: 'Appliance Repair',
    description: 'Fix refrigerators, washing machines, ovens, and more',
    image_url: 'https://images.pexels.com/photos/4792382/pexels-photo-4792382.jpeg?auto=compress&cs=tinysrgb&w=400',
    base_price: 799,
    category: 'Repair',
    is_active: true
  },
  {
    name: 'Painting',
    description: 'Interior and exterior painting, wall preparation',
    image_url: 'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=400',
    base_price: 699,
    category: 'Home Improvement',
    is_active: true
  },
  {
    name: 'HVAC Service',
    description: 'AC installation, repair, and maintenance',
    image_url: 'https://images.pexels.com/photos/8853502/pexels-photo-8853502.jpeg?auto=compress&cs=tinysrgb&w=400',
    base_price: 999,
    category: 'Home Repair',
    is_active: true
  },
  {
    name: 'Pest Control',
    description: 'Termite treatment, rodent control, general pest management',
    image_url: 'https://images.pexels.com/photos/6013501/pexels-photo-6013501.jpeg?auto=compress&cs=tinysrgb&w=400',
    base_price: 629,
    category: 'Maintenance',
    is_active: true
  }
];

const testUsers = [
  {
    email: 'user@test.com',
    password: 'password123',
    full_name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    address: '123 Main Street, Mumbai, Maharashtra',
    role: 'user'
  },
  {
    email: 'worker@test.com',
    password: 'password123',
    full_name: 'Amit Singh',
    phone: '+91 98765 43211',
    address: '456 Worker Lane, Delhi, Delhi',
    role: 'worker'
  },
  {
    email: 'admin@test.com',
    password: 'password123',
    full_name: 'Priya Sharma',
    phone: '+91 98765 43212',
    address: '789 Admin Avenue, Bangalore, Karnataka',
    role: 'admin'
  }
];

async function seed() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await Service.deleteMany({});
    await User.deleteMany({});
    await Worker.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert services
    console.log('\n📦 Seeding services...');
    await Service.insertMany(services);
    console.log(`✅ Seeded ${services.length} services`);

    // Insert test users
    console.log('\n👥 Seeding test users...');
    const createdUsers = [];
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        createdUsers.push(existingUser);
      } else {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      }
    }

    // Create worker profile for worker user
    console.log('\n🔧 Creating worker profile...');
    const workerUser = createdUsers.find(u => u.role === 'worker');
    if (workerUser) {
      const existingWorker = await Worker.findOne({ user_id: workerUser._id });
      if (!existingWorker) {
        const worker = new Worker({
          user_id: workerUser._id,
          skills: ['Home Repair', 'Electrical Work', 'Plumbing'],
          rating: 4.5,
          total_jobs: 25,
          availability_status: 'available',
          hourly_rate: 300,
          bio: 'Experienced professional with 5+ years in home services',
          verification_status: 'verified'
        });
        await worker.save();
        console.log('✅ Created worker profile for worker@test.com');
      } else {
        console.log('⚠️  Worker profile already exists');
      }
    }

    console.log('\n📋 Test Account Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`\n${user.role.toUpperCase()}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: password123`);
      console.log(`  Name: ${user.full_name}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

