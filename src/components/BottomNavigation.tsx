import React from 'react';
import { 
  Home, 
  Search, 
  Plus, 
  MessageSquare, 
  User, 
  Sparkles 
} from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'inicio' | 'buscar' | 'chat' | 'perfil';
  onChangeTab: (tab: 'inicio' | 'buscar' | 'chat' | 'perfil') => void;
  onOpenNewAd: () => void;
  unreadCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  onOpenNewAd,
  unreadCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d1613]/95 backdrop-blur-md border-t border-[#1b2b22] px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        
        {/* Início */}
        <button
          onClick={() => onChangeTab('inicio')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'inicio' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Início</span>
        </button>

        {/* Buscar */}
        <button
          onClick={() => onChangeTab('buscar')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'buscar' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Buscar</span>
        </button>

        {/* Botão Central Flutuante: ANUNCIAR (+) - Como na imagem */}
        <div className="relative -top-4">
          <button
            onClick={onOpenNewAd}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-green-500 to-lime-400 text-zinc-950 font-black flex items-center justify-center shadow-lg shadow-emerald-950/80 hover:scale-105 active:scale-95 transition-all border-4 border-[#0d1613]"
            title="Anunciar Resíduo"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Chat */}
        <button
          onClick={() => onChangeTab('chat')}
          className={`relative flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'chat' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Chat</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-black text-[9px] font-black rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Perfil / Painel ESG */}
        <button
          onClick={() => onChangeTab('perfil')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'perfil' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Meu Perfil</span>
        </button>

      </div>
    </nav>
  );
};
