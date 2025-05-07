import { 
  users, type User, type InsertUser,
  bookmakers, type Bookmaker, type InsertBookmaker,
  sports, type Sport, type InsertSport,
  events, type Event, type InsertEvent,
  opportunities, type Opportunity, type InsertOpportunity,
  activityLogs, type ActivityLog, type InsertActivityLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, avg, max, count, and, isNotNull, sql, lt, gte } from "drizzle-orm";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Bookmaker operations
  getBookmakers(): Promise<Bookmaker[]>;
  getBookmaker(id: number): Promise<Bookmaker | undefined>;
  createBookmaker(bookmaker: InsertBookmaker): Promise<Bookmaker>;
  updateBookmaker(id: number, data: Partial<InsertBookmaker>): Promise<Bookmaker | undefined>;

  // Sport operations
  getSports(): Promise<Sport[]>;
  getSport(id: number): Promise<Sport | undefined>;
  createSport(sport: InsertSport): Promise<Sport>;
  updateSport(id: number, data: Partial<InsertSport>): Promise<Sport | undefined>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined>;

  // Opportunity operations
  getOpportunities(): Promise<Opportunity[]>;
  getOpportunity(id: number): Promise<Opportunity | undefined>;
  getActiveOpportunities(): Promise<Opportunity[]>;
  getHighProfitOpportunities(limit?: number): Promise<Opportunity[]>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  updateOpportunity(id: number, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined>;

  // Activity operations
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    activeOpportunitiesCount: number;
    averageProfitPercent: number;
    highestProfitPercent: number;
    highestProfitOpportunityId?: number;
  }>;
  
  // Sports distribution
  getSportsDistribution(): Promise<{ sportId: number, sportName: string, count: number }[]>;

  // Seed database
  seedDatabase(): Promise<void>;
}

