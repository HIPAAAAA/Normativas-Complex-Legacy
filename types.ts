export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  discord: string;
  status: 'online' | 'offline' | 'busy' | 'idle';
}

export interface Rule {
  id: string;
  title: string;
  content: string; // HTML content
  lastUpdated: string;
  author: string;
}

export interface Faction {
  id: string;
  name: string;
  slug: string;
  icon: string; // URL
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  discordUrl: string;
  applyUrl: string;
  bannerUrl?: string; 
  members: Member[];
  rules: Rule[];
}

export interface GenericCategory {
  id: string;
  name: string;
  slug: string; // 'general' | 'illegal'
  description: string;
  icon: string;
  bannerUrl: string;
  gradientFrom: string;
  gradientTo: string;
  rules: Rule[];
}

export interface User {
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  factionId?: string;
}