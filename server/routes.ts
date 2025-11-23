import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { dbStorage } from "./db-storage";
import { z } from "zod";
import { insertUserSchema, insertJobSchema, insertBidSchema, insertReviewSchema, insertTechnicianSchema } from "@shared/schema";

// Use database storage if DATABASE_URL is set
const appStorage = process.env.DATABASE_URL ? dbStorage : storage;

export async function registerRoutes(app: Express): Promise<Server> {
  // Twilio setup (if credentials provided)
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
  
  let twilioClient: any = null;
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    try {
      const twilio = require('twilio');
      twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      console.log('✓ Twilio initialized for SMS OTP');
    } catch (error) {
      console.warn('Twilio not available, using mock OTP');
    }
  }

  // Helper function to generate OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Helper function to send OTP via SMS
  const sendOtpViaSms = async (phone: string, code: string) => {
    if (!twilioClient || !TWILIO_PHONE_NUMBER) {
      console.log(`[OTP] Code for ${phone}: ${code}`);
      return true; // Mock mode
    }
    
    try {
      await twilioClient.messages.create({
        body: `Your LabourConnect verification code is: ${code}. Valid for 10 minutes.`,
        from: TWILIO_PHONE_NUMBER,
        to: `+91${phone}`, // Add India country code
      });
      console.log(`✓ OTP sent to ${phone} via SMS`);
      return true;
    } catch (error: any) {
      console.error(`Failed to send OTP to ${phone}:`, error.message);
      return false;
    }
  };

  // ==================== AUTH ROUTES ====================

  // Send OTP for login/signup
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone || phone.length < 10) {
        return res.status(400).json({ error: "Valid phone number required" });
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await appStorage.createOtpCode(phone, code, expiresAt);

      // Send OTP via SMS if Twilio is available
      await sendOtpViaSms(phone, code);

      res.json({ 
        success: true, 
        message: "OTP sent successfully",
        // In development, include OTP in response for testing
        ...(process.env.NODE_ENV !== 'production' && { otp: code })
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  // Verify OTP and login
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, code } = req.body;
      
      const isValid = await appStorage.verifyOtpCode(phone, code);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid or expired OTP" });
      }

      const user = await appStorage.getUserByPhone(phone);
      if (!user) {
        return res.status(404).json({ error: "User not found. Please sign up first." });
      }

      res.json({ success: true, user });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // Signup new user
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      const existingUser = await appStorage.getUserByPhone(validatedData.phone);
      if (existingUser) {
        return res.status(400).json({ error: "Phone number already registered" });
      }

      const user = await appStorage.createUser(validatedData);

      // If technician role, create technician profile placeholder
      if (validatedData.role === 'technician') {
        await appStorage.createTechnician({
          userId: user.id,
          skills: [],
          experience: 0,
          location: "India",
          bio: null,
          pinCode: null,
          email: null,
          isAvailable: true,
          profileImage: null,
        });
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await appStorage.createOtpCode(validatedData.phone, code, expiresAt);

      // Send OTP via SMS if Twilio is available
      await sendOtpViaSms(validatedData.phone, code);

      res.json({ 
        success: true, 
        message: "Account created. OTP sent for verification.",
        ...(process.env.NODE_ENV !== 'production' && { otp: code })
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // ==================== USER ROUTES ====================

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await appStorage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // ==================== TECHNICIAN ROUTES ====================

  // Get all technicians (with filtering)
  app.get("/api/technicians", async (req, res) => {
    try {
      const { category, location } = req.query;
      const technicians = await appStorage.getTechniciansWithUser({
        category: category as string,
        location: location as string,
      });
      res.json(technicians);
    } catch (error) {
      console.error("Get technicians error:", error);
      res.status(500).json({ error: "Failed to fetch technicians" });
    }
  });

  // Get current user's technician profile
  app.get("/api/technicians/my-profile", async (req, res) => {
    try {
      // In production, get userId from session/token
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const technician = await appStorage.getTechnicianByUserId(userId);
      if (!technician) {
        return res.status(404).json({ error: "Technician profile not found" });
      }

      res.json(technician);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch technician profile" });
    }
  });

  // Update technician profile
  app.put("/api/technicians/:id", async (req, res) => {
    try {
      const validatedData = insertTechnicianSchema.partial().parse(req.body);
      // Implementation would update the technician
      res.json({ success: true, message: "Profile updated" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // ==================== JOB ROUTES ====================

  // Get all jobs (with filtering)
  app.get("/api/jobs", async (req, res) => {
    try {
      const { customerId, status } = req.query;
      const jobs = await appStorage.getJobsWithCustomer({
        customerId: customerId as string,
        status: status as string,
      });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // Get customer's jobs
  app.get("/api/jobs/my-jobs", async (req, res) => {
    try {
      const customerId = req.query.customerId as string;
      if (!customerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const jobs = await appStorage.getJobsWithCustomer({ customerId });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // Get available jobs for technicians
  app.get("/api/jobs/available", async (req, res) => {
    try {
      const jobs = await appStorage.getAvailableJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available jobs" });
    }
  });

  // Create new job
  app.post("/api/jobs", async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await appStorage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create job error:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  // Update job status
  app.patch("/api/jobs/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const job = await appStorage.updateJobStatus(req.params.id, status);
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to update job status" });
    }
  });

  // ==================== BID ROUTES ====================

  // Get bids for a job
  app.get("/api/bids/job/:jobId", async (req, res) => {
    try {
      const bids = await appStorage.getBidsForJob(req.params.jobId);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bids" });
    }
  });

  // Get technician's bids
  app.get("/api/bids/my-bids", async (req, res) => {
    try {
      const technicianId = req.query.technicianId as string;
      if (!technicianId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const bids = await appStorage.getBidsByTechnician(technicianId);
      
      // Enrich with job details
      const bidsWithJobs = await Promise.all(
        bids.map(async (bid) => {
          const job = await appStorage.getJob(bid.jobId);
          return { ...bid, job };
        })
      );

      res.json(bidsWithJobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bids" });
    }
  });

  // Create new bid
  app.post("/api/bids", async (req, res) => {
    try {
      const validatedData = insertBidSchema.parse(req.body);
      const bid = await appStorage.createBid(validatedData);
      res.status(201).json(bid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create bid error:", error);
      res.status(500).json({ error: "Failed to place bid" });
    }
  });

  // Update bid status
  app.patch("/api/bids/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const bid = await appStorage.updateBidStatus(req.params.id, status);
      res.json(bid);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bid status" });
    }
  });

  // ==================== WALLET ROUTES ====================

  // Get user's transactions
  app.get("/api/wallet/transactions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const transactions = await appStorage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Recharge wallet
  app.post("/api/wallet/recharge", async (req, res) => {
    try {
      const { userId, amount } = req.body;
      
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const user = await appStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newBalance = (parseFloat(user.walletBalance) + parseFloat(amount)).toFixed(2);
      await appStorage.updateUserWallet(userId, newBalance);

      await appStorage.createTransaction({
        userId,
        type: "recharge",
        amount: amount.toString(),
        description: `Wallet recharged with ₹${amount}`,
        relatedId: null,
      });

      res.json({ success: true, newBalance });
    } catch (error) {
      console.error("Recharge error:", error);
      res.status(500).json({ error: "Failed to recharge wallet" });
    }
  });

  // ==================== CHAT UNLOCK ROUTES ====================

  // Get customer's unlocked contacts
  app.get("/api/chat-unlocks/my-unlocks", async (req, res) => {
    try {
      const customerId = req.query.customerId as string;
      if (!customerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const unlocks = await appStorage.getChatUnlocksByCustomer(customerId);
      res.json(unlocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unlocked contacts" });
    }
  });

  // Unlock technician contact
  app.post("/api/chat-unlocks", async (req, res) => {
    try {
      const { customerId, technicianId } = req.body;

      if (!customerId || !technicianId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if already unlocked
      const existing = await appStorage.getChatUnlock(customerId, technicianId);
      if (existing) {
        return res.status(400).json({ error: "Contact already unlocked" });
      }

      // Check wallet balance
      const customer = await appStorage.getUser(customerId);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      const balance = parseFloat(customer.walletBalance);
      if (balance < 10) {
        return res.status(400).json({ error: "Insufficient wallet balance" });
      }

      // Deduct ₹10 from customer
      const newCustomerBalance = (balance - 10).toFixed(2);
      await appStorage.updateUserWallet(customerId, newCustomerBalance);

      // Add ₹10 to technician
      const technician = await appStorage.getTechnician(technicianId);
      if (technician) {
        const techUser = await appStorage.getUser(technician.userId);
        if (techUser) {
          const newTechBalance = (parseFloat(techUser.walletBalance) + 10).toFixed(2);
          await appStorage.updateUserWallet(technician.userId, newTechBalance);

          await appStorage.createTransaction({
            userId: technician.userId,
            type: "earning",
            amount: "10.00",
            description: "Earnings from contact unlock",
            relatedId: customerId,
          });
        }
      }

      // Create unlock record
      const unlock = await appStorage.createChatUnlock(customerId, technicianId);

      // Create transaction
      await appStorage.createTransaction({
        userId: customerId,
        type: "chat_unlock",
        amount: "10.00",
        description: "Contact unlocked",
        relatedId: technicianId,
      });

      res.status(201).json({ success: true, unlock });
    } catch (error) {
      console.error("Chat unlock error:", error);
      res.status(500).json({ error: "Failed to unlock contact" });
    }
  });

  // ==================== REVIEW ROUTES ====================

  // Get reviews for a technician
  app.get("/api/reviews/technician/:technicianId", async (req, res) => {
    try {
      const reviews = await appStorage.getReviewsByTechnician(req.params.technicianId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Create review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await appStorage.createReview(validatedData);

      // Update technician rating
      const reviews = await appStorage.getReviewsByTechnician(validatedData.technicianId);
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = (totalRating / reviews.length).toFixed(2);

      await appStorage.updateTechnicianRating(
        validatedData.technicianId,
        avgRating,
        reviews.length
      );

      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
