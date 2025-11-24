// server/index-prod.ts
import fs from "node:fs";
import path from "node:path";
import express2 from "express";

// server/app.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  technicianProfiles;
  portfolioItems;
  jobs;
  bids;
  walletTransactions;
  otps;
  sessions;
  // token -> userId
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.technicianProfiles = /* @__PURE__ */ new Map();
    this.portfolioItems = /* @__PURE__ */ new Map();
    this.jobs = /* @__PURE__ */ new Map();
    this.bids = /* @__PURE__ */ new Map();
    this.walletTransactions = /* @__PURE__ */ new Map();
    this.otps = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByPhone(phone) {
    return Array.from(this.users.values()).find((user) => user.phone === phone);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const user = {
      ...insertUser,
      id,
      walletBalance: insertUser.walletBalance || 0,
      isOnline: insertUser.isOnline || false,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  // Technician Profile methods
  async getTechnicianProfile(userId) {
    return this.technicianProfiles.get(userId);
  }
  async getTechnicianProfileByUserId(userId) {
    return this.technicianProfiles.get(userId);
  }
  async createTechnicianProfile(insertProfile) {
    const id = randomUUID();
    const profile = {
      ...insertProfile,
      id,
      rating: insertProfile.rating || 45,
      whatsappUnlockedBy: insertProfile.whatsappUnlockedBy || []
    };
    this.technicianProfiles.set(insertProfile.userId, profile);
    return profile;
  }
  async updateTechnicianProfile(userId, updates) {
    const profile = this.technicianProfiles.get(userId);
    if (!profile) return void 0;
    const updatedProfile = { ...profile, ...updates };
    this.technicianProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }
  async getAllTechnicianProfiles() {
    return Array.from(this.technicianProfiles.values());
  }
  // Portfolio methods
  async getPortfolioItems(technicianId) {
    return this.portfolioItems.get(technicianId) || [];
  }
  async createPortfolioItem(insertItem) {
    const id = randomUUID();
    const item = {
      ...insertItem,
      id,
      completedAt: insertItem.completedAt || null
    };
    const existingItems = this.portfolioItems.get(insertItem.technicianId) || [];
    this.portfolioItems.set(insertItem.technicianId, [...existingItems, item]);
    return item;
  }
  // Job methods
  async getJob(id) {
    return this.jobs.get(id);
  }
  async getAllJobs() {
    return Array.from(this.jobs.values());
  }
  async createJob(insertJob) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const job = {
      ...insertJob,
      id,
      status: "open",
      createdAt: now,
      imageUrls: insertJob.imageUrls || null
    };
    this.jobs.set(id, job);
    return job;
  }
  async updateJob(id, updates) {
    const job = this.jobs.get(id);
    if (!job) return void 0;
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }
  // Bid methods
  async getBid(id) {
    return this.bids.get(id);
  }
  async getBidsByJob(jobId) {
    return Array.from(this.bids.values()).filter((bid) => bid.jobId === jobId);
  }
  async getBidsByTechnician(technicianId) {
    return Array.from(this.bids.values()).filter((bid) => bid.technicianId === technicianId);
  }
  async createBid(insertBid) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const bid = {
      ...insertBid,
      id,
      status: "pending",
      createdAt: now,
      isDefault: insertBid.isDefault || false
    };
    this.bids.set(id, bid);
    return bid;
  }
  async updateBid(id, updates) {
    const bid = this.bids.get(id);
    if (!bid) return void 0;
    const updatedBid = { ...bid, ...updates };
    this.bids.set(id, updatedBid);
    return updatedBid;
  }
  // Wallet methods
  async addWalletTransaction(insertTransaction) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const transaction = {
      ...insertTransaction,
      id,
      createdAt: now
    };
    const existingTransactions = this.walletTransactions.get(insertTransaction.userId) || [];
    this.walletTransactions.set(insertTransaction.userId, [...existingTransactions, transaction]);
    return transaction;
  }
  async getWalletTransactions(userId) {
    return this.walletTransactions.get(userId) || [];
  }
  // OTP methods
  async createOtp(phone, otp) {
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    this.otps.set(phone, { otp, expiresAt });
  }
  async verifyOtp(phone, otp) {
    const otpData = this.otps.get(phone);
    if (!otpData) return false;
    if (/* @__PURE__ */ new Date() > otpData.expiresAt) {
      this.otps.delete(phone);
      return false;
    }
    if (otpData.otp !== otp) return false;
    this.otps.delete(phone);
    return true;
  }
  // Session methods
  async createSession(userId) {
    const token = randomUUID();
    this.sessions.set(token, userId);
    return token;
  }
  async getSession(token) {
    return this.sessions.get(token);
  }
  async deleteSession(token) {
    this.sessions.delete(token);
  }
};
var storage = new MemStorage();

