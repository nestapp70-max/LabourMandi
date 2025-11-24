import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { InsertUser, InsertTechnicianProfile, InsertJob, InsertBid } from "@shared/schema";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Auth middleware
const authenticate = async (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = await storage.getSession(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = user;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ AUTH ROUTES ============
  
  // POST /api/auth/signup - Create new user account
  app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
      const { userType, phone, name, email, city, pin, bio, category, subcategories, yearsExperience, dailyWage, hourlyWage, certifications, whatsappNumber } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this phone number already exists' });
      }

      // Create user with avatar
      const user = await storage.createUser({
        phone,
        name,
        email: email || null,
        userType,
        city: city || null,
        pin: pin || null,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}&scale=80`,
        bio: bio || null,
        isOnline: true,
        walletBalance: 100, // Start with ₹100 for demo
      });

      // If technician, create profile
      if (userType === 'technician' && category) {
        await storage.createTechnicianProfile({
          userId: user.id,
          category,
          subcategories: subcategories || [],
          yearsExperience: parseInt(yearsExperience) || null,
          dailyWage: parseInt(dailyWage) || null,
          hourlyWage: parseInt(hourlyWage) || null,
          rating: 45,
          certifications: certifications || null,
          whatsappNumber: whatsappNumber || phone,
          whatsappUnlockedBy: [],
          socialLinks: null,
        });
      }

      // Create session
      const token = await storage.createSession(user.id);

      res.json({ ...user, token });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  });

  // POST /api/auth/signin - Start OTP flow
  app.post('/api/auth/signin', async (req: Request, res: Response) => {
    try {
      const { phone } = req.body;

      // Generate mock OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await storage.createOtp(phone, otp);

      console.log(`🔐 Mock OTP for ${phone}: ${otp}`);
      
      res.json({ success: true, message: 'OTP sent', mockOtp: otp });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  });

  // POST /api/auth/verify-otp - Verify OTP and sign in
  app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
    try {
      const { phone, otp } = req.body;

      const isValid = await storage.verifyOtp(phone, otp);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(404).json({ error: 'User not found. Please sign up first.' });
      }

      // Update user online status
      await storage.updateUser(user.id, { isOnline: true });

      // Create session
      const token = await storage.createSession(user.id);

      res.json({ ...user, token });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  });

  // ============ USER ROUTES ============
  
  // GET /api/users/me - Get current user
  app.get('/api/users/me', authenticate, async (req: Request, res: Response) => {
    res.json(req.user);
  });

  // PATCH /api/users/profile - Update user profile
  app.patch('/api/users/profile', authenticate, async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const updatedUser = await storage.updateUser(req.user.id, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // ============ TECHNICIAN ROUTES ============
  
  // GET /api/technicians - List technicians with filters
  app.get('/api/technicians', async (req: Request, res: Response) => {
    try {
      const { category, pin, search, online } = req.query;

      // Get all technician users
      const allUsers = await storage.getAllUsers();
      const technicianUsers = allUsers.filter(u => u.userType === 'technician');

      // Get profiles and portfolios for each technician
      const technicians = await Promise.all(
        technicianUsers.map(async (user) => {
          const profile = await storage.getTechnicianProfile(user.id);
          const portfolio = await storage.getPortfolioItems(user.id);
          return { ...user, profile, portfolio };
        })
      );

      // Apply filters
      let filtered = technicians.filter(t => t.profile); // Only include those with profiles

      if (category && category !== 'all') {
        filtered = filtered.filter(t => t.profile?.category?.toLowerCase().includes(category.toString().toLowerCase()));
      }

      if (pin) {
        filtered = filtered.filter(t => t.pin === pin);
      }

      if (search) {
        const searchLower = search.toString().toLowerCase();
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.city?.toLowerCase().includes(searchLower) ||
          t.profile?.category?.toLowerCase().includes(searchLower)
        );
      }

      if (online === 'true') {
        filtered = filtered.filter(t => t.isOnline);
      }

      res.json(filtered);
    } catch (error) {
      console.error('Get technicians error:', error);
      res.status(500).json({ error: 'Failed to fetch technicians' });
    }
  });

  // GET /api/technicians/:id - Get technician by ID
  app.get('/api/technicians/:id', async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user || user.userType !== 'technician') {
        return res.status(404).json({ error: 'Technician not found' });
      }

      const profile = await storage.getTechnicianProfile(user.id);
      const portfolio = await storage.getPortfolioItems(user.id);

      res.json({ ...user, profile, portfolio });
    } catch (error) {
      console.error('Get technician error:', error);
      res.status(500).json({ error: 'Failed to fetch technician' });
    }
  });

  // ============ JOB ROUTES ============
  
  // GET /api/jobs - List all jobs
  app.get('/api/jobs', async (req: Request, res: Response) => {
    try {
      const allJobs = await storage.getAllJobs();

      // Populate customer and bids for each job
      const jobsWithDetails = await Promise.all(
        allJobs.map(async (job) => {
          const customer = await storage.getUser(job.customerId);
          const jobBids = await storage.getBidsByJob(job.id);
          
          // Get technician details for each bid
          const bidsWithTechnicians = await Promise.all(
            jobBids.map(async (bid) => {
              const technician = await storage.getUser(bid.technicianId);
              return { ...bid, technician };
            })
          );

          return { ...job, customer, bids: bidsWithTechnicians };
        })
      );

      // Sort by newest first
      jobsWithDetails.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      res.json(jobsWithDetails);
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  // GET /api/jobs/:id - Get job by ID
  app.get('/api/jobs/:id', async (req: Request, res: Response) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const customer = await storage.getUser(job.customerId);
      const jobBids = await storage.getBidsByJob(job.id);
      
      const bidsWithTechnicians = await Promise.all(
        jobBids.map(async (bid) => {
          const technician = await storage.getUser(bid.technicianId);
          return { ...bid, technician };
        })
      );

      res.json({ ...job, customer, bids: bidsWithTechnicians });
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  });

  // POST /api/jobs - Create new job
  app.post('/api/jobs', authenticate, async (req: Request, res: Response) => {
    try {
      const jobData: InsertJob = {
        customerId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || null,
        city: req.body.city || null,
        pin: req.body.pin || null,
        budgetMin: req.body.budgetMin || null,
        budgetMax: req.body.budgetMax || null,
        imageUrls: req.body.imageUrls || null,
      };

      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  });

  // PATCH /api/jobs/:id/status - Update job status
  app.patch('/api/jobs/:id/status', authenticate, async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const job = await storage.getJob(req.params.id);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.customerId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updatedJob = await storage.updateJob(job.id, { status });
      res.json(updatedJob);
    } catch (error) {
      console.error('Update job status error:', error);
      res.status(500).json({ error: 'Failed to update job status' });
    }
  });

  // ============ BID ROUTES ============
  
  // POST /api/bids - Create new bid
  app.post('/api/bids', authenticate, async (req: Request, res: Response) => {
    try {
      const bidData: InsertBid = {
        jobId: req.body.jobId,
        technicianId: req.user.id,
        amount: req.body.amount,
        deliveryTime: req.body.deliveryTime || null,
        note: req.body.note || null,
        isDefault: req.body.isDefault || false,
      };

      const bid = await storage.createBid(bidData);
      res.json(bid);
    } catch (error) {
      console.error('Create bid error:', error);
      res.status(500).json({ error: 'Failed to create bid' });
    }
  });

  // GET /api/jobs/:id/bids - Get bids for a job
  app.get('/api/jobs/:id/bids', async (req: Request, res: Response) => {
    try {
      const bids = await storage.getBidsByJob(req.params.id);
      
      const bidsWithTechnicians = await Promise.all(
        bids.map(async (bid) => {
          const technician = await storage.getUser(bid.technicianId);
          return { ...bid, technician };
        })
      );

      res.json(bidsWithTechnicians);
    } catch (error) {
      console.error('Get bids error:', error);
      res.status(500).json({ error: 'Failed to fetch bids' });
    }
  });

  // PATCH /api/bids/:id/accept - Accept a bid
  app.patch('/api/bids/:id/accept', authenticate, async (req: Request, res: Response) => {
    try {
      const bid = await storage.getBid(req.params.id);
      if (!bid) {
        return res.status(404).json({ error: 'Bid not found' });
      }

      const job = await storage.getJob(bid.jobId);
      if (!job || job.customerId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Update bid status
      await storage.updateBid(bid.id, { status: 'accepted' });

      // Update job status
      await storage.updateJob(job.id, { status: 'in_progress' });

      // Reject other bids for this job
      const allBids = await storage.getBidsByJob(job.id);
      await Promise.all(
        allBids
          .filter(b => b.id !== bid.id && b.status === 'pending')
          .map(b => storage.updateBid(b.id, { status: 'rejected' }))
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Accept bid error:', error);
      res.status(500).json({ error: 'Failed to accept bid' });
    }
  });

  // ============ WALLET ROUTES ============
  
  // POST /api/wallet/recharge - Recharge wallet
  app.post('/api/wallet/recharge', authenticate, async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Add transaction
      await storage.addWalletTransaction({
        userId: req.user.id,
        amount,
        type: 'recharge',
        description: `Wallet recharge of ₹${amount}`,
      });

      // Update user balance
      const newBalance = (req.user.walletBalance || 0) + amount;
      await storage.updateUser(req.user.id, { walletBalance: newBalance });

      res.json({ success: true, newBalance });
    } catch (error) {
      console.error('Recharge wallet error:', error);
      res.status(500).json({ error: 'Failed to recharge wallet' });
    }
  });

  // POST /api/wallet/unlock-contact - Unlock contact details
  app.post('/api/wallet/unlock-contact', authenticate, async (req: Request, res: Response) => {
    try {
      const { contactId } = req.body;
      const unlockCost = 10;

      // Check balance
      if (req.user.walletBalance < unlockCost) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Get technician profile
      const profile = await storage.getTechnicianProfile(contactId);
      if (!profile) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      // Check if already unlocked
      if (profile.whatsappUnlockedBy?.includes(req.user.id)) {
        return res.json({ success: true, alreadyUnlocked: true, whatsappNumber: profile.whatsappNumber });
      }

      // Deduct from wallet
      await storage.addWalletTransaction({
        userId: req.user.id,
        amount: -unlockCost,
        type: 'unlock_contact',
        description: `Unlocked contact for technician`,
      });

      const newBalance = req.user.walletBalance - unlockCost;
      await storage.updateUser(req.user.id, { walletBalance: newBalance });

      // Add user to unlocked list
      const unlockedBy = [...(profile.whatsappUnlockedBy || []), req.user.id];
      await storage.updateTechnicianProfile(contactId, { whatsappUnlockedBy: unlockedBy });

      res.json({ success: true, newBalance, whatsappNumber: profile.whatsappNumber });
    } catch (error) {
      console.error('Unlock contact error:', error);
      res.status(500).json({ error: 'Failed to unlock contact' });
    }
  });

  // ============ SEED ROUTE ============
  
  // POST /api/seed/demo - Seed demo data (idempotent)
  app.post('/api/seed/demo', async (req: Request, res: Response) => {
    try {
      // Check if already seeded
      const existingUsers = await storage.getAllUsers();
      if (existingUsers.length > 0) {
        return res.json({ success: true, message: 'Demo data already exists' });
      }

      // Create demo customers with avatars
      const customer1 = await storage.createUser({
        phone: '9876543210',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        userType: 'customer',
        city: 'Mumbai',
        pin: '400001',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshKumar&scale=80`,
        bio: 'Looking for reliable technicians',
        isOnline: true,
        walletBalance: 500,
      });

      const customer2 = await storage.createUser({
        phone: '9876543211',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        userType: 'customer',
        city: 'Delhi',
        pin: '110001',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma&scale=80`,
        bio: null,
        isOnline: false,
        walletBalance: 300,
      });

      // Create demo technicians
      const technicianData = [
        { name: 'Rahul Verma', phone: '9123456780', city: 'Mumbai', pin: '400001', category: 'Construction & Civil Work', subcategories: ['Mason (Rajmistri)', 'Carpenter'], experience: 8, dailyWage: 800, hourlyWage: 100, rating: 48, whatsapp: '9123456780' },
        { name: 'Amit Singh', phone: '9123456781', city: 'Delhi', pin: '110001', category: 'Construction & Civil Work', subcategories: ['Electrician', 'Plumber'], experience: 5, dailyWage: 600, hourlyWage: 75, rating: 45, whatsapp: '9123456781' },
        { name: 'Suresh Patil', phone: '9123456782', city: 'Mumbai', pin: '400002', category: 'Specialized Technical Labour (Contract-based)', subcategories: ['AC technician', 'RO technician'], experience: 6, dailyWage: 700, hourlyWage: 90, rating: 46, whatsapp: '9123456782' },
        { name: 'Vikas Reddy', phone: '9123456783', city: 'Bangalore', pin: '560001', category: 'Construction & Civil Work', subcategories: ['Welder / Fabricator', 'Bar Bender / Steel Fixer'], experience: 10, dailyWage: 900, hourlyWage: 120, rating: 49, whatsapp: '9123456783' },
        { name: 'Manish Gupta', phone: '9123456784', city: 'Delhi', pin: '110002', category: 'Construction & Civil Work', subcategories: ['Painter / POP Technician', 'Tile / Marble Worker'], experience: 7, dailyWage: 750, hourlyWage: 95, rating: 47, whatsapp: '9123456784' },
        { name: 'Deepak Joshi', phone: '9123456785', city: 'Mumbai', pin: '400003', category: 'Maintenance & Repair Labour', subcategories: ['House repair workers', 'Waterproofing workers'], experience: 4, dailyWage: 550, hourlyWage: 70, rating: 44, whatsapp: '9123456785' },
        { name: 'Ravi Kumar', phone: '9123456786', city: 'Pune', pin: '411001', category: 'Industrial & Factory Labour', subcategories: ['Machine operator', 'Production line worker'], experience: 9, dailyWage: 850, hourlyWage: 110, rating: 48, whatsapp: '9123456786' },
        { name: 'Ankit Sharma', phone: '9123456787', city: 'Delhi', pin: '110003', category: 'Household & Domestic Work', subcategories: ['Driver', 'Gardener / Mali'], experience: 3, dailyWage: 450, hourlyWage: 60, rating: 42, whatsapp: '9123456787' },
      ];

      for (const tech of technicianData) {
        const user = await storage.createUser({
          phone: tech.phone,
          name: tech.name,
          email: null,
          userType: 'technician',
          city: tech.city,
          pin: tech.pin,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name.replace(/\s/g, '')}&scale=80`,
          bio: `Experienced ${tech.category.toLowerCase()} professional with ${tech.experience} years of expertise`,
          isOnline: Math.random() > 0.5,
          walletBalance: 0,
        });

        await storage.createTechnicianProfile({
          userId: user.id,
          category: tech.category,
          subcategories: tech.subcategories,
          yearsExperience: tech.experience,
          dailyWage: tech.dailyWage,
          hourlyWage: tech.hourlyWage,
          rating: tech.rating,
          certifications: 'Certified professional with ITI certification',
          whatsappNumber: tech.whatsapp,
          whatsappUnlockedBy: [],
          socialLinks: null,
        });

        // Add some portfolio items
        if (Math.random() > 0.3) {
          await storage.createPortfolioItem({
            technicianId: user.id,
            title: `${tech.subcategories[0]} project`,
            description: `Successfully completed ${tech.subcategories[0].toLowerCase()} work for residential client`,
            imageUrl: null,
            price: Math.floor(Math.random() * 5000) + 2000,
            completedAt: null,
          });
        }
      }

      // Create demo jobs
      const job1 = await storage.createJob({
        customerId: customer1.id,
        title: 'Bathroom plumbing repair needed',
        description: 'Need a plumber to fix leaking pipes in bathroom. Urgent work required.',
        category: 'Construction & Civil Work',
        city: 'Mumbai',
        pin: '400001',
        budgetMin: 2000,
        budgetMax: 4000,
        imageUrls: null,
      });

      const job2 = await storage.createJob({
        customerId: customer2.id,
        title: 'Electrical wiring for new room',
        description: 'Complete electrical wiring needed for newly constructed room including switches and lights.',
        category: 'Construction & Civil Work',
        city: 'Delhi',
        pin: '110001',
        budgetMin: 5000,
        budgetMax: 8000,
        imageUrls: null,
      });

      const job3 = await storage.createJob({
        customerId: customer1.id,
        title: 'AC installation and servicing',
        description: 'Need technician to install split AC and service existing AC unit.',
        category: 'Specialized Technical Labour (Contract-based)',
        city: 'Mumbai',
        pin: '400001',
        budgetMin: 3000,
        budgetMax: 5000,
        imageUrls: null,
      });

      const job4 = await storage.createJob({
        customerId: customer2.id,
        title: 'House painting work',
        description: 'Looking for painter to paint 2BHK apartment. Interior walls and ceiling.',
        category: 'Construction & Civil Work',
        city: 'Delhi',
        pin: '110001',
        budgetMin: 15000,
        budgetMax: 20000,
        imageUrls: null,
      });

      // Create some demo bids
      const allTechnicians = await storage.getAllUsers();
      const technicians = allTechnicians.filter(u => u.userType === 'technician');

      for (let i = 0; i < Math.min(3, technicians.length); i++) {
        await storage.createBid({
          jobId: job1.id,
          technicianId: technicians[i].id,
          amount: 2500 + (i * 500),
          deliveryTime: `${i + 1} days`,
          note: 'I have experience with similar work',
          isDefault: i === 0,
        });
      }

      for (let i = 0; i < Math.min(2, technicians.length); i++) {
        await storage.createBid({
          jobId: job2.id,
          technicianId: technicians[i].id,
          amount: 6000 + (i * 1000),
          deliveryTime: `${i + 2} days`,
          note: 'Professional electrical work guaranteed',
          isDefault: i === 0,
        });
      }

      res.json({ success: true, message: 'Demo data seeded successfully' });
    } catch (error) {
      console.error('Seed demo error:', error);
      res.status(500).json({ error: 'Failed to seed demo data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
