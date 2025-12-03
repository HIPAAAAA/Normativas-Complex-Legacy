import { Faction, GenericCategory, Rule } from '../types';
import { INITIAL_FACTIONS, INITIAL_GENERIC_CATEGORIES } from '../constants';

class FactionService {
  private factions: Faction[] = [];
  private genericCategories: GenericCategory[] = [];

  constructor() {
    this.factions = [...INITIAL_FACTIONS];
    this.genericCategories = [...INITIAL_GENERIC_CATEGORIES];
  }

  // --- FACTIONS ---
  async getFactions(): Promise<Faction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.factions;
  }

  async getFactionBySlug(slug: string): Promise<Faction | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.factions.find(f => f.slug === slug);
  }

  // --- GENERIC CATEGORIES ---
  async getGenericCategory(slug: string): Promise<GenericCategory | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.genericCategories.find(c => c.slug === slug);
  }

  // --- AI CONTEXT HELPER ---
  async getAllRulesContext(): Promise<string> {
    let context = "Eres el asistente de IA del servidor de Roleplay 'Complex Legacy'. Tu trabajo es responder preguntas sobre las normativas basándote EXCLUSIVAMENTE en la siguiente información:\n\n";

    this.genericCategories.forEach(cat => {
        context += `=== NORMATIVAS ${cat.name.toUpperCase()} ===\n`;
        cat.rules.forEach(rule => {
            context += `Título: ${rule.title}\nContenido: ${this.stripHtml(rule.content)}\n\n`;
        });
    });

    this.factions.forEach(fac => {
        context += `=== NORMATIVAS FACCIÓN: ${fac.name.toUpperCase()} ===\n`;
        fac.rules.forEach(rule => {
             context += `Título: ${rule.title}\nContenido: ${this.stripHtml(rule.content)}\n\n`;
        });
    });

    return context;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
  }

  // --- RULES MANAGEMENT ---
  async addRule(
    targetSlug: string, 
    type: 'faction' | 'generic', 
    rule: Omit<Rule, 'id' | 'lastUpdated'>
  ): Promise<Rule> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use timestamp + random to ensure uniqueness and prevent UI keys overlap
    const newRule: Rule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      lastUpdated: new Date().toISOString()
    };

    if (type === 'faction') {
        const index = this.factions.findIndex(f => f.slug === targetSlug);
        if (index === -1) throw new Error("Faction not found");
        this.factions[index].rules.push(newRule);
    } else {
        const index = this.genericCategories.findIndex(c => c.slug === targetSlug);
        if (index === -1) throw new Error("Category not found");
        this.genericCategories[index].rules.push(newRule);
    }
    
    return newRule;
  }

  async updateRule(
    targetSlug: string,
    type: 'faction' | 'generic',
    ruleId: string,
    updatedData: Partial<Rule>
  ): Promise<Rule> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let rules: Rule[];
    
    if (type === 'faction') {
        const index = this.factions.findIndex(f => f.slug === targetSlug);
        if (index === -1) throw new Error("Faction not found");
        rules = this.factions[index].rules;
    } else {
        const index = this.genericCategories.findIndex(c => c.slug === targetSlug);
        if (index === -1) throw new Error("Category not found");
        rules = this.genericCategories[index].rules;
    }

    const ruleIndex = rules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) throw new Error("Rule not found");

    const updatedRule = {
        ...rules[ruleIndex],
        ...updatedData,
        lastUpdated: new Date().toISOString()
    };

    rules[ruleIndex] = updatedRule;
    return updatedRule;
  }

  async deleteRule(targetSlug: string, type: 'faction' | 'generic', ruleId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (type === 'faction') {
        const index = this.factions.findIndex(f => f.slug === targetSlug);
        if (index === -1) throw new Error("Faction not found");
        this.factions[index].rules = this.factions[index].rules.filter(r => r.id !== ruleId);
    } else {
        const index = this.genericCategories.findIndex(c => c.slug === targetSlug);
        if (index === -1) throw new Error("Category not found");
        this.genericCategories[index].rules = this.genericCategories[index].rules.filter(r => r.id !== ruleId);
    }
  }

  async moveRule(
    targetSlug: string,
    type: 'faction' | 'generic',
    ruleId: string,
    direction: 'up' | 'down'
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Fast response

    let rules: Rule[];
    if (type === 'faction') {
        const faction = this.factions.find(f => f.slug === targetSlug);
        if (!faction) return;
        rules = faction.rules;
    } else {
        const category = this.genericCategories.find(c => c.slug === targetSlug);
        if (!category) return;
        rules = category.rules;
    }

    const index = rules.findIndex(r => r.id === ruleId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
        // Swap with previous
        [rules[index - 1], rules[index]] = [rules[index], rules[index - 1]];
    } else if (direction === 'down' && index < rules.length - 1) {
        // Swap with next
        [rules[index], rules[index + 1]] = [rules[index + 1], rules[index]];
    }
  }
}

export const factionService = new FactionService();