import React from 'react';
import { 
  X, 
  RotateCcw, 
  Check, 
  SlidersHorizontal, 
  DollarSign, 
  MapPin, 
  Scale, 
  AlertTriangle, 
  Layers,
  Sparkles
} from 'lucide-react';
import { FilterState, ItemCategory, HazardClass, NegotiationType } from '../types';
import { CATEGORY_LABELS, HAZARD_INFO } from '../utils/formatters';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1713] border-l border-[#1f3326] h-full flex flex-col justify-between text-zinc-100 shadow-2xl overflow-hidden animate-slideLeft"
      >
        {/* Cabeçalho */}
        <div className="px-5 py-4 border-b border-[#1f3326] flex items-center justify-between bg-[#121c17]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h2 className="font-black text-lg text-white">Filtros Avançados</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-800/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo com Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left text-xs">
          
          {/* 1. Tipo de Negociação (Venda, Doação, Troca) */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Modalidade da Negociação:</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'venda', label: 'Venda' },
                { id: 'doacao', label: 'Doação (R$ 0)' },
                { id: 'troca', label: 'Troca' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, tipoNegociacao: opt.id as any })}
                  className={`py-2 px-1 rounded-xl text-center font-bold text-[11px] border transition-all ${
                    filters.tipoNegociacao === opt.id
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-[#14221b] text-zinc-400 border-[#22382c] hover:border-zinc-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Filtro de Preço (se modalidade for venda ou todos) */}
          {filters.tipoNegociacao !== 'doacao' && (
            <div className="p-3.5 rounded-2xl bg-[#121c17] border border-[#203628]">
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Faixa de Preço (R$/unidade):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-400">Mínimo (R$)</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="0.00"
                    value={filters.faixaPreco.min ?? ''}
                    onChange={(e) => onFilterChange({
                      ...filters,
                      faixaPreco: { ...filters.faixaPreco, min: e.target.value ? parseFloat(e.target.value) : undefined }
                    })}
                    className="w-full bg-[#0d1612] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400">Máximo (R$)</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Sem limite"
                    value={filters.faixaPreco.max ?? ''}
                    onChange={(e) => onFilterChange({
                      ...filters,
                      faixaPreco: { ...filters.faixaPreco, max: e.target.value ? parseFloat(e.target.value) : undefined }
                    })}
                    className="w-full bg-[#0d1612] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Distância & Raio Máximo (km) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Raio Máximo de Distância:</span>
              </label>
              <span className="font-mono font-bold text-emerald-400 text-xs">
                {filters.raioMaxKm >= 1000 ? 'Brasil Todo' : `Até ${filters.raioMaxKm} km`}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={filters.raioMaxKm}
              onChange={(e) => onFilterChange({ ...filters, raioMaxKm: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-[#1b2f23] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>10 km (Local)</span>
              <span>100 km</span>
              <span>250 km</span>
              <span>1.000 km (Nacional)</span>
            </div>
          </div>

          {/* 4. Localização (Estado / UF) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Estado (UF):
              </label>
              <select
                value={filters.estado}
                onChange={(e) => onFilterChange({ ...filters, estado: e.target.value })}
                className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="todos">Todos os Estados</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="GO">Goiás (GO)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Cidade (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: São Paulo"
                value={filters.cidade}
                onChange={(e) => onFilterChange({ ...filters, cidade: e.target.value })}
                className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* 5. Categoria do Insumo / Resíduo */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-lime-400" />
              <span>Categoria do Material:</span>
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, categoria: 'todas' })}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                  filters.categoria === 'todas'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 font-bold'
                    : 'bg-[#14221b] text-zinc-400 border-transparent hover:border-[#22382c]'
                }`}
              >
                <span>Todas as Categorias</span>
                {filters.categoria === 'todas' && <Check className="w-3.5 h-3.5" />}
              </button>

              {Object.entries(CATEGORY_LABELS).map(([catKey, val]) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, categoria: catKey as ItemCategory })}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                    filters.categoria === catKey
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 font-bold'
                      : 'bg-[#14221b] text-zinc-400 border-transparent hover:border-[#22382c]'
                  }`}
                >
                  <span>{val.label}</span>
                  {filters.categoria === catKey && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Grau de Perigo (NBR 10004) */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Grau de Perigo (ABNT NBR 10004):</span>
            </label>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, grauPerigo: 'todos' })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-all ${
                  filters.grauPerigo === 'todos'
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 font-bold'
                    : 'bg-[#14221b] text-zinc-400 border-[#22382c]'
                }`}
              >
                Qualquer Grau de Perigo
              </button>

              {Object.entries(HAZARD_INFO).map(([hazardKey, h]) => (
                <button
                  key={hazardKey}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, grauPerigo: hazardKey as HazardClass })}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-all flex items-center justify-between ${
                    filters.grauPerigo === hazardKey
                      ? `${h.bgBadge} ${h.color} border-current font-bold`
                      : 'bg-[#14221b] text-zinc-400 border-[#22382c]'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{h.label}</p>
                    <p className="text-[10px] opacity-80">{h.sub}</p>
                  </div>
                  {filters.grauPerigo === hazardKey && <Check className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Tamanho / Quantidade / Volume */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quantidade / Volume Mínimo:</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Qualquer', min: undefined },
                { label: '≥ 500 kg', min: 500 },
                { label: '≥ 2.000 kg', min: 2000 },
                { label: '≥ 5.000 kg', min: 5000 },
                { label: '≥ 10.000 kg', min: 10000 },
                { label: '≥ 20.000 kg', min: 20000 },
              ].map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onFilterChange({
                    ...filters,
                    faixaVolume: { ...filters.faixaVolume, min: v.min }
                  })}
                  className={`py-2 px-1 rounded-xl text-center text-[10px] font-semibold border transition-all ${
                    filters.faixaVolume.min === v.min
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-[#14221b] text-zinc-400 border-[#22382c]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* 8. Recorrência do Resíduo */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Frequência de Geração:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'Mensal', label: 'Mensal / Recorrente' },
                { id: 'Pontual', label: 'Lote Único / Pontual' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, recorrencia: r.id as any })}
                  className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold border transition-all ${
                    filters.recorrencia === r.id
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-[#14221b] text-zinc-400 border-[#22382c]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Rodapé Fixo */}
        <div className="p-4 border-t border-[#1f3326] bg-[#121c17] flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-400">
            <strong>{totalResults}</strong> {totalResults === 1 ? 'item encontrado' : 'itens encontrados'}
          </span>
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
