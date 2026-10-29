import React from 'react';
import { 
  Recycle, 
  Bell, 
  Building2, 
  Smartphone, 
  Monitor, 
  ChevronDown, 
  Sparkles, 
  PlusCircle, 
  HelpCircle,
  Search,
  X
} from 'lucide-react';
import { Company } from '../types';

interface HeaderProps {
  currentCompany: Company;
  allCompanies: Company[];
  onSelectCompany: (company: Company) => void;
  onOpenNewAd: () => void;
  onOpenOnboarding: () => void;
  onOpenAuth: () => void;
  onOpenESG: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  unreadChatCount: number;
  onOpenChat: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  allCompanies,
  onSelectCompany,
  onOpenNewAd,
  onOpenOnboarding,
  onOpenAuth,
  onOpenESG,
  isMobileFrame,
  onToggleMobileFrame,
  unreadChatCount,
  onOpenChat,
  searchTerm = '',
  onSearchChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0d1613]/95 backdrop-blur-md border-b border-[#1b2b22] px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Marca */}
        <div 
          onClick={onOpenOnboarding}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 group-hover:scale-105 transition-transform">
            <Recycle className="w-5 h-5 text-white animate-spin-slow" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime-400 rounded-full border-2 border-[#0d1613]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-green-300 to-lime-400 bg-clip-text text-transparent">
                RE-INDUSTRIAL
              </span>
              <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-widest bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                B2B Circular
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block -mt-0.5">
              Marketplace de Insumos & Resíduos
            </p>
          </div>
        </div>

        {/* Centro: Quick Badges (desktop) */}
        <div className="hidden xl:flex items-center gap-3 text-xs text-zinc-400">
          <button 
            onClick={onOpenESG}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/40 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Impacto: <strong>128,6 ton</strong> desviadas</span>
          </button>
          
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
            <span>Como funciona?</span>
          </button>
        </div>

        {/* Ações da Direita com Campo de Pesquisa no Canto Superior Direito */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* CAMPO DE PESQUISA NO CANTO SUPERIOR DIREITO (Visível no Header) */}
          {onSearchChange && (
            <div className="relative hidden md:block w-48 lg:w-64">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#121f19] border border-[#223d2e] focus:border-emerald-400 rounded-xl pl-8 pr-7 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-2.5" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-2 text-zinc-400 hover:text-white"
                  title="Limpar pesquisa"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Alternador Mobile Frame / Desktop */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Expandir para visualização Desktop' : 'Simular visualização Mobile (como na imagem)'}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border ${
              isMobileFrame 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20' 
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline font-medium">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-zinc-300" />
                <span className="hidden sm:inline font-medium">Mobile</span>
              </>
            )}
          </button>

          {/* Botão Anunciar Rápido */}
          <button
            onClick={onOpenNewAd}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-md shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Anunciar</span>
          </button>

          {/* Notificações / Chat */}
          <button
            onClick={onOpenChat}
            className="relative p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            title="Chat de Negociações"
          >
            <Bell className="w-4 h-4" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Empresa Logada & Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-900/90 border border-[#1b2b22] hover:border-emerald-600/50 transition-all text-left"
            >
              <img
                src={currentCompany.avatarUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80'}
                alt={currentCompany.nomeFantasia}
                className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-zinc-100 truncate max-w-[110px]">
                  {currentCompany.nomeFantasia}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  {currentCompany.cidade}-{currentCompany.estado}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
            </button>

            {/* Menu Dropdown de Empresas */}
            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 bg-[#121c17] border border-[#23382c] rounded-2xl shadow-2xl p-2 z-40">
                  <div className="px-3 py-2 border-b border-[#23382c]/80 mb-2">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Empresa Ativa
                    </p>
                    <p className="text-sm font-bold text-emerald-300 truncate">
                      {currentCompany.razaoSocial}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono">
                      CNPJ: {currentCompany.cnpj}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentCompany.certificacoes.map((c, i) => (
                        <span key={i} className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase">
                    Alternar Empresa B2B:
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {allCompanies.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => {
                          onSelectCompany(comp);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          comp.id === currentCompany.id
                            ? 'bg-emerald-900/30 text-emerald-300 font-medium border border-emerald-600/30'
                            : 'text-zinc-300 hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="truncate">
                          <p className="font-semibold text-zinc-200 truncate">{comp.nomeFantasia}</p>
                          <p className="text-[10px] text-zinc-400">{comp.cidade}/{comp.estado} • {comp.ramo}</p>
                        </div>
                        {comp.id === currentCompany.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#23382c] mt-2 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>Cadastrar Nova Empresa</span>
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenESG();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-emerald-400 hover:bg-emerald-950/60 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Painel de Impacto ESG</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
