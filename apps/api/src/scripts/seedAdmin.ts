import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { User } from '../models/User';
import { logger } from '../utils/logger';

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: config.ADMIN_EMAIL || 'admin@donationhub.com' });
    if (existingAdmin) {
      logger.info('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Admin User',
      email: config.ADMIN_EMAIL || 'admin@donationhub.com',
      passwordHash: config.ADMIN_PASSWORD || 'admin123',
      role: 'admin' as const
    };

    const admin = new User(adminData);
    await admin.save();

    logger.info('Admin user created successfully:', {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed admin user:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedAdmin();
}

export default seedAdmin;

