import React, { useState } from 'react';
import { User } from '../types';
import { LOGO_URL, LINKS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogin: (u: User) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogin, onLogout, onNavigateHome }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Complex' && password === 'Complex2025') {
      onLogin({ username: 'Complex', role: 'admin' });
      setAuthModalOpen(false);
      setError('');
      setUsername('');
      setPassword('');
    } else {
      setError('Credenciales inválidas.');
    }
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-accent selection:text-white overflow-x-hidden">
      
      {/* --- IMMERSIVE BACKGROUND --- */}
      <div className="fixed inset-0 z-[-1]">
        {/* Dark Cityscape / Abstract Night Background - Lighter Opacity */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 scale-105"
            style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1605218427306-635ba2439af2?q=80&w=2070&auto=format&fit=crop")',
                filter: 'blur(4px) brightness(1.2)'
            }} 
        />
        {/* Color Overlays - Reduced Darkness */}
        <div className="absolute inset-0 bg-[#050505]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-accent-deep/10" />
        
        {/* Animated Fog/Glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-deep/30 rounded-full blur-[120px] animate-float opacity-70" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8C78FF]/20 rounded-full blur-[100px] animate-float opacity-50" style={{ animationDelay: '3s' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={onNavigateHome}
          >
            <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img src={LOGO_URL} alt="Complex Legacy Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(140,120,255,0.5)]" />
            </div>
            <div className="flex flex-col justify-center h-full">
              <span className="font-display font-black italic text-2xl tracking-wide text-white group-hover:text-accent transition-colors leading-none pt-1">COMPLEX LEGACY</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 animate-in fade-in">
                <span className="hidden sm:inline-block text-sm text-gray-300">
                    Conectado como <span className="text-highlight font-bold">{user.username}</span>
                </span>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-white/10 text-sm font-medium transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-accent group-hover:animate-pulse"></span>
                Acceso Staff
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 bg-black/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>© 2025 Complex Legacy Roleplay. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6 font-medium">
              <a href={LINKS.web} target="_blank" className="hover:text-accent transition-colors">Web Principal</a>
              <a href={LINKS.discord} target="_blank" className="hover:text-accent transition-colors">Discord</a>
              <a href={LINKS.support} target="_blank" className="hover:text-accent transition-colors">Soporte</a>
              <a href={LINKS.update} target="_blank" className="hover:text-accent transition-colors">Updates</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0F0F11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8 relative">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
                    <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Acceso Restringido</h2>
                <p className="text-gray-400 text-sm mt-2">Área exclusiva para la administración de facciones.</p>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Identificación</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                  placeholder="Usuario"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Clave de Acceso</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {error}
                  </div>
              )}

              <button 
                type="submit"
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-accent-deep to-accent text-white font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:translate-y-[-2px] transition-all"
              >
                INGRESAR AL SISTEMA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;