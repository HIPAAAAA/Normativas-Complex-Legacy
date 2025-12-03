import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { Faction, User, GenericCategory, Rule } from './types';
import { factionService } from './services/factionService';
import RichTextEditor from './components/RichTextEditor';
import { INITIAL_GENERIC_CATEGORIES, LOGO_URL } from './constants';
import AiAssistant from './components/AiAssistant';

// --- TYPES FOR VIEW STATE ---
type ViewState = 'landing' | 'factions_list' | 'faction_detail' | 'generic_detail';

// --- SHARED 3D CARD COMPONENT ---
interface CardProps {
  title: string;
  description: string;
  image: string; // Icon or Image URL
  gradientFrom: string;
  gradientTo: string;
  onClick: () => void;
  isIcon?: boolean; 
  variant?: 'default' | 'round';
}

const PerspectiveCard: React.FC<CardProps> = ({ title, description, image, gradientFrom, gradientTo, onClick, isIcon = false, variant = 'default' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      className="relative h-96 w-full cursor-pointer perspective-1000"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className="w-full h-full relative rounded-2xl bg-[#0F0F11] border border-white/10 overflow-hidden shadow-2xl transition-transform duration-200 ease-out group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10" style={{ transform: 'translateZ(20px)' }}>
          <div className="relative mb-6">
            <img 
              src={image} 
              alt={title} 
              className={`object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(140,120,255,0.4)] group-hover:drop-shadow-[0_10px_30px_rgba(140,120,255,0.6)] ${isIcon ? 'w-32 h-32' : 'w-24 h-24'} ${variant === 'round' ? 'rounded-full' : ''}`} 
            />
          </div>
          
          <h3 className="text-2xl font-display font-black italic text-white mb-2 tracking-wide drop-shadow-lg uppercase leading-tight py-1">
            {title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-4 max-w-[90%] font-light leading-relaxed">
            {description}
          </p>

          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
             <span className="px-4 py-2 rounded-full bg-white/5 border border-white/20 text-[10px] font-bold text-highlight uppercase tracking-widest backdrop-blur-sm">
               Entrar
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- RULES SECTION (Reusable) ---
interface RulesSectionProps {
  title: string;
  rules: Rule[];
  user: User | null;
  onAddRule: (title: string, content: string) => Promise<void>;
  onUpdateRule: (id: string, title: string, content: string) => Promise<void>;
  onDeleteRule: (id: string) => Promise<void>;
  onMoveRule: (id: string, direction: 'up' | 'down') => Promise<void>;
  isIconVisible?: boolean;
  icon?: string;
  colorClass?: string;
}

const RulesSection: React.FC<RulesSectionProps> = ({ title, rules, user, onAddRule, onUpdateRule, onDeleteRule, onMoveRule, isIconVisible = true, icon, colorClass = "bg-highlight" }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const formRef = useRef<HTMLDivElement>(null);

  const filteredRules = rules.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (rule: Rule) => {
    setEditingId(rule.id);
    setNewTitle(rule.title);
    setNewContent(rule.content);
    setIsFormOpen(true);
    // Use timeout to ensure DOM renders before scrolling
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setNewTitle('');
    setNewContent('');
    setIsFormOpen(true);
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmit = async () => {
    if (!newTitle || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
        if (editingId) {
            await onUpdateRule(editingId, newTitle, newContent);
        } else {
            await onAddRule(newTitle, newContent);
        }

        setNewTitle('');
        setNewContent('');
        setEditingId(null);
        setIsFormOpen(false);
    } finally {
        setIsSubmitting(false);
    }
  };

  const scrollToRule = (id: string) => {
    const el = document.getElementById(`rule-${id}`);
    if(el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: INDEX & SEARCH */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24 shadow-lg">
            <h3 className="text-lg font-display font-black italic text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                Índice
            </h3>
            
            {/* Search Bar */}
            <div className="relative mb-6">
                <input 
                    type="text" 
                    placeholder="Buscar en normativas..." 
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Table of Contents */}
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredRules.length > 0 ? (
                    filteredRules.map((rule, idx) => (
                        <div key={`idx-${rule.id}`} className="flex items-center group/item">
                             <button 
                                onClick={() => scrollToRule(rule.id)}
                                className="flex-1 text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all truncate border-l-2 border-transparent hover:border-accent"
                            >
                                {rule.title}
                            </button>
                            {user && !searchTerm && (
                                <div className="flex flex-col opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onMoveRule(rule.id, 'up')}
                                        disabled={idx === 0}
                                        className="text-gray-500 hover:text-accent disabled:opacity-30 p-0.5"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => onMoveRule(rule.id, 'down')}
                                        disabled={idx === filteredRules.length - 1}
                                        className="text-gray-500 hover:text-accent disabled:opacity-30 p-0.5"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-600 italic px-2">No se encontraron resultados.</p>
                )}
            </div>
        </div>
      </div>

      {/* RIGHT: RULES CONTENT */}
      <div className="lg:col-span-8">
        <div className="bg-[#121214]/60 backdrop-blur-md border border-white/5 rounded-2xl p-8 min-h-[600px] relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-0 opacity-[0.05] pointer-events-none z-0">
                <img src={icon || LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale rounded-full" alt="watermark" />
            </div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-3xl font-display font-black italic text-white flex items-center gap-3 uppercase tracking-tighter leading-tight py-1">
                <div className={`w-1.5 h-8 ${colorClass} rounded-full shadow-[0_0_10px_currentColor]`}></div>
                {title}
                </h3>
                {user && (
                <button 
                    onClick={isFormOpen ? () => setIsFormOpen(false) : handleCreateClick}
                    className="px-4 py-2 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg transition-all border border-accent/20 font-medium text-xs uppercase tracking-wider flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFormOpen ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} /></svg>
                    {isFormOpen ? 'Cancelar' : 'Agregar'}
                </button>
                )}
            </div>

            {/* Add/Edit Rule Form */}
            {isFormOpen && (
                <div ref={formRef} className="mb-10 p-6 bg-[#0a0a0c] rounded-2xl border border-accent/30 shadow-2xl relative z-10 animate-in fade-in zoom-in-95">
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-b border-white/10 pb-2">
                    {editingId ? 'Editar Normativa' : 'Nueva Normativa'}
                </h4>
                <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:border-accent focus:ring-1 focus:ring-accent outline-none font-display font-bold italic text-xl"
                    placeholder="Título de la normativa..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <div className="mb-6">
                    <RichTextEditor 
                    value={newContent} 
                    onChange={setNewContent}
                    label="Contenido"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button 
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                    Descartar
                    </button>
                    <button 
                    onClick={handleSubmit}
                    disabled={!newTitle || isSubmitting}
                    className="px-8 py-2 bg-gradient-to-r from-accent to-accent-deep text-white rounded-lg font-bold shadow-lg hover:shadow-accent/40 hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none text-sm uppercase tracking-wide flex items-center gap-2"
                    >
                    {isSubmitting ? (
                         <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Procesando
                         </>
                    ) : (
                        editingId ? 'Actualizar' : 'Publicar'
                    )}
                    </button>
                </div>
                </div>
            )}

            {/* Rules List */}
            <div className="space-y-6 relative z-10">
                {filteredRules.length > 0 ? (
                filteredRules.map((rule, idx) => (
                    <div id={`rule-${rule.id}`} key={rule.id} className="group relative">
                        {/* Connector Line Removed Here */}
                        
                        <div className="bg-gradient-to-br from-[#1a1a1c] to-transparent hover:from-white/[0.06] border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent/20">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-gray-500 font-display font-bold text-lg">
                                            {idx + 1}
                                        </div>
                                        <h4 className="text-xl md:text-2xl font-display font-black italic text-white group-hover:text-highlight transition-colors tracking-tighter leading-tight uppercase">
                                            {rule.title}
                                        </h4>
                                    </div>
                                    {user && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEditClick(rule)}
                                                className="text-gray-400 hover:text-accent hover:bg-accent/10 p-2 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => onDeleteRule(rule.id)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div 
                                className="text-gray-300 text-lg leading-loose prose prose-invert prose-lg prose-p:my-4 prose-headings:text-gray-100 prose-ul:list-disc prose-li:my-2 pl-[60px]"
                                dangerouslySetInnerHTML={{ __html: rule.content }}
                                />
                                
                                <div className="mt-6 pt-4 flex justify-end items-center text-xs font-medium text-gray-500 uppercase tracking-widest pl-[60px] border-t border-white/5">
                                    <span className="flex items-center gap-1">
                                        Actualizado por <span className="text-accent">{rule.author}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
                ) : (
                <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                    <div className="text-5xl mb-4 opacity-30 grayscale">📂</div>
                    <p className="text-gray-500 font-medium">No hay reglamentos que coincidan.</p>
                </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [factions, setFactions] = useState<Faction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  // Selection State
  const [activeFaction, setActiveFaction] = useState<Faction | null>(null);
  const [activeGeneric, setActiveGeneric] = useState<GenericCategory | null>(null);

  useEffect(() => {
    // Preload factions logic
    const fetchFactions = async () => {
      const data = await factionService.getFactions();
      setFactions(data);
    };
    fetchFactions();
  }, []);

  // Navigation Handlers
  const goHome = () => {
    setView('landing');
    setActiveFaction(null);
    setActiveGeneric(null);
    window.scrollTo(0,0);
  };

  const handleGenericSelect = async (slug: string) => {
    const data = await factionService.getGenericCategory(slug);
    if(data) {
        setActiveGeneric(data);
        setView('generic_detail');
        window.scrollTo(0,0);
    }
  };

  const goToFactionsList = () => {
    setView('factions_list');
    window.scrollTo(0,0);
  };

  const handleFactionSelect = (faction: Faction) => {
    setActiveFaction(faction);
    setView('faction_detail');
    window.scrollTo(0,0);
  };

  // Rule Handlers
  const handleAddRule = async (title: string, content: string, type: 'faction' | 'generic') => {
    if (!user) return;
    try {
        const slug = type === 'faction' ? activeFaction?.slug : activeGeneric?.slug;
        if(!slug) return;

        // API call returns the new rule object with proper ID
        const newRule = await factionService.addRule(slug, type, {
            title, content, author: user.username
        });

        // Update LOCAL state carefully to avoid duplication
        if (type === 'faction' && activeFaction) {
            setActiveFaction(prev => {
                if(!prev) return null;
                return { ...prev, rules: [...prev.rules, newRule] };
            });
        } else if (type === 'generic' && activeGeneric) {
            setActiveGeneric(prev => {
                if(!prev) return null;
                return { ...prev, rules: [...prev.rules, newRule] };
            });
        }
    } catch (e) {
        alert("Error al guardar la normativa.");
    }
  };

  const handleUpdateRule = async (id: string, title: string, content: string, type: 'faction' | 'generic') => {
    if (!user) return;
    try {
        const slug = type === 'faction' ? activeFaction?.slug : activeGeneric?.slug;
        if(!slug) return;

        await factionService.updateRule(slug, type, id, {
            title, content, author: user.username
        });

        // Update LOCAL state
        if (type === 'faction' && activeFaction) {
            setActiveFaction(prev => {
                if(!prev) return null;
                return { 
                    ...prev, 
                    rules: prev.rules.map(r => r.id === id ? { ...r, title, content } : r) 
                };
            });
        } else if (type === 'generic' && activeGeneric) {
            setActiveGeneric(prev => {
                if(!prev) return null;
                return { 
                    ...prev, 
                    rules: prev.rules.map(r => r.id === id ? { ...r, title, content } : r) 
                };
            });
        }
    } catch (e) {
        console.error(e);
        alert("Error al actualizar la normativa.");
    }
  };

  const handleDeleteRule = async (id: string, type: 'faction' | 'generic') => {
    if(!user) return;
    if(!confirm("¿Seguro que deseas eliminar esta normativa?")) return;
    
    const slug = type === 'faction' ? activeFaction?.slug : activeGeneric?.slug;
    if(!slug) return;

    await factionService.deleteRule(slug, type, id);

    if (type === 'faction' && activeFaction) {
        setActiveFaction(prev => {
            if(!prev) return null;
            return { ...prev, rules: prev.rules.filter(r => r.id !== id) };
        });
    } else if (type === 'generic' && activeGeneric) {
        setActiveGeneric(prev => {
             if(!prev) return null;
             return { ...prev, rules: prev.rules.filter(r => r.id !== id) };
        });
    }
  };

  const handleMoveRule = async (id: string, direction: 'up' | 'down', type: 'faction' | 'generic') => {
    if (!user) return;
    
    const slug = type === 'faction' ? activeFaction?.slug : activeGeneric?.slug;
    if(!slug) return;

    // Optimistic Update
    const swapRules = (rules: Rule[]) => {
        const idx = rules.findIndex(r => r.id === id);
        if (idx === -1) return rules;
        const newRules = [...rules];
        if (direction === 'up' && idx > 0) {
            [newRules[idx - 1], newRules[idx]] = [newRules[idx], newRules[idx - 1]];
        } else if (direction === 'down' && idx < rules.length - 1) {
            [newRules[idx], newRules[idx + 1]] = [newRules[idx + 1], newRules[idx]];
        }
        return newRules;
    };

    if (type === 'faction' && activeFaction) {
        setActiveFaction(prev => prev ? { ...prev, rules: swapRules(prev.rules) } : null);
    } else if (type === 'generic' && activeGeneric) {
        setActiveGeneric(prev => prev ? { ...prev, rules: swapRules(prev.rules) } : null);
    }

    // API Call
    await factionService.moveRule(slug, type, id, direction);
  };


  return (
    <Layout 
      user={user} 
      onLogin={setUser} 
      onLogout={() => setUser(null)}
      onNavigateHome={goHome}
    >
      <AiAssistant />

      {/* 1. LANDING PAGE */}
      {view === 'landing' && (
        <div className="animate-in fade-in duration-700">
           <div className="text-center mb-16 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
             {/* Adjusted padding left to fix L clipping */}
             <h1 className="text-6xl md:text-8xl font-display font-black italic text-white mb-4 drop-shadow-2xl tracking-widest leading-tight uppercase py-4 pr-4">
              COMPLEX <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-deep pl-4">LEGACY</span>
            </h1>
            <p className="text-lg text-gray-400 font-light tracking-wide uppercase">Portal de Conocimiento & Normativas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PerspectiveCard 
                title="Generales" 
                description="Normativas básicas de convivencia, conceptos de rol y comportamiento."
                image={INITIAL_GENERIC_CATEGORIES[0].icon}
                gradientFrom="from-slate-800"
                gradientTo="to-slate-900"
                onClick={() => handleGenericSelect('general')}
            />
            <PerspectiveCard 
                title="Ilegales" 
                description="Reglamento para bandas, mafias, robos, secuestros y actividades delictivas."
                image={INITIAL_GENERIC_CATEGORIES[1].icon}
                gradientFrom="from-purple-900"
                gradientTo="to-pink-900"
                onClick={() => handleGenericSelect('illegal')}
            />
             <PerspectiveCard 
                title="Facciones" 
                description="Reglamentos específicos de departamentos como LSPD y SAES."
                image="https://i.ibb.co/5hW4nh3B/Dise-o-sin-t-tulo-1.png"
                gradientFrom="from-blue-900"
                gradientTo="to-indigo-900"
                onClick={goToFactionsList}
            />
          </div>
        </div>
      )}

      {/* 2. GENERIC RULES DETAIL (General / Illegal) */}
      {view === 'generic_detail' && activeGeneric && (
        <div className="animate-in slide-in-from-bottom-12 duration-500 max-w-7xl mx-auto">
            {/* Banner Generic */}
             <div className="relative h-64 rounded-3xl overflow-hidden mb-10 shadow-2xl border border-white/10">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className={`absolute inset-0 bg-gradient-to-r ${activeGeneric.gradientFrom} ${activeGeneric.gradientTo} opacity-60 z-0 mix-blend-multiply`} />
                <img src={activeGeneric.bannerUrl} className="w-full h-full object-cover" alt="banner" />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                     <h2 className="text-5xl font-display font-black italic tracking-tighter text-white mb-2 uppercase leading-tight py-2 pr-4">{activeGeneric.name}</h2>
                     <p className="text-gray-200 max-w-xl text-lg">{activeGeneric.description}</p>
                </div>
                <button onClick={goHome} className="absolute top-6 right-6 z-30 bg-black/50 hover:bg-white/10 text-white px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 text-xs uppercase font-bold tracking-widest transition-all">
                    Volver al Inicio
                </button>
            </div>

            <RulesSection 
                title={`Reglamento ${activeGeneric.name}`}
                rules={activeGeneric.rules}
                user={user}
                onAddRule={(t, c) => handleAddRule(t, c, 'generic')}
                onUpdateRule={(id, t, c) => handleUpdateRule(id, t, c, 'generic')}
                onDeleteRule={(id) => handleDeleteRule(id, 'generic')}
                onMoveRule={(id, dir) => handleMoveRule(id, dir, 'generic')}
                isIconVisible={true}
                icon={LOGO_URL}
            />
        </div>
      )}

      {/* 3. FACTION LIST */}
      {view === 'factions_list' && (
        <div className="animate-in slide-in-from-right-8 duration-500">
             <div className="flex justify-between items-center mb-10 max-w-5xl mx-auto">
                 <div>
                    <h2 className="text-4xl font-display font-black italic text-white uppercase tracking-tighter leading-tight py-1">Facciones Oficiales</h2>
                    <p className="text-gray-400">Selecciona un departamento para consultar su normativa.</p>
                 </div>
                 <button onClick={goHome} className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm">
                    ← Volver
                 </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {factions.map(faction => (
                <PerspectiveCard 
                  key={faction.id} 
                  title={faction.name}
                  description={faction.description}
                  image={faction.icon}
                  gradientFrom={faction.gradientFrom}
                  gradientTo={faction.gradientTo}
                  onClick={() => handleFactionSelect(faction)} 
                  isIcon={true}
                  variant="round"
                />
              ))}
            </div>
        </div>
      )}

      {/* 4. FACTION DETAIL */}
      {view === 'faction_detail' && activeFaction && (
        <div className="animate-in slide-in-from-bottom-12 duration-700">
           {/* Banner with Back Button */}
           <div className="relative rounded-3xl overflow-hidden bg-[#0a0a0c] border border-white/10 mb-10 shadow-2xl group">
            <div className="h-64 md:h-80 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
                <img 
                    src={activeFaction.bannerUrl} 
                    alt="Banner" 
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <button onClick={goToFactionsList} className="absolute top-6 left-6 z-30 bg-black/50 hover:bg-white/10 text-white px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 text-xs uppercase font-bold tracking-widest transition-all">
                    ← Volver a lista
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 flex flex-col md:flex-row items-end gap-8">
              <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full border-4 border-[#0a0a0c] bg-[#1a1a1c] shadow-2xl overflow-hidden -mb-16 md:mb-0 relative z-30 group-hover:rotate-3 transition-transform duration-300">
                <img src={activeFaction.icon} className="w-full h-full object-cover" alt="Icon" />
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-4xl md:text-6xl font-display font-black italic text-white mb-2 drop-shadow-lg leading-none uppercase tracking-tighter py-1 pr-4">{activeFaction.name}</h1>
                <p className="text-gray-200 text-sm md:text-lg max-w-2xl font-medium drop-shadow-md">{activeFaction.description}</p>
              </div>

              <div className="flex gap-4 mb-2">
                 <a 
                  href={activeFaction.applyUrl} 
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-highlight text-black font-display font-bold text-sm md:text-lg hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,214,90,0.3)]"
                >
                  POSTULARSE
                </a>
                <a 
                  href={activeFaction.discordUrl}
                  target="_blank"
                  rel="noreferrer" 
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#5865F2] text-white flex items-center justify-center hover:bg-[#4752c4] hover:rotate-12 hover:scale-110 transition-all shadow-lg"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <RulesSection 
                title="Normativas Internas"
                rules={activeFaction.rules}
                user={user}
                onAddRule={(t, c) => handleAddRule(t, c, 'faction')}
                onUpdateRule={(id, t, c) => handleUpdateRule(id, t, c, 'faction')}
                onDeleteRule={(id) => handleDeleteRule(id, 'faction')}
                onMoveRule={(id, dir) => handleMoveRule(id, dir, 'faction')}
                icon={activeFaction.icon}
                colorClass="bg-highlight"
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;