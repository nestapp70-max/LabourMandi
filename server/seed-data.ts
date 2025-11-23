import { dbStorage } from './db-storage';

// Check if we should seed
async function shouldSeed() {
  try {
    // Use the db storage
    const existingUser = await dbStorage.getUserByPhone('9876543210');
    return !existingUser; // Seed only if no existing data
  } catch (error) {
    // If there's an error, we might not have DB setup, skip seeding
    console.warn('Seed check failed, skipping seed:', error);
    return false;
  }
}

export async function seedDatabase() {
  console.log('🌱 Checking if database needs seeding...');

  // Only seed if database is empty
  const needsSeeding = await shouldSeed();
  if (!needsSeeding) {
    console.log('✓ Database already seeded, skipping');
    return;
  }

  console.log('🌱 Seeding database with sample data...');

  try {
    const storage = dbStorage;
    // Create sample customers
    const customer1 = await storage.createUser({
      name: 'Rajesh Kumar',
      phone: '9876543210',
      role: 'customer',
    });

    const customer2 = await storage.createUser({
      name: 'Priya Sharma',
      phone: '9876543211',
      role: 'customer',
    });

    // Create sample technicians with users
    const techUser1 = await storage.createUser({
      name: 'Ramesh Patel',
      phone: '9876543212',
      role: 'technician',
    });

    const tech1 = await storage.createTechnician({
      userId: techUser1.id,
      skills: ['Electrician', 'AC Repair', 'Wiring'],
      experience: 8,
      location: 'Mumbai, Maharashtra',
      pinCode: '400001',
      bio: 'Experienced electrician with 8 years of expertise in residential and commercial electrical work. Specialized in AC installation and repair.',
      email: 'ramesh.patel@email.com',
      isAvailable: true,
      profileImage: null,
    });

    await storage.updateTechnicianRating(tech1.id, '4.7', 23);

    const techUser2 = await storage.createUser({
      name: 'Suresh Verma',
      phone: '9876543213',
      role: 'technician',
    });

    const tech2 = await storage.createTechnician({
      userId: techUser2.id,
      skills: ['Plumber', 'Pipe Fitting', 'Water Tank Repair'],
      experience: 5,
      location: 'Delhi NCR',
      pinCode: '110001',
      bio: 'Certified plumber providing quality plumbing services. Expert in leak detection and water tank installation.',
      email: 'suresh.verma@email.com',
      isAvailable: true,
      profileImage: null,
    });

    await storage.updateTechnicianRating(tech2.id, '4.9', 45);

    const techUser3 = await storage.createUser({
      name: 'Amit Singh',
      phone: '9876543214',
      role: 'technician',
    });

    const tech3 = await storage.createTechnician({
      userId: techUser3.id,
      skills: ['Carpenter', 'Furniture Making', 'Wood Polishing'],
      experience: 12,
      location: 'Bangalore, Karnataka',
      pinCode: '560001',
      bio: 'Master carpenter with over a decade of experience in custom furniture and woodwork.',
      email: 'amit.singh@email.com',
      isAvailable: true,
      profileImage: null,
    });

    await storage.updateTechnicianRating(tech3.id, '4.8', 67);

    const techUser4 = await storage.createUser({
      name: 'Vijay Kumar',
      phone: '9876543215',
      role: 'technician',
    });

    const tech4 = await storage.createTechnician({
      userId: techUser4.id,
      skills: ['Painter', 'Wall Painting', 'POP Work'],
      experience: 6,
      location: 'Pune, Maharashtra',
      pinCode: '411001',
      bio: 'Professional painter specializing in interior and exterior painting with attention to detail.',
      email: 'vijay.kumar@email.com',
      isAvailable: true,
      profileImage: null,
    });

    await storage.updateTechnicianRating(tech4.id, '4.6', 34);

    const techUser5 = await storage.createUser({
      name: 'Mohammed Rizwan',
      phone: '9876543216',
      role: 'technician',
    });

    const tech5 = await storage.createTechnician({
      userId: techUser5.id,
      skills: ['Mason', 'Tile Work', 'Plastering'],
      experience: 10,
      location: 'Hyderabad, Telangana',
      pinCode: '500001',
      bio: 'Skilled mason with expertise in tile work and plastering. Quality work guaranteed.',
      email: 'mohammed.rizwan@email.com',
      isAvailable: true,
      profileImage: null,
    });

    await storage.updateTechnicianRating(tech5.id, '4.7', 52);

    // Create sample jobs
    const job1 = await storage.createJob({
      customerId: customer1.id,
      title: 'AC Installation Needed',
      description: 'Need to install 2 split ACs in my apartment. Looking for experienced technician.',
      category: 'ac-tech',
      budget: '5000',
      location: 'Andheri, Mumbai',
      pinCode: '400053',
    });

    const job2 = await storage.createJob({
      customerId: customer2.id,
      title: 'Kitchen Plumbing Repair',
      description: 'Leaking tap and clogged drain in kitchen. Need immediate attention.',
      category: 'plumber',
      budget: '2000',
      location: 'Connaught Place, Delhi',
      pinCode: '110001',
    });

    const job3 = await storage.createJob({
      customerId: customer1.id,
      title: 'Furniture Assembly',
      description: 'Need carpenter to assemble new furniture set. Wardrobe and bed.',
      category: 'carpenter',
      budget: '3000',
      location: 'Bandra, Mumbai',
      pinCode: '400050',
    });

    // Create sample bids
    await storage.createBid({
      jobId: job1.id,
      technicianId: tech1.id,
      amount: '4500',
      message: 'I have 8 years of experience in AC installation. Can complete the work in 1 day with quality materials.',
    });

    await storage.createBid({
      jobId: job2.id,
      technicianId: tech2.id,
      amount: '1800',
      message: 'I can fix your plumbing issue today itself. Have all necessary tools and spare parts.',
    });

    await storage.createBid({
      jobId: job3.id,
      technicianId: tech3.id,
      amount: '2800',
      message: 'Expert in furniture assembly. Will ensure everything is properly aligned and stable.',
    });

    // Add wallet balance to customers for testing
    await storage.updateUserWallet(customer1.id, '500.00');
    await storage.updateUserWallet(customer2.id, '300.00');

    console.log('✅ Database seeded successfully!');
    console.log(`   - ${5} technicians created`);
    console.log(`   - ${2} customers created`);
    console.log(`   - ${3} jobs posted`);
    console.log(`   - ${3} bids placed`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}
