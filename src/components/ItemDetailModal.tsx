import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  MoreVertical, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Calendar, 
  Scale, 
  Layers, 
  FileCheck2, 
  Truck, 
  X,
  ExternalLink,
  ChevronRight,
  Heart
} from 'lucide-react';
import { WasteItem, Company } from '../types';
import { formatCurrency, formatWeight, CATEGORY_LABELS, HAZARD_INFO } from '../utils/formatters';

interface ItemDetailModalProps {
  item: WasteItem | null;
  onClose: () => void;
  onOpenChat: (item: WasteItem) => void;
  company?: Company;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onOpenChat,
  company,
}) => {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'empresa'>('detalhes');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  if (!item) return null;

  const hazard = HAZARD_INFO[item.grauPerigo];
  const catInfo = CATEGORY_LABELS[item.categoria];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.titulo,
        text: `Confira este resíduo no RE-INDUSTRIAL: ${item.titulo}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do resíduo copiado para a área de transferência!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c1612] border border-[#1f3326] sm:rounded-3xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col justify-between text-zinc-100 shadow-2xl overflow-hidden">
        
        {/* CABEÇALHO SUPERIOR (Fiel à imagem) */}
        <div className="px-4 py-3 bg-[#101b16] border-b border-[#1d3125] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider truncate">
              Detalhes do Anúncio
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-xl transition-colors ${
                isFavorite 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white'
              }`}
              title="Salvar nos favoritos"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CORPO COM SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-left text-xs">
          
          {/* TAG DE NEGOCIAÇÃO & TÍTULO */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {item.tipoNegociacao === 'venda' && (
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-orange-500 text-zinc-950 shadow-md">
                  VENDA
                </span>
              )}
              {item.tipoNegociacao === 'doacao' && (
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-lime-400 text-zinc-950 shadow-md">
                  DOAÇÃO
                </span>
              )}
              {item.tipoNegociacao === 'troca' && (
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-cyan-400 text-zinc-950 shadow-md">
                  TROCA / PERMUTA
                </span>
              )}

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${hazard.bgBadge} ${hazard.color} ${hazard.borderBadge}`}>
                <AlertTriangle className="w-3 h-3" />
                <span>{hazard.label}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {item.titulo}
            </h1>

            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                {item.companyCity}, {item.companyState} • <strong>{item.distanceKm} km</strong> de você
              </span>
            </div>
          </div>

          {/* GALERIA DE FOTOS */}
          <div className="space-y-2">
            <div className="relative w-full h-64 sm:h-80 rounded-3xl bg-zinc-950 overflow-hidden border border-[#1f3326] shadow-xl">
              <img
                src={item.fotos[activePhotoIdx] || item.fotos[0]}
                alt={item.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Preço / Condição flutuante na foto */}
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-zinc-700/80 px-3.5 py-1.5 rounded-2xl">
                <span className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                  {item.tipoNegociacao === 'venda'
                    ? `${formatCurrency(item.precoUnitario)} ${item.precoUnidade ? `/${item.volumeUnidade}` : ''}`
                    : item.tipoNegociacao === 'doacao'
                      ? 'Gratuito (Doação Sustentável)'
                      : 'Disponível para Troca'}
                </span>
              </div>
            </div>

            {/* Miniaturas */}
            {item.fotos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {item.fotos.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activePhotoIdx === idx
                        ? 'border-emerald-400 scale-105'
                        : 'border-[#1f3326] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={f} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ABAS: DETALHES vs EMPRESA (Fiel ao mockup) */}
          <div className="flex bg-[#101b16] p-1 rounded-2xl border border-[#1e3427]">
            <button
              onClick={() => setActiveTab('detalhes')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'detalhes'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Detalhes Técnicos
            </button>
            <button
              onClick={() => setActiveTab('empresa')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'empresa'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Dados da Empresa
            </button>
          </div>

          {/* CONTEÚDO DA ABA DETALHES */}
          {activeTab === 'detalhes' && (
            <div className="space-y-4">
              
              {/* Grid de Especificações Rápidas */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Categoria</span>
                  <strong className="text-zinc-200 text-xs">{catInfo?.label || item.categoria}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Tipo de Material</span>
                  <strong className="text-emerald-300 text-xs">{item.tipoMaterial}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Volume Disponível</span>
                  <strong className="text-zinc-200 text-xs font-mono">
                    {formatWeight(item.volumeDisponivel, item.volumeUnidade)}
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Recorrência</span>
                  <strong className="text-zinc-200 text-xs">{item.recorrencia}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Estado de Conservação</span>
                  <strong className="text-zinc-200 text-xs truncate block">{item.estadoConservacao}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Negociação</span>
                  <strong className="text-zinc-200 text-xs capitalize">{item.tipoNegociacao}</strong>
                </div>
              </div>

              {/* SEÇÃO OBRIGATÓRIA SOLICITADA: PARA QUE SERVE O ITEM */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#10241b] to-[#0c1813] border border-emerald-600/40 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span>Para que serve este item? (Potencial de Aplicação)</span>
                </div>
                <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
                  {item.paraQueServe}
                </p>
                {item.trocaInteresse && (
                  <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200">
                    <strong>Interesse de Permuta: </strong>
                    <span>{item.trocaInteresse}</span>
                  </div>
                )}
              </div>

              {/* SEÇÃO OBRIGATÓRIA SOLICITADA: GRAU DE PERIGO DETALHADO */}
              <div className={`p-4 rounded-3xl border ${hazard.bgBadge} ${hazard.borderBadge}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${hazard.color}`} />
                    <span className={`font-black text-xs uppercase tracking-wider ${hazard.color}`}>
                      Grau de Perigo: {hazard.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Norma {hazard.norma}
                  </span>
                </div>

                <p className="text-zinc-300 text-xs leading-relaxed mb-3">
                  {item.detalhesPerigo || hazard.descricaoGeral}
                </p>

                {item.precaucoesManuseio && item.precaucoesManuseio.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                    <span className="text-[11px] font-bold text-zinc-300 uppercase block">
                      Medidas de Segurança & Precauções de Manuseio:
                    </span>
                    <ul className="space-y-1">
                      {item.precaucoesManuseio.map((prec, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-300">
                          <span className="text-emerald-400 font-bold shrink-0">•</span>
                          <span>{prec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Descrição Técnica Completa */}
              <div className="p-4 rounded-3xl bg-[#101a15] border border-[#1b2d22] space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Descrição Técnica & Composição
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {item.descricaoTecnica}
                </p>
                {item.observacoesLogisticas && (
                  <div className="pt-2 border-t border-[#1b2d22] flex items-start gap-2 text-[11px] text-zinc-400">
                    <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Logística: </strong>{item.observacoesLogisticas}</span>
                  </div>
                )}
              </div>

              {/* Certificações */}
              {item.certificacoes && item.certificacoes.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-zinc-400">Certificações e Laudos:</span>
                  {item.certificacoes.map((c, i) => (
                    <span key={i} className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2.5 py-1 rounded-xl font-medium">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTEÚDO DA ABA EMPRESA */}
          {activeTab === 'empresa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-[#101a15] border border-[#1b2d22] flex items-center gap-3.5">
                <img
                  src={company?.avatarUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/50 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm text-white">{item.companyName}</h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">CNPJ: {item.companyCnpj}</p>
                  <span className="inline-block mt-1 text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                    Empresa Verificada B2B
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Ramo de Atuação</span>
                  <p className="font-semibold text-zinc-200 mt-0.5">{company?.ramo || 'Transformação Industrial'}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Licença Ambiental</span>
                  <p className="font-semibold text-emerald-300 mt-0.5">{company?.licencaAmbiental || 'LO CETESB Vigente'}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Localização da Planta</span>
                  <p className="font-semibold text-zinc-200 mt-0.5">{item.localizacao.endereco}, {item.localizacao.cidade} - {item.localizacao.estado}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#101a15] border border-[#1b2d22]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Total de Resíduos Desviados</span>
                  <p className="font-semibold text-lime-400 font-mono mt-0.5">{company?.residuosDesviadosTotal || 128.6} toneladas</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RODAPÉ FIXO DE AÇÃO (Fiel à imagem: Chat com a empresa + Tenho interesse) */}
        <div className="p-4 bg-[#101b16] border-t border-[#1d3125] flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenChat(item);
            }}
            className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-[#16291e] hover:bg-[#1e3829] text-emerald-300 border border-emerald-600/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat com a empresa</span>
          </button>

          <button
            onClick={() => {
              setProposalSent(true);
              setTimeout(() => {
                onClose();
                onOpenChat(item);
              }, 600);
            }}
            className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>{proposalSent ? 'Enviando Proposta...' : 'Tenho interesse'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
