
import { Faction, GenericCategory, Rule } from '../types';
import { INITIAL_FACTIONS, INITIAL_GENERIC_CATEGORIES } from '../constants';

// Use relative URL. 
// In Vercel: /api points to our serverless function.
// In Local Dev: Vite proxy forwards /api to localhost:3001
const API_URL = '/api';

class FactionService {
  private factionsTemplate: Faction[] = [...INITIAL_FACTIONS];
  private genericTemplate: GenericCategory[] = [...INITIAL_GENERIC_CATEGORIES];
  private hasAttemptedSeed = false;

  constructor() {}

  // --- SEEDING LOGIC ---
  private async seedDatabase() {
    if (this.hasAttemptedSeed) return;
    this.hasAttemptedSeed = true;

    try {
        const allRules = [];

        // Collect Faction Rules
        this.factionsTemplate.forEach(f => {
            f.rules.forEach(r => {
                allRules.push({ ...r, slug: f.slug, type: 'faction' });
            });
        });

        // Collect Generic Rules
        this.genericTemplate.forEach(c => {
            c.rules.forEach(r => {
                allRules.push({ ...r, slug: c.slug, type: 'generic' });
            });
        });

        console.log("Seeding database with initial data...");
        const res = await fetch(`${API_URL}/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rules: allRules })
        });
        // Check if response is JSON (it might be HTML error if backend is down)
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const json = await res.json();
            console.log("Seed result:", json);
        }
    } catch (e) {
        console.error("Failed to seed database:", e);
    }
  }

  // --- FACTIONS ---
  async getFactions(): Promise<Faction[]> {
    try {
        const response = await fetch(`${API_URL}/rules?type=faction`);
        if (!response.ok) throw new Error("Failed to fetch rules");
        
        const dbRules: Rule[] = await response.json();

        // If DB is empty, try to seed it
        if (dbRules.length === 0) {
            await this.seedDatabase();
            // Return template for now
            return this.factionsTemplate;
        }

        // Map rules to their respective factions
        return this.factionsTemplate.map(f => ({
            ...f,
            rules: dbRules.filter(r => (r as any).slug === f.slug)
        }));
    } catch (error) {
        console.warn("Backend offline or unreachable. Using static data.", error);
        return this.factionsTemplate;
    }
  }

  async getFactionBySlug(slug: string): Promise<Faction | undefined> {
    const factions = await this.getFactions();
    return factions.find(f => f.slug === slug);
  }

  // --- GENERIC CATEGORIES ---
  async getGenericCategory(slug: string): Promise<GenericCategory | undefined> {
    try {
        const response = await fetch(`${API_URL}/rules?type=generic&slug=${slug}`);
        if (!response.ok) throw new Error("Failed to fetch generic rules");
        
        const dbRules: Rule[] = await response.json();

        if (dbRules.length === 0) {
            await this.seedDatabase();
            const template = this.genericTemplate.find(c => c.slug === slug);
            return template;
        }

        const template = this.genericTemplate.find(c => c.slug === slug);
        if (!template) return undefined;

        return {
            ...template,
            rules: dbRules
        };
    } catch (error) {
        console.warn("Backend offline or unreachable. Using static data.", error);
        return this.genericTemplate.find(c => c.slug === slug);
    }
  }

  // --- AI CONTEXT HELPER ---
  async getAllRulesContext(): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/rules`);
        if (!response.ok) throw new Error("Backend offline");
        const allRules: (Rule & { slug: string, type: string })[] = await response.json();

        if (allRules.length === 0) return "No hay normativas en la base de datos.";

        let context = "Eres el asistente de IA del servidor de Roleplay 'Complex Legacy'. Tu trabajo es responder preguntas sobre las normativas basándote EXCLUSIVAMENTE en la siguiente información:\n\n";

        const grouped: Record<string, Rule[]> = {};
        allRules.forEach(r => {
            const key = `${r.type.toUpperCase()} - ${r.slug.toUpperCase()}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(r);
        });

        Object.entries(grouped).forEach(([section, rules]) => {
            context += `=== SECCIÓN: ${section} ===\n`;
            rules.forEach(rule => {
                 context += `Título: ${rule.title}\nContenido: ${this.stripHtml(rule.content)}\n\n`;
            });
        });

        return context;
    } catch (e) {
        // Fallback to static data for AI if backend is down
        return "El servidor de base de datos no está disponible. No puedo consultar las reglas en vivo.";
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
  }

  // --- RULES MANAGEMENT (CRUD) ---
  
  async addRule(
    targetSlug: string, 
    type: 'faction' | 'generic', 
    ruleData: Omit<Rule, 'id' | 'lastUpdated'>
  ): Promise<Rule> {
    const payload = {
        ...ruleData,
        slug: targetSlug,
        type
    };

    const response = await fetch(`${API_URL}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Failed to add rule");
    return await response.json();
  }

  async updateRule(
    targetSlug: string,
    type: 'faction' | 'generic',
    ruleId: string,
    ruleData: Partial<Rule>
  ): Promise<Rule> {
     const response = await fetch(`${API_URL}/rules/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
    });
    
    if (!response.ok) throw new Error("Failed to update rule");
    return await response.json();
  }

  async deleteRule(
    targetSlug: string,
    type: 'faction' | 'generic',
    ruleId: string
  ): Promise<void> {
    const response = await fetch(`${API_URL}/rules/${ruleId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error("Failed to delete rule");
  }

  async moveRule(
    targetSlug: string,
    type: 'faction' | 'generic',
    ruleId: string,
    direction: 'up' | 'down'
  ): Promise<void> {
    // 1. Get current list to find neighbor
    let rules: Rule[] = [];
    if (type === 'faction') {
        const factions = await this.getFactions();
        rules = factions.find(f => f.slug === targetSlug)?.rules || [];
    } else {
        const cat = await this.getGenericCategory(targetSlug);
        rules = cat?.rules || [];
    }

    const currentIndex = rules.findIndex(r => r.id === ruleId);
    if (currentIndex === -1) return;

    let swapId = null;
    if (direction === 'up' && currentIndex > 0) {
        swapId = rules[currentIndex - 1].id;
    } else if (direction === 'down' && currentIndex < rules.length - 1) {
        swapId = rules[currentIndex + 1].id;
    }

    if (swapId) {
        await fetch(`${API_URL}/rules/swap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id1: ruleId, id2: swapId })
        });
    }
  }
}

export const factionService = new FactionService();
