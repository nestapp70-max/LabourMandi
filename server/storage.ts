import {
  type User,
  type InsertUser,
  type TechnicianProfile,
  type InsertTechnicianProfile,
  type PortfolioItem,
  type InsertPortfolioItem,
  type Job,
  type InsertJob,
  type Bid,
  type InsertBid,
  type WalletTransaction,
  type InsertWalletTransaction,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Technician Profile methods
  getTechnicianProfile(userId: string): Promise<TechnicianProfile | undefined>;
  getTechnicianProfileByUserId(userId: string): Promise<TechnicianProfile | undefined>;
  createTechnicianProfile(profile: InsertTechnicianProfile): Promise<TechnicianProfile>;
  updateTechnicianProfile(userId: string, updates: Partial<TechnicianProfile>): Promise<TechnicianProfile | undefined>;
  getAllTechnicianProfiles(): Promise<TechnicianProfile[]>;

  // Portfolio methods
  getPortfolioItems(technicianId: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;

  // Job methods
  getJob(id: string): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined>;

  // Bid methods
  getBid(id: string): Promise<Bid | undefined>;
  getBidsByJob(jobId: string): Promise<Bid[]>;
  getBidsByTechnician(technicianId: string): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBid(id: string, updates: Partial<Bid>): Promise<Bid | undefined>;

  // Wallet methods
  addWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction>;
  getWalletTransactions(userId: string): Promise<WalletTransaction[]>;

  // OTP methods
  createOtp(phone: string, otp: string): Promise<void>;
  verifyOtp(phone: string, otp: string): Promise<boolean>;

  // Session methods
  createSession(userId: string): Promise<string>;
  getSession(token: string): Promise<string | undefined>;
  deleteSession(token: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private technicianProfiles: Map<string, TechnicianProfile>;
  private portfolioItems: Map<string, PortfolioItem[]>;
  private jobs: Map<string, Job>;
  private bids: Map<string, Bid>;
  private walletTransactions: Map<string, WalletTransaction[]>;
  private otps: Map<string, { otp: string; expiresAt: Date }>;
  private sessions: Map<string, string>; // token -> userId

  constructor() {
    this.users = new Map();
    this.technicianProfiles = new Map();
    this.portfolioItems = new Map();
    this.jobs = new Map();
    this.bids = new Map();
    this.walletTransactions = new Map();
    this.otps = new Map();
    this.sessions = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.phone === phone);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      walletBalance: insertUser.walletBalance || 0,
      isOnline: insertUser.isOnline || false,
      createdAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Technician Profile methods
  async getTechnicianProfile(userId: string): Promise<TechnicianProfile | undefined> {
    return this.technicianProfiles.get(userId);
  }

  async getTechnicianProfileByUserId(userId: string): Promise<TechnicianProfile | undefined> {
    return this.technicianProfiles.get(userId);
  }

  async createTechnicianProfile(insertProfile: InsertTechnicianProfile): Promise<TechnicianProfile> {
    const id = randomUUID();
    const profile: TechnicianProfile = {
      ...insertProfile,
      id,
      rating: insertProfile.rating || 45,
      whatsappUnlockedBy: insertProfile.whatsappUnlockedBy || [],
    };
    this.technicianProfiles.set(insertProfile.userId, profile);
    return profile;
  }

  async updateTechnicianProfile(userId: string, updates: Partial<TechnicianProfile>): Promise<TechnicianProfile | undefined> {
    const profile = this.technicianProfiles.get(userId);
    if (!profile) return undefined;
    const updatedProfile = { ...profile, ...updates };
    this.technicianProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  async getAllTechnicianProfiles(): Promise<TechnicianProfile[]> {
    return Array.from(this.technicianProfiles.values());
  }

  // Portfolio methods
  async getPortfolioItems(technicianId: string): Promise<PortfolioItem[]> {
    return this.portfolioItems.get(technicianId) || [];
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = randomUUID();
    const item: PortfolioItem = {
      ...insertItem,
      id,
      completedAt: insertItem.completedAt || null,
    };
    
    const existingItems = this.portfolioItems.get(insertItem.technicianId) || [];
    this.portfolioItems.set(insertItem.technicianId, [...existingItems, item]);
    return item;
  }

  // Job methods
  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const now = new Date();
    const job: Job = {
      ...insertJob,
      id,
      status: 'open',
      createdAt: now,
      imageUrls: insertJob.imageUrls || null,
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  // Bid methods
  async getBid(id: string): Promise<Bid | undefined> {
    return this.bids.get(id);
  }

  async getBidsByJob(jobId: string): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter((bid) => bid.jobId === jobId);
  }

  async getBidsByTechnician(technicianId: string): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter((bid) => bid.technicianId === technicianId);
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const id = randomUUID();
    const now = new Date();
    const bid: Bid = {
      ...insertBid,
      id,
      status: 'pending',
      createdAt: now,
      isDefault: insertBid.isDefault || false,
    };
    this.bids.set(id, bid);
    return bid;
  }

  async updateBid(id: string, updates: Partial<Bid>): Promise<Bid | undefined> {
    const bid = this.bids.get(id);
    if (!bid) return undefined;
    const updatedBid = { ...bid, ...updates };
    this.bids.set(id, updatedBid);
    return updatedBid;
  }

  // Wallet methods
  async addWalletTransaction(insertTransaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const id = randomUUID();
    const now = new Date();
    const transaction: WalletTransaction = {
      ...insertTransaction,
      id,
      createdAt: now,
    };
    
    const existingTransactions = this.walletTransactions.get(insertTransaction.userId) || [];
    this.walletTransactions.set(insertTransaction.userId, [...existingTransactions, transaction]);
    return transaction;
  }

  async getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    return this.walletTransactions.get(userId) || [];
  }

  // OTP methods
  async createOtp(phone: string, otp: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes
    this.otps.set(phone, { otp, expiresAt });
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const otpData = this.otps.get(phone);
    if (!otpData) return false;
    if (new Date() > otpData.expiresAt) {
      this.otps.delete(phone);
      return false;
    }
    if (otpData.otp !== otp) return false;
    this.otps.delete(phone); // OTP can only be used once
    return true;
  }

  // Session methods
  async createSession(userId: string): Promise<string> {
    const token = randomUUID();
    this.sessions.set(token, userId);
    return token;
  }

  async getSession(token: string): Promise<string | undefined> {
    return this.sessions.get(token);
  }

  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }
}

export const storage = new MemStorage();
