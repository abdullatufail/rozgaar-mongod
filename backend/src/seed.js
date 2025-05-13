import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import Gig from './models/gig.model.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rozgaardb')
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Gig.deleteMany({});

    // Create users
    const freelancer1Password = await bcrypt.hash('freelancer123', 10);
    const freelancer2Password = await bcrypt.hash('freelancer456', 10);
    const clientPassword = await bcrypt.hash('client123', 10);
    
    const freelancer1 = await User.create({
      name: 'Freelancer One',
      email: 'freelancer@rozgaar.com',
      password: freelancer1Password,
      role: 'freelancer',
      balance: 500,
      skills: ['Web Development', 'JavaScript', 'React']
    });
    
    const freelancer2 = await User.create({
      name: 'Freelancer Two', 
      email: 'freelancer2@rozgaar.com',
      password: freelancer2Password,
      role: 'freelancer',
      balance: 1000,
      skills: ['Mobile Development', 'React Native', 'Flutter']
    });
    
    const client = await User.create({
      name: 'Client User',
      email: 'client@rozgaar.com',
      password: clientPassword,
      role: 'client',
      balance: 2000
    });
    
    // Create gigs
    const gigs = [
      {
        title: 'Professional Website Development',
        description: 'I will create a responsive, modern website using React and Next.js with Tailwind CSS.',
        price: 250,
        category: 'Web Development',
        image: 'https://placehold.co/600x400',
        durationDays: 7,
        freelancerId: freelancer1._id,
        rating: 4.8,
        totalReviews: 12
      },
      {
        title: 'Mobile App Development',
        description: 'Full-featured mobile app for iOS and Android using React Native with custom designs.',
        price: 500,
        category: 'Mobile Development',
        image: 'https://placehold.co/600x400',
        durationDays: 14,
        freelancerId: freelancer2._id,
        rating: 4.5,
        totalReviews: 8
      },
      {
        title: 'Logo Design',
        description: 'Professional logo design with unlimited revisions and all source files included.',
        price: 100,
        category: 'Graphic Design',
        image: 'https://placehold.co/600x400',
        durationDays: 3,
        freelancerId: freelancer1._id,
        rating: 4.9,
        totalReviews: 15
      }
    ];
    
    await Gig.insertMany(gigs);
    
    console.log('Database seeded successfully!');
    console.log('-----------------------------');
    console.log('Freelancer One:');
    console.log('Email: freelancer@rozgaar.com');
    console.log('Password: freelancer123');
    console.log('');
    console.log('Freelancer Two:');
    console.log('Email: freelancer2@rozgaar.com');
    console.log('Password: freelancer456');
    console.log('');
    console.log('Client User:');
    console.log('Email: client@rozgaar.com');
    console.log('Password: client123');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 