// Database implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Bookmaker operations
  async getBookmakers(): Promise<Bookmaker[]> {
    return db.select().from(bookmakers);
  }

  async getBookmaker(id: number): Promise<Bookmaker | undefined> {
    const [bookmaker] = await db.select().from(bookmakers).where(eq(bookmakers.id, id));
    return bookmaker;
  }

  async createBookmaker(insertBookmaker: InsertBookmaker): Promise<Bookmaker> {
    const [bookmaker] = await db.insert(bookmakers).values(insertBookmaker).returning();
    return bookmaker;
  }

  async updateBookmaker(id: number, data: Partial<InsertBookmaker>): Promise<Bookmaker | undefined> {
    const [updatedBookmaker] = await db.update(bookmakers).set(data).where(eq(bookmakers.id, id)).returning();
    return updatedBookmaker;
  }

  // Sport operations
  async getSports(): Promise<Sport[]> {
    return db.select().from(sports);
  }

  async getSport(id: number): Promise<Sport | undefined> {
    const [sport] = await db.select().from(sports).where(eq(sports.id, id));
    return sport;
  }

  async createSport(insertSport: InsertSport): Promise<Sport> {
    const [sport] = await db.insert(sports).values(insertSport).returning();
    return sport;
  }

  async updateSport(id: number, data: Partial<InsertSport>): Promise<Sport | undefined> {
    const [updatedSport] = await db.update(sports).set(data).where(eq(sports.id, id)).returning();
    return updatedSport;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    return db.select()
      .from(events)
      .where(eq(events.status, 'upcoming'))
      .orderBy(events.startTime)
      .limit(limit);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updatedEvent] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return updatedEvent;
  }

  // Opportunity operations
  async getOpportunities(): Promise<Opportunity[]> {
    return db.select().from(opportunities);
  }

  async getOpportunity(id: number): Promise<Opportunity | undefined> {
    const [opportunity] = await db.select()
      .from(opportunities)
      .where(eq(opportunities.id, id));
    return opportunity;
  }

  async getActiveOpportunities(): Promise<Opportunity[]> {
    return db.select()
      .from(opportunities)
      .where(eq(opportunities.isActive, true));
  }

  async getHighProfitOpportunities(limit: number = 4): Promise<Opportunity[]> {
    return db.select()
      .from(opportunities)
      .where(eq(opportunities.isActive, true))
      .orderBy(desc(opportunities.profitPercent))
      .limit(limit);
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const [opportunity] = await db.insert(opportunities).values(insertOpportunity).returning();
    return opportunity;
  }

  async updateOpportunity(id: number, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined> {
    const [updatedOpportunity] = await db.update(opportunities)
      .set(data)
      .where(eq(opportunities.id, id))
      .returning();
    return updatedOpportunity;
  }

  // Activity operations
  async getActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    return db.select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db.insert(activityLogs).values(insertLog).returning();
    return log;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    activeOpportunitiesCount: number;
    averageProfitPercent: number;
    highestProfitPercent: number;
    highestProfitOpportunityId?: number;
  }> {
    // Get active opportunities count
    const [{ value: activeCount }] = await db.select({
      value: count(opportunities.id)
    })
    .from(opportunities)
    .where(eq(opportunities.isActive, true));
    
    // Get average profit percent
    const [avgProfit] = await db.select({
      value: avg(opportunities.profitPercent)
    })
    .from(opportunities)
    .where(eq(opportunities.isActive, true));
    
    // Get highest profit opportunity
    const [highestProfit] = await db.select({
      id: opportunities.id,
      profit: max(opportunities.profitPercent)
    })
    .from(opportunities)
    .where(eq(opportunities.isActive, true));
    
    return {
      activeOpportunitiesCount: Number(activeCount) || 0,
      averageProfitPercent: Number(avgProfit?.value) || 0,
      highestProfitPercent: Number(highestProfit?.profit) || 0,
      highestProfitOpportunityId: highestProfit?.id
    };
  }
  
  // Sports distribution
  async getSportsDistribution(): Promise<{ sportId: number, sportName: string, count: number }[]> {
    // Complex query to get the distribution of active opportunities by sport
    const result = await db.select({
      sportId: sports.id,
      sportName: sports.name,
      count: count(opportunities.id)
    })
    .from(sports)
    .leftJoin(events, eq(events.sportId, sports.id))
    .leftJoin(opportunities, eq(opportunities.eventId, events.id))
    .where(eq(opportunities.isActive, true))
    .groupBy(sports.id, sports.name);
    
    return result.map(item => ({
      sportId: item.sportId,
      sportName: item.sportName,
      count: Number(item.count) || 0
    }));
  }

  // Seed the database with initial data
  async seedDatabase(): Promise<void> {
    // Check if we already have data
    const [bookmakerCount] = await db.select({ 
      count: count() 
    }).from(bookmakers);
    
    if (Number(bookmakerCount.count) > 0) {
      return; // Database already has data, no need to seed
    }

    // Seed bookmakers
    const bookmakerData: InsertBookmaker[] = [
      { name: "Bet365", logo: "bet365-logo", active: true },
      { name: "Betway", logo: "betway-logo", active: true },
      { name: "888sport", logo: "888sport-logo", active: true },
      { name: "Unibet", logo: "unibet-logo", active: true },
      { name: "William Hill", logo: "williamhill-logo", active: true }
    ];
    
    await db.insert(bookmakers).values(bookmakerData);
    
    // Seed sports
    const sportsData: InsertSport[] = [
      { name: "Football", icon: "football-icon", active: true },
      { name: "Tennis", icon: "tennis-icon", active: true },
      { name: "Basketball", icon: "basketball-icon", active: true },
      { name: "Hockey", icon: "hockey-icon", active: true }
    ];
    
    await db.insert(sports).values(sportsData);
    
    // Seed events
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    
    const fourDaysLater = new Date();
    fourDaysLater.setDate(fourDaysLater.getDate() + 4);
    
    const eventsData: InsertEvent[] = [
      { 
        name: "Barcelona vs Real Madrid", 
        sportId: 1, 
        startTime: tomorrow,
        competition: "La Liga",
        status: "upcoming"
      },
      { 
        name: "Djokovic vs Nadal", 
        sportId: 2, 
        startTime: dayAfterTomorrow,
        competition: "ATP Masters",
        status: "upcoming"
      },
      { 
        name: "Lakers vs Warriors", 
        sportId: 3, 
        startTime: threeDaysLater,
        competition: "NBA",
        status: "upcoming"
      },
      { 
        name: "Bruins vs Canadiens", 
        sportId: 4, 
        startTime: dayAfterTomorrow,
        competition: "NHL",
        status: "upcoming"
      },
      { 
        name: "Manchester United vs Liverpool", 
        sportId: 1, 
        startTime: fourDaysLater,
        competition: "Premier League",
        status: "upcoming"
      },
      { 
        name: "Murray vs Federer", 
        sportId: 2, 
        startTime: threeDaysLater,
        competition: "Wimbledon",
        status: "upcoming"
      }
    ];
    
    const insertedEvents = await db.insert(events).values(eventsData).returning({
      id: events.id
    });
    
    // Seed opportunities
    const opportunitiesData: InsertOpportunity[] = [
      {
        eventId: insertedEvents[0].id,
        market: "Match Result",
        bookmaker1Id: 1,
        bookmaker2Id: 2,
        odds1: "2.25",
        odds2: "2.35",
        profitPercent: "3.8",
        recommendedInvestment: "100",
        isActive: true
      },
      {
        eventId: insertedEvents[1].id,
        market: "Match Winner",
        bookmaker1Id: 3,
        bookmaker2Id: 4,
        odds1: "1.85",
        odds2: "2.10",
        profitPercent: "2.5",
        recommendedInvestment: "200",
        isActive: true
      },
      {
        eventId: insertedEvents[2].id,
        market: "Match Winner",
        bookmaker1Id: 2,
        bookmaker2Id: 5,
        odds1: "1.95",
        odds2: "2.05",
        profitPercent: "1.8",
        recommendedInvestment: "300",
        isActive: true
      },
      {
        eventId: insertedEvents[3].id,
        market: "Match Winner",
        bookmaker1Id: 1,
        bookmaker2Id: 3,
        odds1: "1.75",
        odds2: "2.25",
        profitPercent: "2.2",
        recommendedInvestment: "150",
        isActive: true
      }
    ];
    
    const insertedOpportunities = await db.insert(opportunities).values(opportunitiesData).returning({
      id: opportunities.id
    });
    
    // Seed activity logs
    const activityLogsData: InsertActivityLog[] = [
      {
        type: "new_opportunity",
        message: "New opportunity found: Barcelona vs Real Madrid",
        relatedOpportunityId: insertedOpportunities[0].id
      },
      {
        type: "new_opportunity",
        message: "New opportunity found: Djokovic vs Nadal",
        relatedOpportunityId: insertedOpportunities[1].id
      },
      {
        type: "odds_change",
        message: "Odds for Barcelona vs Real Madrid changed from 2.20 to 2.25",
        relatedOpportunityId: insertedOpportunities[0].id
      },
      {
        type: "system_update",
        message: "System updated with 3 new bookmakers",
        relatedOpportunityId: null
      }
    ];
    
    await db.insert(activityLogs).values(activityLogsData);
  }
}

export const storage = new DatabaseStorage();