import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Basic user schema (from original file)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Bookmakers table
export const bookmakers = pgTable("bookmakers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logo: text("logo"),
  active: boolean("active").default(true),
});

export const insertBookmakerSchema = createInsertSchema(bookmakers).pick({
  name: true,
  logo: true,
  active: true,
});

// Sports table
export const sports = pgTable("sports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  active: boolean("active").default(true),
});

export const insertSportSchema = createInsertSchema(sports).pick({
  name: true,
  icon: true,
  active: true,
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sportId: integer("sport_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  competition: text("competition"),
  status: text("status").default("upcoming"),
});

export const insertEventSchema = createInsertSchema(events).pick({
  name: true,
  sportId: true,
  startTime: true,
  competition: true,
  status: true,
});

// Betting opportunities
export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  market: text("market").notNull(),
  bookmaker1Id: integer("bookmaker1_id").notNull(),
  bookmaker2Id: integer("bookmaker2_id").notNull(),
  odds1: numeric("odds1").notNull(),
  odds2: numeric("odds2").notNull(),
  profitPercent: numeric("profit_percent").notNull(),
  recommendedInvestment: numeric("recommended_investment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const insertOpportunitySchema = createInsertSchema(opportunities).pick({
  eventId: true,
  market: true,
  bookmaker1Id: true,
  bookmaker2Id: true,
  odds1: true,
  odds2: true,
  profitPercent: true,
  recommendedInvestment: true,
  isActive: true,
});

// Activity log
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // new_opportunity, odds_change, opportunity_expired, system_update
  message: text("message").notNull(),
  relatedOpportunityId: integer("related_opportunity_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  type: true,
  message: true,
  relatedOpportunityId: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Bookmaker = typeof bookmakers.$inferSelect;
export type InsertBookmaker = z.infer<typeof insertBookmakerSchema>;

export type Sport = typeof sports.$inferSelect;
export type InsertSport = z.infer<typeof insertSportSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
