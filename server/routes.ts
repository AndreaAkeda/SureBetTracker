import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertOpportunitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // All API routes should be prefixed with /api
  
  // Get all bookmakers
  app.get("/api/bookmakers", async (req, res) => {
    try {
      const bookmakers = await storage.getBookmakers();
      res.json(bookmakers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmakers" });
    }
  });
  
  // Get all sports
  app.get("/api/sports", async (req, res) => {
    try {
      const sports = await storage.getSports();
      res.json(sports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sports" });
    }
  });
  
  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  
  // Get sports distribution
  app.get("/api/dashboard/sports-distribution", async (req, res) => {
    try {
      const distribution = await storage.getSportsDistribution();
      res.json(distribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sports distribution" });
    }
  });
  
  // Get high profit opportunities
  app.get("/api/opportunities/high-profit", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const opportunities = await storage.getHighProfitOpportunities(limit);
      
      // Get related events and bookmakers for each opportunity
      const enrichedOpportunities = await Promise.all(
        opportunities.map(async (opp) => {
          const event = await storage.getEvent(opp.eventId);
          const bookmaker1 = await storage.getBookmaker(opp.bookmaker1Id);
          const bookmaker2 = await storage.getBookmaker(opp.bookmaker2Id);
          const sport = event ? await storage.getSport(event.sportId) : null;
          
          return {
            ...opp,
            event,
            bookmaker1,
            bookmaker2,
            sport
          };
        })
      );
      
      res.json(enrichedOpportunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch high profit opportunities" });
    }
  });
  
  // Get active opportunities with filters
  app.get("/api/opportunities", async (req, res) => {
    try {
      const opportunities = await storage.getActiveOpportunities();
      
      // Apply filters if provided
      let filteredOpportunities = [...opportunities];
      
      // Filter by sport if sportId is provided
      if (req.query.sportId) {
        const sportId = parseInt(req.query.sportId as string);
        const events = await storage.getEvents();
        const eventIdsBySport = events
          .filter(event => event.sportId === sportId)
          .map(event => event.id);
        
        filteredOpportunities = filteredOpportunities.filter(
          opp => eventIdsBySport.includes(opp.eventId)
        );
      }
      
      // Filter by minimum profit
      if (req.query.minProfit) {
        const minProfit = parseFloat(req.query.minProfit as string);
        filteredOpportunities = filteredOpportunities.filter(
          opp => Number(opp.profitPercent) >= minProfit
        );
      }
      
      // Filter by bookmaker
      if (req.query.bookmakerIds) {
        const bookmakerIds = (req.query.bookmakerIds as string)
          .split(',')
          .map(id => parseInt(id.trim()));
        
        filteredOpportunities = filteredOpportunities.filter(
          opp => bookmakerIds.includes(opp.bookmaker1Id) || bookmakerIds.includes(opp.bookmaker2Id)
        );
      }
      
      // Get related events and bookmakers for each opportunity
      const enrichedOpportunities = await Promise.all(
        filteredOpportunities.map(async (opp) => {
          const event = await storage.getEvent(opp.eventId);
          const bookmaker1 = await storage.getBookmaker(opp.bookmaker1Id);
          const bookmaker2 = await storage.getBookmaker(opp.bookmaker2Id);
          const sport = event ? await storage.getSport(event.sportId) : null;
          
          return {
            ...opp,
            event,
            bookmaker1,
            bookmaker2,
            sport
          };
        })
      );
      
      res.json(enrichedOpportunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });
  
  // Get upcoming events
  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const events = await storage.getUpcomingEvents(limit);
      
      // Get related sports for each event
      const enrichedEvents = await Promise.all(
        events.map(async (event) => {
          const sport = await storage.getSport(event.sportId);
          return {
            ...event,
            sport
          };
        })
      );
      
      res.json(enrichedEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });
  
  // Get activity logs
  app.get("/api/activity-logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const logs = await storage.getActivityLogs(limit);
      
      // Get related opportunities for each log
      const enrichedLogs = await Promise.all(
        logs.map(async (log) => {
          if (log.relatedOpportunityId) {
            const opportunity = await storage.getOpportunity(log.relatedOpportunityId);
            if (opportunity) {
              const event = await storage.getEvent(opportunity.eventId);
              return {
                ...log,
                opportunity: {
                  ...opportunity,
                  event
                }
              };
            }
          }
          return log;
        })
      );
      
      res.json(enrichedLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });
  
  // Calculate profit
  app.post("/api/calculator/profit", (req, res) => {
    try {
      const schema = z.object({
        odds1: z.number().positive(),
        odds2: z.number().positive(),
        totalStake: z.number().positive()
      });
      
      const { odds1, odds2, totalStake } = schema.parse(req.body);
      
      // Calculate stakes and profit
      const totalOdds = 1/odds1 + 1/odds2;
      const stake1 = totalStake * (1/odds1) / totalOdds;
      const stake2 = totalStake * (1/odds2) / totalOdds;
      
      const profit = stake1 * odds1 - totalStake;
      const profitPercent = (profit / totalStake) * 100;
      
      res.json({
        profit: parseFloat(profit.toFixed(2)),
        profitPercent: parseFloat(profitPercent.toFixed(2)),
        stake1: parseFloat(stake1.toFixed(2)),
        stake2: parseFloat(stake2.toFixed(2))
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to calculate profit" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
