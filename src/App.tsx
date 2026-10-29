import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthB2BModal } from './components/AuthB2BModal';
import { DashboardFeed } from './components/DashboardFeed';
import { FilterDrawer } from './components/FilterDrawer';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CreateAdWizard } from './components/CreateAdWizard';
import { B2BChatModal } from './components/B2BChatModal';
import { ESGPanelModal } from './components/ESGPanelModal';
import { BottomNavigation } from './components/BottomNavigation';
import { 
  Company, 
  WasteItem, 
  ChatMessage, 
  FilterState, 
  ESGImpactMetrics, 
  NegotiationType,
  B2BConversation
} from './types';
import { 
  INITIAL_COMPANIES, 
  INITIAL_WASTE_ITEMS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_ESG_METRICS,
  INITIAL_CONVERSATIONS
} from './data/initialData';
import { CATEGORY_LABELS } from './utils/formatters';

export function App() {
  // 1. Estados Persistidos com LocalStorage
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('re_industrial_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [currentCompany, setCurrentCompany] = useState<Company>(() => {
    return companies[0] || INITIAL_COMPANIES[0];
  });

  const [wasteItems, setWasteItems] = useState<WasteItem[]>(() => {
    const saved = localStorage.getItem('re_industrial_items');
    return saved ? JSON.parse(saved) : INITIAL_WASTE_ITEMS;
  });

  const [conversations, setConversations] = useState<B2BConversation[]>(() => {
    const saved = localStorage.getItem('re_industrial_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');

  const [esgMetrics, setEsgMetrics] = useState<ESGImpactMetrics>(() => {
    const saved = localStorage.getItem('re_industrial_esg');
    return saved ? JSON.parse(saved) : INITIAL_ESG_METRICS;
  });

  // Salvar alterações no LocalStorage
  useEffect(() => {
    localStorage.setItem('re_industrial_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('re_industrial_items', JSON.stringify(wasteItems));
  }, [wasteItems]);

  useEffect(() => {
    localStorage.setItem('re_industrial_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('re_industrial_esg', JSON.stringify(esgMetrics));
  }, [esgMetrics]);

  // 2. Modais e Navegação
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);
  const [newAdWizardOpen, setNewAdWizardOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatWasteItem, setChatWasteItem] = useState<WasteItem | null>(null);
  const [esgPanelOpen, setEsgPanelOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'inicio' | 'buscar' | 'chat' | 'perfil'>('inicio');

  // 3. Estado de Filtros (Atende a todos os requisitos do usuário)
  const initialFilterState: FilterState = {
    searchTerm: '',
    modoIntencao: 'todos',
    tipoNegociacao: 'todos',
    categoria: 'todas',
    raioMaxKm: 1000,
    estado: 'todos',
    cidade: '',
    grauPerigo: 'todos',
    faixaPreco: {
      min: undefined,
      max: undefined,
    },
    faixaVolume: {
      min: undefined,
      max: undefined,
    },
    recorrencia: 'todas',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // 4. Lógica de Filtragem Reativa
  const filteredItems = useMemo(() => {
    return wasteItems.filter((item) => {
      // Busca por termo (título, descrição, tipo de material, empresa, cidade)
      if (filters.searchTerm) {
        const query = filters.searchTerm.toLowerCase();
        const catLabel = CATEGORY_LABELS[item.categoria]?.label.toLowerCase() || '';
        const matchTitle = item.titulo.toLowerCase().includes(query);
        const matchDesc = item.descricaoTecnica.toLowerCase().includes(query);
        const matchMat = item.tipoMaterial.toLowerCase().includes(query);
        const matchComp = item.companyName.toLowerCase().includes(query);
        const matchCity = item.companyCity.toLowerCase().includes(query);
        const matchUse = item.paraQueServe.toLowerCase().includes(query);
        const matchCat = catLabel.includes(query);

        if (!matchTitle && !matchDesc && !matchMat && !matchComp && !matchCity && !matchUse && !matchCat) {
          return false;
        }
      }

      // Filtro de Categoria
      if (filters.categoria !== 'todas' && item.categoria !== filters.categoria) {
        return false;
      }

      // Filtro de Modalidade (Venda, Doação, Troca)
      if (filters.tipoNegociacao !== 'todos' && item.tipoNegociacao !== filters.tipoNegociacao) {
        return false;
      }

      // Filtro de Grau de Perigo
      if (filters.grauPerigo !== 'todos' && item.grauPerigo !== filters.grauPerigo) {
        return false;
      }

      // Filtro de Raio / Distância
      if (item.distanceKm > filters.raioMaxKm) {
        return false;
      }

      // Filtro de Estado (UF)
      if (filters.estado !== 'todos' && item.companyState.toUpperCase() !== filters.estado.toUpperCase()) {
        return false;
      }

      // Filtro de Cidade
      if (filters.cidade && !item.companyCity.toLowerCase().includes(filters.cidade.toLowerCase())) {
        return false;
      }

      // Filtro de Preço (Mínimo e Máximo)
      if (item.tipoNegociacao === 'venda' && item.precoUnitario !== undefined) {
        if (filters.faixaPreco.min !== undefined && item.precoUnitario < filters.faixaPreco.min) {
          return false;
        }
        if (filters.faixaPreco.max !== undefined && item.precoUnitario > filters.faixaPreco.max) {
          return false;
        }
      }

      // Filtro de Volume Mínimo
      if (filters.faixaVolume.min !== undefined && item.volumeDisponivel < filters.faixaVolume.min) {
        return false;
      }

      // Filtro de Recorrência
      if (filters.recorrencia !== 'todas' && item.recorrencia !== filters.recorrencia) {
        return false;
      }

      return true;
    });
  }, [wasteItems, filters]);

  // 5. Handlers
  const handleCompanyCreated = (newCompany: Company) => {
    setCompanies((prev) => [newCompany, ...prev]);
    setCurrentCompany(newCompany);
  };

  const handlePublishAd = (newItem: WasteItem) => {
    setWasteItems((prev) => [newItem, ...prev]);
    
    // Atualiza métricas ESG da empresa
    const addedTons = newItem.volumeUnidade === 'ton' 
      ? newItem.volumeDisponivel 
      : newItem.volumeDisponivel / 1000;

    setEsgMetrics((prev) => ({
      ...prev,
      residuosDesviadosTon: +(prev.residuosDesviadosTon + addedTons).toFixed(1),
      co2EvitadoTon: +(prev.co2EvitadoTon + (addedTons * 1.8)).toFixed(1),
      arvoresPreservadas: Math.round(prev.arvoresPreservadas + (addedTons * 9.5)),
      economiaGeradaReais: prev.economiaGeradaReais + (newItem.precoUnitario ? newItem.precoUnitario * newItem.volumeDisponivel : 1500),
    }));
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    if (id) {
      setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
    }
  };

  const handleOpenChatForItem = (item: WasteItem) => {
    // Procura se já existe conversa sobre este item
    const existing = conversations.find(c => c.wasteItem.id === item.id);
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const partner = companies.find(c => c.id === item.companyId) || companies[1];
      const newConv: B2BConversation = {
        id: `conv-${Date.now()}`,
        partnerCompany: partner,
        wasteItem: item,
        unreadCount: 0,
        isFavorite: false,
        proposalStatus: 'pendente',
        lastMessageTime: 'Agora',
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: currentCompany.id,
            senderName: currentCompany.nomeFantasia,
            recipientId: partner.id,
            wasteItemId: item.id,
            wasteItemTitle: item.titulo,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            text: `Olá! Temos interesse no lote de ${item.titulo}. O material ainda está disponível para agendamento de retirada?`,
          }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    }
    setChatOpen(true);
  };

  const handleSendConversationMessage = (conversationId: string, text: string) => {
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentCompany.id,
      senderName: currentCompany.nomeFantasia,
      recipientId: 'partner',
      wasteItemId: 'item',
      wasteItemTitle: 'Resíduo em negociação',
      timestamp: timeNow,
      text,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessageTime: timeNow,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  const handleAcceptProposal = (conversationId: string) => {
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const acceptMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentCompany.id,
          senderName: currentCompany.nomeFantasia,
          recipientId: conv.partnerCompany.id,
          wasteItemId: conv.wasteItem.id,
          wasteItemTitle: conv.wasteItem.titulo,
          timestamp: timeNow,
          text: `✅ Proposta aceita! Confirmamos as condições comerciais para ${conv.wasteItem.titulo}. Vamos emitir a Nota Fiscal e o MTR de transporte.`,
        };
        return {
          ...conv,
          proposalStatus: 'aceita',
          lastMessageTime: timeNow,
          messages: [...conv.messages, acceptMsg]
        };
      }
      return conv;
    }));
  };

  const handleRejectProposal = (conversationId: string) => {
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const rejectMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentCompany.id,
          senderName: currentCompany.nomeFantasia,
          recipientId: conv.partnerCompany.id,
          wasteItemId: conv.wasteItem.id,
          wasteItemTitle: conv.wasteItem.titulo,
          timestamp: timeNow,
          text: `❌ Proposta não aceita no momento. Podemos negociar uma nova condição de valor ou quantidade para ${conv.wasteItem.titulo}?`,
        };
        return {
          ...conv,
          proposalStatus: 'recusada',
          lastMessageTime: timeNow,
          messages: [...conv.messages, rejectMsg]
        };
      }
      return conv;
    }));
  };

  const handleToggleFavorite = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, isFavorite: !conv.isFavorite };
      }
      return conv;
    }));
  };

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const handleBottomTabChange = (tab: 'inicio' | 'buscar' | 'chat' | 'perfil') => {
    setActiveBottomTab(tab);
    if (tab === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'buscar') {
      setFiltersOpen(true);
    } else if (tab === 'chat') {
      setChatOpen(true);
    } else if (tab === 'perfil') {
      setEsgPanelOpen(true);
    }
  };

  return (
    <div className={`min-h-screen bg-[#080e0c] text-zinc-100 flex flex-col transition-all duration-300 ${isMobileFrame ? 'items-center justify-center py-4 bg-zinc-950/90' : ''}`}>
      
      {/* Container Principal: ou Largura Total com visual desktop limpo, ou Moldura Mobile exata como na imagem */}
      <div 
        className={`w-full transition-all duration-300 flex flex-col ${
          isMobileFrame 
            ? 'max-w-md bg-[#0c1411] border-[5px] border-[#203629] rounded-[42px] shadow-2xl overflow-hidden min-h-[844px] relative ring-1 ring-emerald-500/30' 
            : 'max-w-7xl mx-auto flex-1'
        }`}
      >
        {/* Notch / Barra Superior se em Modo Mobile Frame */}
        {isMobileFrame && (
          <div className="bg-[#0b120f] py-1.5 px-6 flex items-center justify-between text-[11px] font-mono text-zinc-400 select-none border-b border-[#1b2b22]">
            <span>09:41</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-zinc-400 rounded-sm p-0.5">
                <div className="w-full h-full bg-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Header Principal */}
        <Header
          currentCompany={currentCompany}
          allCompanies={companies}
          onSelectCompany={setCurrentCompany}
          onOpenNewAd={() => setNewAdWizardOpen(true)}
          onOpenOnboarding={() => setOnboardingOpen(true)}
          onOpenAuth={() => {
            setAuthInitialMode('login');
            setAuthOpen(true);
          }}
          onOpenESG={() => setEsgPanelOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          unreadChatCount={totalUnreadCount}
          onOpenChat={() => {
            setActiveConversationId(conversations[0]?.id || null);
            setChatOpen(true);
          }}
          searchTerm={filters.searchTerm}
          onSearchChange={(val) => setFilters((prev) => ({ ...prev, searchTerm: val }))}
        />

        {/* Conteúdo Principal do Feed */}
        <main className="flex-1 p-3 sm:p-6">
          <DashboardFeed
            items={filteredItems}
            filters={filters}
            onFilterChange={setFilters}
            onOpenFiltersModal={() => setFiltersOpen(true)}
            onSelectItem={setSelectedItem}
            onOpenNewAd={() => setNewAdWizardOpen(true)}
            onOpenESG={() => setEsgPanelOpen(true)}
            currentCompanyCity={currentCompany.cidade}
          />
        </main>

        {/* Barra de Navegação Inferior (Mobile e Desktop) */}
        <BottomNavigation
          activeTab={activeBottomTab}
          onChangeTab={handleBottomTabChange}
          onOpenNewAd={() => setNewAdWizardOpen(true)}
          unreadCount={totalUnreadCount}
        />
      </div>

      {/* ============================================================ */}
      {/* MODAIS E TELAS DO APP (Mapeadas 1:1 do Mockup da Imagem) */}
      {/* ============================================================ */}

      {/* Tela 1: Onboarding / Apresentação */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onStartRegistration={() => {
          setAuthInitialMode('register');
          setAuthOpen(true);
        }}
        onStartLogin={() => {
          setAuthInitialMode('login');
          setAuthOpen(true);
        }}
        onExploreDirectly={() => setOnboardingOpen(false)}
      />

      {/* Tela 2: Login / Verificação B2B / Cadastro de Empresas */}
      <AuthB2BModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onCompanyCreated={handleCompanyCreated}
        initialMode={authInitialMode}
        availableCompanies={companies}
        onSelectCompany={setCurrentCompany}
      />

      {/* Drawer de Filtros Avançados */}
      <FilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters(initialFilterState)}
        totalResults={filteredItems.length}
      />

      {/* Tela 4: Detalhes do Anúncio */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenChat={handleOpenChatForItem}
        company={companies.find(c => c.id === selectedItem?.companyId) || currentCompany}
      />

      {/* Telas 5 a 8: Criar Anúncio - Passo a Passo (Wizard) */}
      <CreateAdWizard
        isOpen={newAdWizardOpen}
        onClose={() => setNewAdWizardOpen(false)}
        currentCompany={currentCompany}
        onPublishAd={handlePublishAd}
      />

      {/* Tela 9: Chat Estilo WhatsApp B2B com Todas as conversas, Não lidas, Favoritos */}
      <B2BChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        currentCompany={currentCompany}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onSendMessage={handleSendConversationMessage}
        onAcceptProposal={handleAcceptProposal}
        onRejectProposal={handleRejectProposal}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Tela 10: Painel ESG */}
      <ESGPanelModal
        isOpen={esgPanelOpen}
        onClose={() => setEsgPanelOpen(false)}
        metrics={esgMetrics}
        company={currentCompany}
      />
    </div>
  );
}

export default App;
