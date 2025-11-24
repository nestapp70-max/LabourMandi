import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - supports both Customer and Technician types
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  name: text("name").notNull(),
  userType: text("user_type").notNull(), // 'customer' or 'technician'
  city: text("city"),
  pin: text("pin"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  isOnline: boolean("is_online").default(false),
  walletBalance: integer("wallet_balance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Technician profiles - additional data for technicians
export const technicianProfiles = pgTable("technician_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  subcategories: text("subcategories").array(),
  yearsExperience: integer("years_experience"),
  dailyWage: integer("daily_wage"),
  hourlyWage: integer("hourly_wage"),
  rating: integer("rating").default(45), // out of 50
  certifications: text("certifications"),
  whatsappNumber: text("whatsapp_number"),
  whatsappUnlockedBy: text("whatsapp_unlocked_by").array().default(sql`ARRAY[]::text[]`),
  socialLinks: text("social_links"),
});

// Portfolio items
export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  technicianId: varchar("technician_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  price: integer("price"),
  completedAt: timestamp("completed_at"),
});

// Jobs
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  city: text("city"),
  pin: text("pin"),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  status: text("status").default('open'), // 'open', 'in_progress', 'completed', 'cancelled'
  imageUrls: text("image_urls").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bids
export const bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull(),
  technicianId: varchar("technician_id").notNull(),
  amount: integer("amount").notNull(),
  deliveryTime: text("delivery_time"), // e.g., "2 days", "4 hours"
  note: text("note"),
  isDefault: boolean("is_default").default(false),
  status: text("status").default('pending'), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet transactions
export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // 'recharge', 'unlock_contact', 'refund'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// OTP verification (mock)
export const otpVerifications = pgTable("otp_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTechnicianProfileSchema = createInsertSchema(technicianProfiles).omit({
  id: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  completedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TechnicianProfile = typeof technicianProfiles.$inferSelect;
export type InsertTechnicianProfile = z.infer<typeof insertTechnicianProfileSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;

// Categories constant
export const CATEGORIES = [
  {
    id: 'construction',
    name: 'Construction & Civil Work',
    subcategories: [
      'Mason (Rajmistri)', 'Carpenter', 'Electrician', 'Plumber', 'Welder / Fabricator',
      'Tile / Marble Worker', 'Painter / POP Technician', 'Bar Bender / Steel Fixer',
      'Scaffolder', 'Heavy machinery operators (JCB, crane, loader, excavator)', 'Surveyor helper',
      'Helper / Construction helper', 'Site cleaner', 'Material handler', 'Demolition labour',
      'Concrete mixer helper', 'Road construction labour', 'Paver block worker'
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial & Factory Labour',
    subcategories: [
      'Machine operator', 'Packaging worker', 'Loading/unloading labour', 'Quality check helper',
      'Production line worker', 'Warehouse picker/packer', 'Forklift operator', 'Godown labour',
      'Assembly worker'
    ]
  },
  {
    id: 'agricultural',
    name: 'Agricultural Labour',
    subcategories: [
      'Sowing labour', 'Harvesting labour', 'Irrigation worker', 'Fertilizer & pesticide sprayer',
      'Crop-cutting labour', 'Plantation workers (tea, coffee, rubber, sugarcane, etc.)',
      'Tractor driver', 'Dairy farm helper', 'Poultry farm labour'
    ]
  },
  {
    id: 'household',
    name: 'Household & Domestic Work',
    subcategories: [
      'Housemaid', 'Cook', 'Babysitter', 'Elderly caretaker', 'House cleaning worker',
      'Driver', 'Gardener / Mali', 'Watchman / Security guard'
    ]
  },
  {
    id: 'transportation',
    name: 'Transportation & Loading Work',
    subcategories: [
      'Loaders / unloaders', 'Tempo/Truck helpers', 'Parcel handling labour (courier/logistics)',
      'Porter / coolie', 'Delivery helpers'
    ]
  },
  {
    id: 'event',
    name: 'Event & Hospitality Labour',
    subcategories: [
      'Event setup labour (stage/tent/pandal)', 'Catering workers', 'Waiters / serving staff',
      'Cleaning staff', 'Sound & lighting setup labour', 'Decoration workers', 'Bouncers'
    ]
  },
  {
    id: 'retail',
    name: 'Retail & Commercial Labour',
    subcategories: [
      'Store helpers', 'Merchandising helpers', 'Billing assistants', 'Promoters / samplers',
      'Flyer distributors', 'Stock fillers'
    ]
  },
  {
    id: 'municipal',
    name: 'Municipal & Public Utility Labour',
    subcategories: [
      'Garbage collection workers', 'Sweepers', 'Drainage workers', 'Water pipeline labour',
      'Road maintenance labour'
    ]
  },
  {
    id: 'specialized',
    name: 'Specialized Technical Labour (Contract-based)',
    subcategories: [
      'AC technician', 'CCTV technician', 'RO technician', 'Elevator maintenance',
      'Solar panel installation', 'Computer/network technician'
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Repair Labour',
    subcategories: [
      'House repair workers', 'Plastering labour', 'Waterproofing workers', 'Wood polishers',
      'Pest control workers'
    ]
  },
  {
    id: 'other',
    name: 'Other Services',
    subcategories: [
      'General labour', 'Casual worker', 'Day labour', 'Contract worker'
    ]
  }
];
