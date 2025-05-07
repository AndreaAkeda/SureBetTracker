import { 
  users, type User, type InsertUser,
  bookmakers, type Bookmaker, type InsertBookmaker,
  sports, type Sport, type InsertSport,
  events, type Event, type InsertEvent,
  opportunities, type Opportunity, type InsertOpportunity,
  activityLogs, type ActivityLog, type InsertActivityLog
} from "@shared/schema";

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
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookmakers: Map<number, Bookmaker>;
  private sports: Map<number, Sport>;
  private events: Map<number, Event>;
  private opportunities: Map<number, Opportunity>;
  private activityLogs: Map<number, ActivityLog>;

  private currentIds: {
    users: number;
    bookmakers: number;
    sports: number;
    events: number;
    opportunities: number;
    activityLogs: number;
  };

  constructor() {
    this.users = new Map();
    this.bookmakers = new Map();
    this.sports = new Map();
    this.events = new Map();
    this.opportunities = new Map();
    this.activityLogs = new Map();

    this.currentIds = {
      users: 1,
      bookmakers: 1,
      sports: 1,
      events: 1,
      opportunities: 1,
      activityLogs: 1
    };

    // Seed initial data
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Bookmaker methods
  async getBookmakers(): Promise<Bookmaker[]> {
    return Array.from(this.bookmakers.values());
  }

  async getBookmaker(id: number): Promise<Bookmaker | undefined> {
    return this.bookmakers.get(id);
  }

  async createBookmaker(insertBookmaker: InsertBookmaker): Promise<Bookmaker> {
    const id = this.currentIds.bookmakers++;
    const bookmaker: Bookmaker = { ...insertBookmaker, id };
    this.bookmakers.set(id, bookmaker);
    return bookmaker;
  }

  async updateBookmaker(id: number, data: Partial<InsertBookmaker>): Promise<Bookmaker | undefined> {
    const bookmaker = this.bookmakers.get(id);
    if (!bookmaker) return undefined;
    
    const updated = { ...bookmaker, ...data };
    this.bookmakers.set(id, updated);
    return updated;
  }

  // Sport methods
  async getSports(): Promise<Sport[]> {
    return Array.from(this.sports.values());
  }

  async getSport(id: number): Promise<Sport | undefined> {
    return this.sports.get(id);
  }

  async createSport(insertSport: InsertSport): Promise<Sport> {
    const id = this.currentIds.sports++;
    const sport: Sport = { ...insertSport, id };
    this.sports.set(id, sport);
    return sport;
  }

  async updateSport(id: number, data: Partial<InsertSport>): Promise<Sport | undefined> {
    const sport = this.sports.get(id);
    if (!sport) return undefined;
    
    const updated = { ...sport, ...data };
    this.sports.set(id, updated);
    return updated;
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => event.status === 'upcoming')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, limit);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentIds.events++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updated = { ...event, ...data };
    this.events.set(id, updated);
    return updated;
  }

  // Opportunity methods
  async getOpportunities(): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values());
  }

  async getOpportunity(id: number): Promise<Opportunity | undefined> {
    return this.opportunities.get(id);
  }

  async getActiveOpportunities(): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values())
      .filter(opp => opp.isActive);
  }

  async getHighProfitOpportunities(limit: number = 4): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values())
      .filter(opp => opp.isActive)
      .sort((a, b) => Number(b.profitPercent) - Number(a.profitPercent))
      .slice(0, limit);
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const id = this.currentIds.opportunities++;
    const opportunity: Opportunity = { 
      ...insertOpportunity, 
      id, 
      createdAt: new Date() 
    };
    this.opportunities.set(id, opportunity);
    return opportunity;
  }

  async updateOpportunity(id: number, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined> {
    const opportunity = this.opportunities.get(id);
    if (!opportunity) return undefined;
    
    const updated = { ...opportunity, ...data };
    this.opportunities.set(id, updated);
    return updated;
  }

  // Activity methods
  async getActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentIds.activityLogs++;
    const log: ActivityLog = { 
      ...insertLog, 
      id, 
      createdAt: new Date() 
    };
    this.activityLogs.set(id, log);
    return log;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    activeOpportunitiesCount: number;
    averageProfitPercent: number;
    highestProfitPercent: number;
    highestProfitOpportunityId?: number;
  }> {
    const activeOpportunities = await this.getActiveOpportunities();
    
    if (activeOpportunities.length === 0) {
      return {
        activeOpportunitiesCount: 0,
        averageProfitPercent: 0,
        highestProfitPercent: 0
      };
    }
    
    const totalProfit = activeOpportunities.reduce((sum, opp) => sum + Number(opp.profitPercent), 0);
    const averageProfitPercent = totalProfit / activeOpportunities.length;
    
    const highestProfitOpp = activeOpportunities.reduce((max, opp) => 
      Number(opp.profitPercent) > Number(max.profitPercent) ? opp : max, 
      activeOpportunities[0]
    );
    
    return {
      activeOpportunitiesCount: activeOpportunities.length,
      averageProfitPercent: parseFloat(averageProfitPercent.toFixed(2)),
      highestProfitPercent: Number(highestProfitOpp.profitPercent),
      highestProfitOpportunityId: highestProfitOpp.id
    };
  }
  
  // Sports distribution
  async getSportsDistribution(): Promise<{ sportId: number, sportName: string, count: number }[]> {
    const sports = await this.getSports();
    const activeOpportunities = await this.getActiveOpportunities();
    const events = await this.getEvents();
    
    const sportCounts = new Map<number, number>();
    
    // Initialize counts
    for (const sport of sports) {
      sportCounts.set(sport.id, 0);
    }
    
    // Count opportunities by sport
    for (const opp of activeOpportunities) {
      const event = events.find(e => e.id === opp.eventId);
      if (event) {
        const currentCount = sportCounts.get(event.sportId) || 0;
        sportCounts.set(event.sportId, currentCount + 1);
      }
    }
    
    // Format the results
    return Array.from(sportCounts.entries())
      .map(([sportId, count]) => {
        const sport = sports.find(s => s.id === sportId);
        return {
          sportId,
          sportName: sport ? sport.name : 'Unknown',
          count
        };
      })
      .sort((a, b) => b.count - a.count);
  }

  // Seed initial data for demo purposes
  private seedData() {
    // Seed bookmakers
    const bookmakers: InsertBookmaker[] = [
      { name: "Bet365", logo: "bet365-logo", active: true },
      { name: "William Hill", logo: "william-hill-logo", active: true },
      { name: "Betfair", logo: "betfair-logo", active: true },
      { name: "Unibet", logo: "unibet-logo", active: true },
      { name: "888Sport", logo: "888sport-logo", active: true }
    ];
    
    bookmakers.forEach(bm => this.createBookmaker(bm));
    
    // Seed sports
    const sports: InsertSport[] = [
      { name: "Football", icon: "football-icon", active: true },
      { name: "Basketball", icon: "basketball-icon", active: true },
      { name: "Tennis", icon: "tennis-icon", active: true },
      { name: "Ice Hockey", icon: "hockey-icon", active: true },
      { name: "Baseball", icon: "baseball-icon", active: true }
    ];
    
    sports.forEach(sport => this.createSport(sport));
    
    // Seed events
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const may15 = new Date(now);
    may15.setDate(15);
    may15.setMonth(4); // May is 4 (0-indexed months)
    
    const may16 = new Date(may15);
    may16.setDate(16);
    
    const events: InsertEvent[] = [
      { 
        name: "Barcelona vs Real Madrid", 
        sportId: 1, 
        startTime: now,
        competition: "La Liga", 
        status: "upcoming" 
      },
      { 
        name: "Lakers vs Bulls", 
        sportId: 2, 
        startTime: now,
        competition: "NBA", 
        status: "upcoming" 
      },
      { 
        name: "Djokovic vs Nadal", 
        sportId: 3, 
        startTime: tomorrow,
        competition: "Roland Garros", 
        status: "upcoming" 
      },
      { 
        name: "Liverpool vs Manchester City", 
        sportId: 1, 
        startTime: tomorrow,
        competition: "Premier League", 
        status: "upcoming" 
      },
      { 
        name: "Warriors vs Suns", 
        sportId: 2, 
        startTime: may15,
        competition: "NBA", 
        status: "upcoming" 
      },
      { 
        name: "Bayern Munich vs Dortmund", 
        sportId: 1, 
        startTime: may16,
        competition: "Bundesliga", 
        status: "upcoming" 
      },
      { 
        name: "Arsenal vs Chelsea", 
        sportId: 1, 
        startTime: new Date(now.getTime() - 60 * 60 * 1000),
        competition: "Premier League", 
        status: "completed" 
      }
    ];
    
    events.forEach(event => this.createEvent(event));
    
    // Seed opportunities
    const opportunities: InsertOpportunity[] = [
      {
        eventId: 1,
        market: "Match Result",
        bookmaker1Id: 1,
        bookmaker2Id: 3,
        odds1: 2.10,
        odds2: 1.92,
        profitPercent: 8.4,
        recommendedInvestment: 1000,
        isActive: true
      },
      {
        eventId: 2,
        market: "Total Points",
        bookmaker1Id: 2,
        bookmaker2Id: 5,
        odds1: 1.85,
        odds2: 2.20,
        profitPercent: 7.2,
        recommendedInvestment: 500,
        isActive: true
      },
      {
        eventId: 3,
        market: "Match Winner",
        bookmaker1Id: 4,
        bookmaker2Id: 1,
        odds1: 2.40,
        odds2: 1.75,
        profitPercent: 5.8,
        recommendedInvestment: 750,
        isActive: true
      },
      {
        eventId: 4,
        market: "Over/Under 2.5",
        bookmaker1Id: 2,
        bookmaker2Id: 3,
        odds1: 1.95,
        odds2: 2.05,
        profitPercent: 4.6,
        recommendedInvestment: 800,
        isActive: true
      },
      {
        eventId: 7,
        market: "First Goal",
        bookmaker1Id: 1,
        bookmaker2Id: 4,
        odds1: 2.00,
        odds2: 2.10,
        profitPercent: 3.5,
        recommendedInvestment: 600,
        isActive: false
      }
    ];
    
    opportunities.forEach(opp => this.createOpportunity(opp));
    
    // Seed activity logs
    const activityLogs: InsertActivityLog[] = [
      {
        type: "new_opportunity",
        message: "New arbitrage opportunity found",
        relatedOpportunityId: 1
      },
      {
        type: "odds_change",
        message: "Odds changing rapidly",
        relatedOpportunityId: 2
      },
      {
        type: "opportunity_expired",
        message: "Arbitrage opportunity expired",
        relatedOpportunityId: 5
      },
      {
        type: "system_update",
        message: "System update completed"
      }
    ];
    
    activityLogs.forEach(log => this.createActivityLog(log));
  }
}

export const storage = new MemStorage();
