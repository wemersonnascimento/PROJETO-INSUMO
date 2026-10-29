import React from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  ShoppingBag,
  HeartHandshake,
  Plus, 
  Scale, 
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { WasteItem, FilterState } from '../types';
import { formatCurrency, formatWeight, CATEGORY_LABELS, HAZARD_INFO } from '../utils/formatters';

interface DashboardFeedProps {
  items: WasteItem[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onOpenFiltersModal: () => void;
  onSelectItem: (item: WasteItem) => void;
  onOpenNewAd: () => void;
  onOpenESG: () => void;
  currentCompanyCity: string;
}

export const DashboardFeed: React.FC<DashboardFeedProps> = ({
  items,
  filters,
  onFilterChange,
  onOpenFiltersModal,
  onSelectItem,
  onOpenNewAd,
  onOpenESG,
}) => {
  // Contagem de filtros ativos para o badge
  const activeFiltersCount = [
    filters.searchTerm ? 1 : 0,
    filters.categoria !== 'todas' ? 1 : 0,
    filters.tipoNegociacao !== 'todos' ? 1 : 0,
    filters.grauPerigo !== 'todos' ? 1 : 0,
    filters.raioMaxKm < 1000 ? 1 : 0,
    filters.estado !== 'todos' ? 1 : 0,
    filters.faixaPreco.min !== undefined || filters.faixaPreco.max !== undefined ? 1 : 0,
    filters.faixaVolume.min !== undefined ? 1 : 0,
    filters.recorrencia !== 'todas' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Status dos 3 botões selecionados
  const isComprarActive = filters.tipoNegociacao === 'todos' || filters.modoIntencao === 'comprar';
  const isVendaActive = filters.tipoNegociacao === 'venda';
  const isDoacaoActive = filters.tipoNegociacao === 'doacao';

  return (
    <div className="space-y-5 text-left pb-16">
      {/* 1. HERO COM OS 3 BOTÕES (COMPRAR, VENDA, DOAÇÃO) E CAMPO DE PESQUISA NO CANTO SUPERIOR DIREITO */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#10241b] via-[#0d1c15] to-[#0a1410] border border-[#1e382a] p-4 sm:p-6 overflow-hidden shadow-2xl">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          
          {/* Lado Esquerdo: Mensagem e os 3 Botões */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-[11px] font-bold text-emerald-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Marketplace de Resíduos Industriais B2B</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Encontre oportunidades.<br />
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-lime-300 bg-clip-text text-transparent">
                Gere valor. Preserve o futuro.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              Conectamos geradores de resíduos industriais a recicladores e compradores de insumos secundários em todo o Brasil.
            </p>

            {/* OS 3 BOTÕES: 1 COMPRAR, VENDA E DOAÇÃO (Exigência do Usuário) */}
            <div className="mt-5">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                O que sua empresa deseja fazer?
              </label>

              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#0b1410] rounded-2xl border border-[#1e382a] max-w-lg shadow-inner">
                
                {/* 1. BOTÃO COMPRAR */}
                <button
                  type="button"
                  onClick={() => onFilterChange({ 
                    ...filters, 
                    modoIntencao: 'comprar', 
                    tipoNegociacao: 'todos' 
                  })}
                  className={`py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                    isComprarActive && !isVendaActive && !isDoacaoActive
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-zinc-950 shadow-lg shadow-emerald-950/80 scale-[1.02]'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>Comprar</span>
                </button>

                {/* 2. BOTÃO VENDA */}
                <button
                  type="button"
                  onClick={() => onFilterChange({ 
                    ...filters, 
                    modoIntencao: 'descartar', 
                    tipoNegociacao: 'venda' 
                  })}
                  className={`py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                    isVendaActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 shadow-lg shadow-orange-950/80 scale-[1.02]'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <Tag className="w-4 h-4 shrink-0" />
                  <span>Venda</span>
                </button>

                {/* 3. BOTÃO DOAÇÃO */}
                <button
                  type="button"
                  onClick={() => onFilterChange({ 
                    ...filters, 
                    modoIntencao: 'todos', 
                    tipoNegociacao: 'doacao' 
                  })}
                  className={`py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                    isDoacaoActive
                      ? 'bg-gradient-to-r from-lime-400 to-emerald-400 text-zinc-950 shadow-lg shadow-lime-950/80 scale-[1.02]'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 shrink-0" />
                  <span>Doação</span>
                </button>
              </div>

              {/* Tag explicativa do botão ativo */}
              <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-2">
                {isVendaActive && (
                  <span className="text-orange-400 flex items-center gap-1 font-semibold">
                    <Tag className="w-3 h-3" />
                    Filtrando apenas itens para <strong>Venda (com preço R$)</strong>.
                  </span>
                )}
                {isDoacaoActive && (
                  <span className="text-lime-400 flex items-center gap-1 font-semibold">
                    <HeartHandshake className="w-3 h-3" />
                    Filtrando apenas itens para <strong>Doação Sustentável (R$ 0,00)</strong>.
                  </span>
                )}
                {isComprarActive && !isVendaActive && !isDoacaoActive && (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShoppingBag className="w-3 h-3" />
                    Exibindo todas as oportunidades para <strong>Compra & Aquisição</strong>.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lado Direito: CAMPO DE PESQUISA NO CANTO SUPERIOR DIREITO (Exigência do Usuário) */}
          <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-2.5 self-start bg-[#0b1410]/80 p-3.5 sm:p-4 rounded-2xl border border-[#1e382a] shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Pesquisar Itens
              </span>
              {filters.searchTerm && (
                <button
                  onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
                  className="text-[11px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {/* Input de Pesquisa no Canto Superior Direito */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por material, resíduo, palavra-chave..."
                value={filters.searchTerm}
                onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
                className="w-full bg-[#121f19] border border-[#234030] focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
            </div>

            {/* Ações Rápidas no Canto Superior Direito: Botão Filtros + Anunciar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenFiltersModal}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  activeFiltersCount > 0
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-[#121f19] text-zinc-300 border-[#234030] hover:border-zinc-500 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenNewAd}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white flex items-center justify-center gap-1 shadow-md shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Anunciar</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. CHIPS DE FILTRO RÁPIDO HORIZONTAL */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {/* Chip Categoria */}
        <select
          value={filters.categoria}
          onChange={(e) => onFilterChange({ ...filters, categoria: e.target.value as any })}
          className="bg-[#111c17] border border-[#203628] text-zinc-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 shrink-0"
        >
          <option value="todas">Categoria: Todas</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        {/* Chip Raio */}
        <select
          value={filters.raioMaxKm}
          onChange={(e) => onFilterChange({ ...filters, raioMaxKm: parseInt(e.target.value) })}
          className="bg-[#111c17] border border-[#203628] text-zinc-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 shrink-0"
        >
          <option value={1000}>Raio: Brasil Todo</option>
          <option value={35}>Raio: até 35 km</option>
          <option value={50}>Raio: até 50 km</option>
          <option value={100}>Raio: até 100 km</option>
          <option value={250}>Raio: até 250 km</option>
          <option value={500}>Raio: até 500 km</option>
        </select>

        {/* Chip Modalidade Rápida */}
        <div className="flex bg-[#111c17] border border-[#203628] rounded-xl p-0.5 shrink-0">
          <button
            onClick={() => onFilterChange({ ...filters, tipoNegociacao: 'todos' })}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              filters.tipoNegociacao === 'todos'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, tipoNegociacao: 'venda' })}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              filters.tipoNegociacao === 'venda'
                ? 'bg-orange-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Venda
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, tipoNegociacao: 'doacao' })}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              filters.tipoNegociacao === 'doacao'
                ? 'bg-lime-400 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Doação
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, tipoNegociacao: 'troca' })}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              filters.tipoNegociacao === 'troca'
                ? 'bg-cyan-400 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Troca
          </button>
        </div>

        {/* Chip Grau de Perigo */}
        <select
          value={filters.grauPerigo}
          onChange={(e) => onFilterChange({ ...filters, grauPerigo: e.target.value as any })}
          className="bg-[#111c17] border border-[#203628] text-zinc-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 shrink-0"
        >
          <option value="todos">Grau de Perigo: Todos</option>
          <option value="classe-iib">Classe II B - Inerte</option>
          <option value="classe-iia">Classe II A - Não Inerte</option>
          <option value="classe-i">Classe I - Perigoso</option>
        </select>
      </div>

      {/* 3. CABEÇALHO DA SEÇÃO DE RESÍDUOS */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-black text-white">
            Resíduos em destaque
          </h2>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono">
            {items.length} {items.length === 1 ? 'disponível' : 'disponíveis'}
          </span>
        </div>

        <button
          onClick={onOpenFiltersModal}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>Ver todos os filtros</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. GRID DE CARDS DE RESÍDUOS */}
      {items.length === 0 ? (
        <div className="rounded-3xl bg-[#111c17] border border-[#203628] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-zinc-200">
            Nenhum resíduo encontrado com os filtros atuais
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Tente mudar entre Comprar, Venda ou Doação, ou remover o termo de busca para ver mais materiais.
          </p>
          <button
            onClick={() => onFilterChange({
              ...filters,
              searchTerm: '',
              categoria: 'todas',
              tipoNegociacao: 'todos',
              grauPerigo: 'todos',
              raioMaxKm: 1000,
            })}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const hazard = HAZARD_INFO[item.grauPerigo];
            const catInfo = CATEGORY_LABELS[item.categoria];

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group relative bg-[#111b16] hover:bg-[#14231c] border border-[#1e3427] hover:border-emerald-500/60 rounded-3xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/50 cursor-pointer"
              >
                {/* Imagem do Item com Badges Sobrepostos */}
                <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={item.fotos[0]}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111b16] via-transparent to-black/50" />

                  {/* Badge Tipo de Negociação (Topo Esquerdo) */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {item.tipoNegociacao === 'venda' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-orange-500 text-zinc-950 shadow-md">
                        VENDA
                      </span>
                    )}
                    {item.tipoNegociacao === 'doacao' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-lime-400 text-zinc-950 shadow-md">
                        DOAÇÃO
                      </span>
                    )}
                    {item.tipoNegociacao === 'troca' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-cyan-400 text-zinc-950 shadow-md">
                        TROCA
                      </span>
                    )}
                  </div>

                  {/* Badge Grau de Perigo (Topo Direito) */}
                  <div className="absolute top-3 right-3">
                    <span 
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border backdrop-blur-md flex items-center gap-1 ${hazard.bgBadge} ${hazard.color} ${hazard.borderBadge}`}
                      title={hazard.descricaoGeral}
                    >
                      {item.grauPerigo === 'classe-i' ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <ShieldCheck className="w-3 h-3" />
                      )}
                      <span>{hazard.label.split('-')[0].trim()}</span>
                    </span>
                  </div>

                  {/* Preço / Condição flutuante */}
                  <div className="absolute bottom-2.5 left-3">
                    <span className="text-sm font-black text-white bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-zinc-700/60 font-mono">
                      {item.tipoNegociacao === 'venda' 
                        ? `${formatCurrency(item.precoUnitario)} ${item.precoUnidade ? `/${item.volumeUnidade}` : ''}`
                        : item.tipoNegociacao === 'doacao' 
                          ? 'Gratuito (Doação)' 
                          : 'Permuta / Troca'}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Categoria */}
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                      <Layers className="w-3 h-3" />
                      <span>{catInfo?.label || item.categoria}</span>
                    </div>

                    {/* Título */}
                    <h3 className="font-bold text-sm text-zinc-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {item.titulo}
                    </h3>

                    {/* Localização e Distância */}
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">
                        {item.companyCity}, {item.companyState} • <strong>{item.distanceKm} km</strong> de você
                      </span>
                    </div>
                  </div>

                  {/* Volume e Recorrência */}
                  <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-[#0e1713] border border-[#1a2d22] text-[11px]">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Volume</span>
                      <strong className="text-zinc-200 font-mono">
                        {formatWeight(item.volumeDisponivel, item.volumeUnidade)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Recorrência</span>
                      <span className="text-emerald-400 font-medium">
                        {item.recorrencia}
                      </span>
                    </div>
                  </div>

                  {/* Explicação para que serve */}
                  <div className="text-[11px] text-zinc-400 bg-emerald-950/30 border border-emerald-900/30 p-2 rounded-xl">
                    <p className="text-[10px] text-emerald-300 font-semibold mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-lime-400" />
                      Para que serve:
                    </p>
                    <p className="line-clamp-2 text-zinc-300 text-[10.5px]">
                      {item.paraQueServe}
                    </p>
                  </div>

                  {/* Rodapé do Card: Empresa e Ação */}
                  <div className="pt-2 border-t border-[#1a2d22] flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                      {item.companyName}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Ver detalhes
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. BANNER ESG */}
      <div 
        onClick={onOpenESG}
        className="cursor-pointer rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#13271e] to-emerald-950/80 border border-emerald-700/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-emerald-500 transition-all shadow-xl"
      >
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">
              Monetize seus passivos ou atinja Metas ESG da sua fábrica
            </h4>
            <p className="text-xs text-emerald-200/80">
              Cada tonelada transacionada gera certificado rastreável de destinação e redução de CO2.
            </p>
          </div>
        </div>

        <button className="shrink-0 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center gap-1.5 shadow-md">
          <span>Ver Painel ESG</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
