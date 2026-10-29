import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck, 
  X,
  Search,
  Star,
  Building2,
  CheckCircle2,
  XCircle,
  Tag,
  DollarSign,
  Package,
  FileText
} from 'lucide-react';
import { B2BConversation, Company, WasteItem, ChatMessage } from '../types';
import { formatCurrency } from '../utils/formatters';

interface B2BChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: Company;
  conversations: B2BConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onAcceptProposal: (conversationId: string) => void;
  onRejectProposal: (conversationId: string) => void;
  onToggleFavorite: (conversationId: string) => void;
}

export const B2BChatModal: React.FC<B2BChatModalProps> = ({
  isOpen,
  onClose,
  currentCompany,
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onAcceptProposal,
  onRejectProposal,
  onToggleFavorite,
}) => {
  const [inputText, setInputText] = useState('');
  const [filterTab, setFilterTab] = useState<'todas' | 'nao_lidas' | 'favoritos'>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Conversa ativa selecionada
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Contagem de conversas não lidas
  const unreadTotal = conversations.filter(c => c.unreadCount > 0).length;

  // Filtragem da lista de conversas estilo WhatsApp
  const filteredConversations = conversations.filter(conv => {
    // Filtro por Abas
    if (filterTab === 'nao_lidas' && conv.unreadCount === 0) return false;
    if (filterTab === 'favoritos' && !conv.isFavorite) return false;

    // Filtro de Busca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComp = conv.partnerCompany.nomeFantasia.toLowerCase().includes(q);
      const matchItem = conv.wasteItem.titulo.toLowerCase().includes(q);
      const matchMsg = conv.messages.some(m => m.text.toLowerCase().includes(q));
      if (!matchComp && !matchItem && !matchMsg) return false;
    }

    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;
    onSendMessage(activeConversation.id, inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0c1612] border border-[#1f3326] sm:rounded-3xl h-full sm:h-[680px] flex flex-col md:flex-row text-zinc-100 shadow-2xl overflow-hidden">
        
        {/* ========================================================================= */}
        {/* PAINEL ESQUERDO: LISTA DE CONVERSAS ESTILO WHATSAPP                       */}
        {/* ========================================================================= */}
        <div 
          className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-[#1b2f23] bg-[#0e1713] ${
            activeConversationId && 'hidden md:flex'
          }`}
        >
          {/* Topo do WhatsApp B2B */}
          <div className="p-3.5 border-b border-[#1b2f23] space-y-3 bg-[#111c17]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-wide">
                  Conversas
                </span>
                <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  B2B
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Pesquisa de Conversas */}
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar conversa ou empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#16241d] border border-[#233a2d] focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            </div>

            {/* ABAS SOLICITADAS: TODAS AS CONVERSAS, NÃO LIDO, CAMPO FAVORITO (Exato do WhatsApp) */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
              
              {/* 1. TODAS */}
              <button
                onClick={() => setFilterTab('todas')}
                className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all shrink-0 ${
                  filterTab === 'todas'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#15231c] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Todas ({conversations.length})
              </button>

              {/* 2. NÃO LIDAS */}
              <button
                onClick={() => setFilterTab('nao_lidas')}
                className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  filterTab === 'nao_lidas'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#15231c] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Não lidas</span>
                {unreadTotal > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    filterTab === 'nao_lidas' ? 'bg-white text-emerald-950' : 'bg-emerald-500 text-black'
                  }`}>
                    {unreadTotal}
                  </span>
                )}
              </button>

              {/* 3. FAVORITOS */}
              <button
                onClick={() => setFilterTab('favoritos')}
                className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  filterTab === 'favoritos'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#15231c] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${filterTab === 'favoritos' ? 'fill-white' : ''}`} />
                <span>Favoritos</span>
              </button>

            </div>
          </div>

          {/* LISTA DE CONVERSAS */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#16271e]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                Nenhuma conversa encontrada neste filtro.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                const lastMsg = conv.messages[conv.messages.length - 1];

                return (
                  <div
                    key={conv.id}
                    onClick={() => onSelectConversation(conv.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors relative ${
                      isSelected
                        ? 'bg-[#16291e] border-l-4 border-emerald-400'
                        : 'hover:bg-[#121f18]'
                    }`}
                  >
                    {/* Avatar da Empresa com Bolinha Online */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.partnerCompany.avatarUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover border border-[#233a2d]"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0e1713]" />
                    </div>

                    {/* Detalhes da Linha */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-sm text-zinc-100 truncate">
                          {conv.partnerCompany.nomeFantasia}
                        </h4>
                        <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      {/* Tag do Resíduo */}
                      <p className="text-[11px] text-emerald-400 font-semibold truncate flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{conv.wasteItem.titulo}</span>
                      </p>

                      {/* Última Mensagem com Checkmarks */}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-zinc-400 truncate flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{lastMsg ? lastMsg.text : 'Proposta enviada'}</span>
                        </p>

                        <div className="flex items-center gap-1.5 shrink-0 ml-1">
                          {/* Estrela de Favorito */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(conv.id);
                            }}
                            className="text-zinc-500 hover:text-amber-400 transition-colors p-0.5"
                            title="Favoritar conversa"
                          >
                            <Star className={`w-3.5 h-3.5 ${conv.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>

                          {/* Badge de Mensagens Não Lidas estilo WhatsApp */}
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-black font-black text-[11px] flex items-center justify-center shadow-md">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAINEL DIREITO: CONVERSA ATIVA (ESTILO WHATSAPP B2B)                      */}
        {/* ========================================================================= */}
        {activeConversation ? (
          <div 
            className={`flex-1 flex flex-col justify-between bg-[#0a120f] ${
              !activeConversationId && 'hidden md:flex'
            }`}
          >
            {/* Cabeçalho da Conversa Ativa */}
            <div className="px-4 py-3 bg-[#111c17] border-b border-[#1b2f23] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectConversation('')}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white md:hidden"
                  title="Voltar para a lista"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img
                    src={activeConversation.partnerCompany.avatarUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-10 h-10 rounded-2xl object-cover border border-emerald-500/40"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#111c17]" />
                </div>

                <div className="text-left">
                  <h3 className="font-black text-sm text-white">
                    {activeConversation.partnerCompany.nomeFantasia}
                  </h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Negociação B2B
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(activeConversation.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    activeConversation.isFavorite 
                      ? 'text-amber-400 bg-amber-400/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                  title="Favoritar conversa"
                >
                  <Star className={`w-4 h-4 ${activeConversation.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ÁREA DE MENSAGENS COM A PRIMEIRA MENSAGEM DO ITEM */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
              
              {/* ========================================================================= */}
              {/* PRIMEIRA MENSAGEM: INFORMAÇÃO POSTADA DO ITEM COM OS DOIS BOTÕES           */}
              {/* (NOME DO ITEM, VALOR, DESCRIÇÃO + "Aceitar proposta" e "Não Aceitar Proposta") */}
              {/* ========================================================================= */}
              <div className="max-w-xl mx-auto rounded-3xl bg-[#12221a] border-2 border-emerald-600/50 p-4 sm:p-5 shadow-xl space-y-3.5 animate-fadeIn">
                
                {/* Cabeçalho da Proposta */}
                <div className="flex items-center justify-between pb-2 border-b border-[#1d3527]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    Item Postado para Negociação
                  </span>

                  {/* Status Atual */}
                  {activeConversation.proposalStatus === 'aceita' && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Proposta Aceita
                    </span>
                  )}
                  {activeConversation.proposalStatus === 'recusada' && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/50 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Proposta Recusada
                    </span>
                  )}
                  {activeConversation.proposalStatus === 'pendente' && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50">
                      Pendente de Resposta
                    </span>
                  )}
                </div>

                {/* Conteúdo: Foto, Nome do Item, Valor e Descrição */}
                <div className="flex gap-3.5 items-start">
                  <img
                    src={activeConversation.wasteItem.fotos[0]}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#203a2a] shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Nome do Item */}
                    <h4 className="font-black text-sm sm:text-base text-white leading-tight">
                      {activeConversation.wasteItem.titulo}
                    </h4>

                    {/* Valor do Item */}
                    <p className="text-xs sm:text-sm font-black text-emerald-300 font-mono mt-1">
                      Valor: {activeConversation.wasteItem.tipoNegociacao === 'venda' 
                        ? `${formatCurrency(activeConversation.wasteItem.precoUnitario)} / ${activeConversation.wasteItem.volumeUnidade}`
                        : activeConversation.wasteItem.tipoNegociacao === 'doacao'
                          ? 'Gratuito (Doação Sustentável)'
                          : 'Troca / Permuta'}
                    </p>

                    {/* Descrição do Item */}
                    <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                      {activeConversation.wasteItem.descricaoTecnica || activeConversation.wasteItem.estadoConservacao}
                    </p>
                  </div>
                </div>

                {/* OS DOIS BOTÕES SOLICITADOS: "Aceitar proposta" E "Não Aceitar Proposta" */}
                {activeConversation.proposalStatus === 'pendente' ? (
                  <div className="pt-2 border-t border-[#1d3527] grid grid-cols-2 gap-2.5">
                    
                    {/* Botão 1: Aceitar proposta */}
                    <button
                      type="button"
                      onClick={() => onAcceptProposal(activeConversation.id)}
                      className="py-2.5 px-3 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aceitar proposta</span>
                    </button>

                    {/* Botão 2: Não Aceitar Proposta */}
                    <button
                      type="button"
                      onClick={() => onRejectProposal(activeConversation.id)}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 border border-rose-700/60 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Não Aceitar Proposta</span>
                    </button>

                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#1d3527] text-center">
                    {activeConversation.proposalStatus === 'aceita' ? (
                      <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Proposta aceita! O termo de coleta e MTR estão sendo emitidos.
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Proposta não aceita. Você pode negociar novas condições abaixo.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* MENSAGENS SUBSEQUENTES EM FORMATO WHATSAPP (SIMPLES E CLARAS) */}
              {activeConversation.messages.map((msg) => {
                const isMe = msg.senderId === currentCompany.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                        isMe
                          ? 'bg-[#155e3b] text-zinc-100 rounded-tr-none'
                          : 'bg-[#16241d] text-zinc-200 border border-[#21382b] rounded-tl-none'
                      }`}
                    >
                      <p className="text-[10px] opacity-75 font-semibold mb-0.5">
                        {isMe ? 'Você' : msg.senderName}
                      </p>

                      <p className="text-xs sm:text-[13px]">{msg.text}</p>

                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-60 font-mono">
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INPUT SIMPLES DE MENSAGEM NO RODAPÉ ESTILO WHATSAPP */}
            <form 
              onSubmit={handleSend} 
              className="p-3 bg-[#111c17] border-t border-[#1d3125] flex items-center gap-2 shrink-0"
            >
              <button
                type="button"
                onClick={() => {
                  alert('Selecione um arquivo PDF de laudo técnico ou proposta para anexar.');
                }}
                className="p-2.5 rounded-xl bg-[#16241d] text-zinc-400 hover:text-white transition-colors"
                title="Anexar documento"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Digite uma mensagem..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-[#16241d] border border-[#233a2d] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
              />

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-md transition-all active:scale-95"
                title="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-zinc-500 text-xs">
            Selecione uma conversa ao lado para visualizar a negociação.
          </div>
        )}

      </div>
    </div>
  );
};
