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
    try {
      // Get active opportunities count
      const activeCountResult = await db.select({
        count: count(),
      })
      .from(opportunities)
      .where(eq(opportunities.isActive, true));
      
      const activeCount = activeCountResult[0]?.count || 0;
      
      // Get average profit percent
      const avgProfitResult = await db.select({
        avg: sql<number>`avg(${opportunities.profitPercent})`,
      })
      .from(opportunities)
      .where(eq(opportunities.isActive, true));
      
      const avgProfit = avgProfitResult[0]?.avg || 0;
      
      // Get highest profit opportunity
      const highestProfitResult = await db
        .select({
          id: opportunities.id,
          profit: opportunities.profitPercent,
        })
        .from(opportunities)
        .where(eq(opportunities.isActive, true))
        .orderBy(desc(opportunities.profitPercent))
        .limit(1);
      
      const highestProfit = highestProfitResult[0]?.profit || 0;
      const highestProfitId = highestProfitResult[0]?.id;
      
      return {
        activeOpportunitiesCount: Number(activeCount),
        averageProfitPercent: Number(avgProfit),
        highestProfitPercent: Number(highestProfit),
        highestProfitOpportunityId: highestProfitId
      };
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      return {
        activeOpportunitiesCount: 0,
        averageProfitPercent: 0,
        highestProfitPercent: 0
      };
    }
  }
  
  // Sports distribution
  async getSportsDistribution(): Promise<{ sportId: number, sportName: string, count: number }[]> {
    try {
      // Get all sports first
      const allSports = await db.select({
        id: sports.id,
        name: sports.name
      }).from(sports);
      
      // Then get the counts of active opportunities by sport
      const opportunityCounts = await db
        .select({
          sportId: sports.id,
          count: count(opportunities.id)
        })
        .from(opportunities)
        .innerJoin(events, eq(opportunities.eventId, events.id))
        .innerJoin(sports, eq(events.sportId, sports.id))
        .where(eq(opportunities.isActive, true))
        .groupBy(sports.id);
      
      // Map sports to their opportunity counts
      const countMap = new Map();
      opportunityCounts.forEach(item => {
        countMap.set(item.sportId, Number(item.count));
      });
      
      // Combine the data
      return allSports.map(sport => ({
        sportId: sport.id,
        sportName: sport.name,
        count: countMap.get(sport.id) || 0
      }));
    } catch (error) {
      console.error("Error in getSportsDistribution:", error);
      return [];
    }
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

    // Seed Brazilian bookmakers
    const bookmakerData: InsertBookmaker[] = [
      { name: "Bet365", logo: "bet365-logo", active: true },
      { name: "Betano", logo: "betano-logo", active: true },
      { name: "KTO", logo: "kto-logo", active: true },
      { name: "Sportingbet", logo: "sportingbet-logo", active: true },
      { name: "Superbet", logo: "superbet-logo", active: true },
      { name: "Galera.bet", logo: "galerabet-logo", active: true },
      { name: "Betsson", logo: "betsson-logo", active: true },
      { name: "Parimatch", logo: "parimatch-logo", active: true }
    ];
    
    await db.insert(bookmakers).values(bookmakerData);
    
    // Seed sports popular in Brazil
    const sportsData: InsertSport[] = [
      { name: "Futebol", icon: "football-icon", active: true },
      { name: "Basquete", icon: "basketball-icon", active: true },
      { name: "Vôlei", icon: "volleyball-icon", active: true },
      { name: "Tênis", icon: "tennis-icon", active: true },
      { name: "MMA", icon: "mma-icon", active: true },
      { name: "Formula 1", icon: "f1-icon", active: true }
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
        name: "Flamengo vs Palmeiras", 
        sportId: 1, 
        startTime: tomorrow,
        competition: "Brasileirão Série A",
        status: "upcoming"
      },
      { 
        name: "Corinthians vs São Paulo", 
        sportId: 1, 
        startTime: dayAfterTomorrow,
        competition: "Brasileirão Série A",
        status: "upcoming"
      },
      { 
        name: "Santos vs Fluminense", 
        sportId: 1, 
        startTime: tomorrow,
        competition: "Brasileirão Série A",
        status: "upcoming"
      },
      { 
        name: "Flamengo Basquete vs Franca", 
        sportId: 2, 
        startTime: dayAfterTomorrow,
        competition: "NBB",
        status: "upcoming"
      },
      { 
        name: "Sesi Franca vs Minas", 
        sportId: 2, 
        startTime: tomorrow,
        competition: "NBB",
        status: "upcoming"
      },
      { 
        name: "Sada Cruzeiro vs Minas", 
        sportId: 3, 
        startTime: tomorrow,
        competition: "Superliga",
        status: "upcoming"
      },
      { 
        name: "Alcaraz vs Sinner", 
        sportId: 4, 
        startTime: dayAfterTomorrow,
        competition: "Rio Open",
        status: "upcoming"
      },
      { 
        name: "Poatan vs Adesanya", 
        sportId: 5, 
        startTime: threeDaysLater,
        competition: "UFC",
        status: "upcoming"
      },
      { 
        name: "GP Brasil - Interlagos", 
        sportId: 6, 
        startTime: threeDaysLater,
        competition: "Formula 1",
        status: "upcoming"
      }
    ];
    
    const insertedEvents = await db.insert(events).values(eventsData).returning({
      id: events.id
    });
    
    // Seed opportunities with Brazilian markets and bookmakers
    const opportunitiesData: InsertOpportunity[] = [
      {
        eventId: insertedEvents[0].id,
        market: "Resultado da Partida",
        bookmaker1Id: 1, // Bet365
        bookmaker2Id: 2, // Betano
        odds1: "2.25",
        odds2: "2.35",
        profitPercent: "3.8",
        recommendedInvestment: "100",
        isActive: true
      },
      {
        eventId: insertedEvents[1].id,
        market: "Ambas Equipes Marcam",
        bookmaker1Id: 3, // KTO
        bookmaker2Id: 4, // Sportingbet
        odds1: "1.85",
        odds2: "2.10",
        profitPercent: "2.5",
        recommendedInvestment: "200",
        isActive: true
      },
      {
        eventId: insertedEvents[2].id,
        market: "Mais/Menos 2.5 Gols",
        bookmaker1Id: 2, // Betano
        bookmaker2Id: 5, // Superbet
        odds1: "1.95",
        odds2: "2.05",
        profitPercent: "1.8",
        recommendedInvestment: "300",
        isActive: true
      },
      {
        eventId: insertedEvents[3].id,
        market: "Vencedor",
        bookmaker1Id: 6, // Galera.bet
        bookmaker2Id: 7, // Betsson
        odds1: "1.75",
        odds2: "2.25",
        profitPercent: "2.2",
        recommendedInvestment: "150",
        isActive: true
      },
      {
        eventId: insertedEvents[4].id,
        market: "Handicap Asiático",
        bookmaker1Id: 1, // Bet365
        bookmaker2Id: 7, // Betsson
        odds1: "1.95",
        odds2: "2.01",
        profitPercent: "1.5",
        recommendedInvestment: "250",
        isActive: true
      },
      {
        eventId: insertedEvents[5].id,
        market: "Total de Sets",
        bookmaker1Id: 2, // Betano
        bookmaker2Id: 8, // Parimatch
        odds1: "2.40",
        odds2: "2.50",
        profitPercent: "4.1",
        recommendedInvestment: "120",
        isActive: true
      },
      {
        eventId: insertedEvents[6].id,
        market: "Vencedor do Primeiro Set",
        bookmaker1Id: 4, // Sportingbet
        bookmaker2Id: 5, // Superbet
        odds1: "1.60",
        odds2: "1.70",
        profitPercent: "2.0",
        recommendedInvestment: "180",
        isActive: true
      },
      {
        eventId: insertedEvents[7].id,
        market: "Vencedor por Nocaute",
        bookmaker1Id: 3, // KTO
        bookmaker2Id: 6, // Galera.bet
        odds1: "3.25",
        odds2: "3.40",
        profitPercent: "4.5",
        recommendedInvestment: "90",
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
        message: "Nova oportunidade encontrada: Flamengo vs Palmeiras",
        relatedOpportunityId: insertedOpportunities[0].id
      },
      {
        type: "new_opportunity",
        message: "Nova oportunidade encontrada: Corinthians vs São Paulo",
        relatedOpportunityId: insertedOpportunities[1].id
      },
      {
        type: "odds_change",
        message: "Odds para Flamengo vs Palmeiras alteradas de 2.20 para 2.25",
        relatedOpportunityId: insertedOpportunities[0].id
      },
      {
        type: "system_update",
        message: "Sistema atualizado com bookmakers brasileiras",
        relatedOpportunityId: null
      },
      {
        type: "new_opportunity",
        message: "Nova oportunidade encontrada: Santos vs Fluminense",
        relatedOpportunityId: insertedOpportunities[2].id
      },
      {
        type: "new_opportunity",
        message: "Nova oportunidade encontrada: Flamengo Basquete vs Franca",
        relatedOpportunityId: insertedOpportunities[3].id
      }
    ];
    
    await db.insert(activityLogs).values(activityLogsData);
  }
}

export const storage = new DatabaseStorage();