// server/routes.ts
var authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = await storage.getSession(token);
  if (!userId) {
    return res.status(401).json({ error: "Invalid session" });
  }
  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  req.user = user;
  next();
};
async function registerRoutes(app2) {
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { userType, phone, name, email, city, pin, bio, category, subcategories, yearsExperience, dailyWage, hourlyWage, certifications, whatsappNumber } = req.body;
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({ error: "User with this phone number already exists" });
      }
      const user = await storage.createUser({
        phone,
        name,
        email: email || null,
        userType,
        city: city || null,
        pin: pin || null,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, "")}&scale=80`,
        bio: bio || null,
        isOnline: true,
        walletBalance: 100
        // Start with ₹100 for demo
      });
      if (userType === "technician" && category) {
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
          socialLinks: null
        });
      }
      const token = await storage.createSession(user.id);
      res.json({ ...user, token });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });
  app2.post("/api/auth/signin", async (req, res) => {
    try {
      const { phone } = req.body;
      const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
      await storage.createOtp(phone, otp);
      console.log(`\u{1F510} Mock OTP for ${phone}: ${otp}`);
      res.json({ success: true, message: "OTP sent", mockOtp: otp });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });
  app2.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      const isValid = await storage.verifyOtp(phone, otp);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(404).json({ error: "User not found. Please sign up first." });
      }
      await storage.updateUser(user.id, { isOnline: true });
      const token = await storage.createSession(user.id);
      res.json({ ...user, token });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });
  app2.get("/api/users/me", authenticate, async (req, res) => {
    res.json(req.user);
  });
  app2.patch("/api/users/profile", authenticate, async (req, res) => {
    try {
      const updates = req.body;
      const updatedUser = await storage.updateUser(req.user.id, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.get("/api/technicians", async (req, res) => {
    try {
      const { category, pin, search, online } = req.query;
      const allUsers = await storage.getAllUsers();
      const technicianUsers = allUsers.filter((u) => u.userType === "technician");
      const technicians = await Promise.all(
        technicianUsers.map(async (user) => {
          const profile = await storage.getTechnicianProfile(user.id);
          const portfolio = await storage.getPortfolioItems(user.id);
          return { ...user, profile, portfolio };
        })
      );
      let filtered = technicians.filter((t) => t.profile);
      if (category && category !== "all") {
        filtered = filtered.filter((t) => t.profile?.category?.toLowerCase().includes(category.toString().toLowerCase()));
      }
      if (pin) {
        filtered = filtered.filter((t) => t.pin === pin);
      }
      if (search) {
        const searchLower = search.toString().toLowerCase();
        filtered = filtered.filter(
          (t) => t.name.toLowerCase().includes(searchLower) || t.city?.toLowerCase().includes(searchLower) || t.profile?.category?.toLowerCase().includes(searchLower)
        );
      }
      if (online === "true") {
        filtered = filtered.filter((t) => t.isOnline);
      }
      res.json(filtered);
    } catch (error) {
      console.error("Get technicians error:", error);
      res.status(500).json({ error: "Failed to fetch technicians" });
    }
  });
  app2.get("/api/technicians/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user || user.userType !== "technician") {
        return res.status(404).json({ error: "Technician not found" });
      }
      const profile = await storage.getTechnicianProfile(user.id);
      const portfolio = await storage.getPortfolioItems(user.id);
      res.json({ ...user, profile, portfolio });
    } catch (error) {
      console.error("Get technician error:", error);
      res.status(500).json({ error: "Failed to fetch technician" });
    }
  });
  app2.get("/api/jobs", async (req, res) => {
    try {
      const allJobs = await storage.getAllJobs();
      const jobsWithDetails = await Promise.all(
        allJobs.map(async (job) => {
          const customer = await storage.getUser(job.customerId);
          const jobBids = await storage.getBidsByJob(job.id);
          const bidsWithTechnicians = await Promise.all(
            jobBids.map(async (bid) => {
              const technician = await storage.getUser(bid.technicianId);
              return { ...bid, technician };
            })
          );
          return { ...job, customer, bids: bidsWithTechnicians };
        })
      );
      jobsWithDetails.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      res.json(jobsWithDetails);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });
  app2.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
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
      console.error("Get job error:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });
  app2.post("/api/jobs", authenticate, async (req, res) => {
    try {
      const jobData = {
        customerId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || null,
        city: req.body.city || null,
        pin: req.body.pin || null,
        budgetMin: req.body.budgetMin || null,
        budgetMax: req.body.budgetMax || null,
        imageUrls: req.body.imageUrls || null
      };
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      console.error("Create job error:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });
  app2.patch("/api/jobs/:id/status", authenticate, async (req, res) => {
    try {
      const { status } = req.body;
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      if (job.customerId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const updatedJob = await storage.updateJob(job.id, { status });
      res.json(updatedJob);
    } catch (error) {
      console.error("Update job status error:", error);
      res.status(500).json({ error: "Failed to update job status" });
    }
  });
  app2.post("/api/bids", authenticate, async (req, res) => {
    try {
      const bidData = {
        jobId: req.body.jobId,
        technicianId: req.user.id,
        amount: req.body.amount,
        deliveryTime: req.body.deliveryTime || null,
        note: req.body.note || null,
        isDefault: req.body.isDefault || false
      };
      const bid = await storage.createBid(bidData);
      res.json(bid);
    } catch (error) {
      console.error("Create bid error:", error);
      res.status(500).json({ error: "Failed to create bid" });
    }
  });
  app2.get("/api/jobs/:id/bids", async (req, res) => {
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
      console.error("Get bids error:", error);
      res.status(500).json({ error: "Failed to fetch bids" });
    }
  });
  app2.patch("/api/bids/:id/accept", authenticate, async (req, res) => {
    try {
      const bid = await storage.getBid(req.params.id);
      if (!bid) {
        return res.status(404).json({ error: "Bid not found" });
      }
      const job = await storage.getJob(bid.jobId);
      if (!job || job.customerId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await storage.updateBid(bid.id, { status: "accepted" });
      await storage.updateJob(job.id, { status: "in_progress" });
      const allBids = await storage.getBidsByJob(job.id);
      await Promise.all(
        allBids.filter((b) => b.id !== bid.id && b.status === "pending").map((b) => storage.updateBid(b.id, { status: "rejected" }))
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Accept bid error:", error);
      res.status(500).json({ error: "Failed to accept bid" });
    }
  });
  app2.post("/api/wallet/recharge", authenticate, async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      await storage.addWalletTransaction({
        userId: req.user.id,
        amount,
        type: "recharge",
        description: `Wallet recharge of \u20B9${amount}`
      });
      const newBalance = (req.user.walletBalance || 0) + amount;
      await storage.updateUser(req.user.id, { walletBalance: newBalance });
      res.json({ success: true, newBalance });
    } catch (error) {
      console.error("Recharge wallet error:", error);
      res.status(500).json({ error: "Failed to recharge wallet" });
    }
  });
  app2.post("/api/wallet/unlock-contact", authenticate, async (req, res) => {
    try {
      const { contactId } = req.body;
      const unlockCost = 10;
      if (req.user.walletBalance < unlockCost) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      const profile = await storage.getTechnicianProfile(contactId);
      if (!profile) {
        return res.status(404).json({ error: "Contact not found" });
      }
      if (profile.whatsappUnlockedBy?.includes(req.user.id)) {
        return res.json({ success: true, alreadyUnlocked: true, whatsappNumber: profile.whatsappNumber });
      }
      await storage.addWalletTransaction({
        userId: req.user.id,
        amount: -unlockCost,
        type: "unlock_contact",
        description: `Unlocked contact for technician`
      });
      const newBalance = req.user.walletBalance - unlockCost;
      await storage.updateUser(req.user.id, { walletBalance: newBalance });
      const unlockedBy = [...profile.whatsappUnlockedBy || [], req.user.id];
      await storage.updateTechnicianProfile(contactId, { whatsappUnlockedBy: unlockedBy });
      res.json({ success: true, newBalance, whatsappNumber: profile.whatsappNumber });
    } catch (error) {
      console.error("Unlock contact error:", error);
      res.status(500).json({ error: "Failed to unlock contact" });
    }
  });
  app2.post("/api/seed/demo", async (req, res) => {
    try {
      const existingUsers = await storage.getAllUsers();
      if (existingUsers.length > 0) {
        return res.json({ success: true, message: "Demo data already exists" });
      }
      const customer1 = await storage.createUser({
        phone: "9876543210",
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        userType: "customer",
        city: "Mumbai",
        pin: "400001",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshKumar&scale=80`,
        bio: "Looking for reliable technicians",
        isOnline: true,
        walletBalance: 500
      });
      const customer2 = await storage.createUser({
        phone: "9876543211",
        name: "Priya Sharma",
        email: "priya@example.com",
        userType: "customer",
        city: "Delhi",
        pin: "110001",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma&scale=80`,
        bio: null,
        isOnline: false,
        walletBalance: 300
      });
      const technicianData = [
        { name: "Rahul Verma", phone: "9123456780", city: "Mumbai", pin: "400001", category: "Construction & Civil Work", subcategories: ["Mason (Rajmistri)", "Carpenter"], experience: 8, dailyWage: 800, hourlyWage: 100, rating: 48, whatsapp: "9123456780" },
        { name: "Amit Singh", phone: "9123456781", city: "Delhi", pin: "110001", category: "Construction & Civil Work", subcategories: ["Electrician", "Plumber"], experience: 5, dailyWage: 600, hourlyWage: 75, rating: 45, whatsapp: "9123456781" },
        { name: "Suresh Patil", phone: "9123456782", city: "Mumbai", pin: "400002", category: "Specialized Technical Labour (Contract-based)", subcategories: ["AC technician", "RO technician"], experience: 6, dailyWage: 700, hourlyWage: 90, rating: 46, whatsapp: "9123456782" },
        { name: "Vikas Reddy", phone: "9123456783", city: "Bangalore", pin: "560001", category: "Construction & Civil Work", subcategories: ["Welder / Fabricator", "Bar Bender / Steel Fixer"], experience: 10, dailyWage: 900, hourlyWage: 120, rating: 49, whatsapp: "9123456783" },
        { name: "Manish Gupta", phone: "9123456784", city: "Delhi", pin: "110002", category: "Construction & Civil Work", subcategories: ["Painter / POP Technician", "Tile / Marble Worker"], experience: 7, dailyWage: 750, hourlyWage: 95, rating: 47, whatsapp: "9123456784" },
        { name: "Deepak Joshi", phone: "9123456785", city: "Mumbai", pin: "400003", category: "Maintenance & Repair Labour", subcategories: ["House repair workers", "Waterproofing workers"], experience: 4, dailyWage: 550, hourlyWage: 70, rating: 44, whatsapp: "9123456785" },
        { name: "Ravi Kumar", phone: "9123456786", city: "Pune", pin: "411001", category: "Industrial & Factory Labour", subcategories: ["Machine operator", "Production line worker"], experience: 9, dailyWage: 850, hourlyWage: 110, rating: 48, whatsapp: "9123456786" },
        { name: "Ankit Sharma", phone: "9123456787", city: "Delhi", pin: "110003", category: "Household & Domestic Work", subcategories: ["Driver", "Gardener / Mali"], experience: 3, dailyWage: 450, hourlyWage: 60, rating: 42, whatsapp: "9123456787" }
      ];
      for (const tech of technicianData) {
        const user = await storage.createUser({
          phone: tech.phone,
          name: tech.name,
          email: null,
          userType: "technician",
          city: tech.city,
          pin: tech.pin,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name.replace(/\s/g, "")}&scale=80`,
          bio: `Experienced ${tech.category.toLowerCase()} professional with ${tech.experience} years of expertise`,
          isOnline: Math.random() > 0.5,
          walletBalance: 0
        });
        await storage.createTechnicianProfile({
          userId: user.id,
          category: tech.category,
          subcategories: tech.subcategories,
          yearsExperience: tech.experience,
          dailyWage: tech.dailyWage,
          hourlyWage: tech.hourlyWage,
          rating: tech.rating,
          certifications: "Certified professional with ITI certification",
          whatsappNumber: tech.whatsapp,
          whatsappUnlockedBy: [],
          socialLinks: null
        });
        if (Math.random() > 0.3) {
          await storage.createPortfolioItem({
            technicianId: user.id,
            title: `${tech.subcategories[0]} project`,
            description: `Successfully completed ${tech.subcategories[0].toLowerCase()} work for residential client`,
            imageUrl: null,
            price: Math.floor(Math.random() * 5e3) + 2e3,
            completedAt: null
          });
        }
      }
      const job1 = await storage.createJob({
        customerId: customer1.id,
        title: "Bathroom plumbing repair needed",
        description: "Need a plumber to fix leaking pipes in bathroom. Urgent work required.",
        category: "Construction & Civil Work",
        city: "Mumbai",
        pin: "400001",
        budgetMin: 2e3,
        budgetMax: 4e3,
        imageUrls: null
      });
      const job2 = await storage.createJob({
        customerId: customer2.id,
        title: "Electrical wiring for new room",
        description: "Complete electrical wiring needed for newly constructed room including switches and lights.",
        category: "Construction & Civil Work",
        city: "Delhi",
        pin: "110001",
        budgetMin: 5e3,
        budgetMax: 8e3,
        imageUrls: null
      });
      const job3 = await storage.createJob({
        customerId: customer1.id,
        title: "AC installation and servicing",
        description: "Need technician to install split AC and service existing AC unit.",
        category: "Specialized Technical Labour (Contract-based)",
        city: "Mumbai",
        pin: "400001",
        budgetMin: 3e3,
        budgetMax: 5e3,
        imageUrls: null
      });
      const job4 = await storage.createJob({
        customerId: customer2.id,
        title: "House painting work",
        description: "Looking for painter to paint 2BHK apartment. Interior walls and ceiling.",
        category: "Construction & Civil Work",
        city: "Delhi",
        pin: "110001",
        budgetMin: 15e3,
        budgetMax: 2e4,
        imageUrls: null
      });
      const allTechnicians = await storage.getAllUsers();
      const technicians = allTechnicians.filter((u) => u.userType === "technician");
      for (let i = 0; i < Math.min(3, technicians.length); i++) {
        await storage.createBid({
          jobId: job1.id,
          technicianId: technicians[i].id,
          amount: 2500 + i * 500,
          deliveryTime: `${i + 1} days`,
          note: "I have experience with similar work",
          isDefault: i === 0
        });
      }
      for (let i = 0; i < Math.min(2, technicians.length); i++) {
        await storage.createBid({
          jobId: job2.id,
          technicianId: technicians[i].id,
          amount: 6e3 + i * 1e3,
          deliveryTime: `${i + 2} days`,
          note: "Professional electrical work guaranteed",
          isDefault: i === 0
        });
      }
      res.json({ success: true, message: "Demo data seeded successfully" });
    } catch (error) {
      console.error("Seed demo error:", error);
      res.status(500).json({ error: "Failed to seed demo data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/app.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function runApp(setup) {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  await setup(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
}

// server/index-prod.ts
async function serveStatic(app2, _server) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
(async () => {
  await runApp(serveStatic);
})();
export {
  serveStatic
};
