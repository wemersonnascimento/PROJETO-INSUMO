import React, { useState } from 'react';
import { 
  Recycle, 
  Leaf, 
  BrainCircuit, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  X,
  Factory,
  Sparkles
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRegistration: () => void;
  onStartLogin: () => void;
  onExploreDirectly: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartRegistration,
  onStartLogin,
  onExploreDirectly,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Bem-vindo ao futuro da indústria.',
      subtitle: 'Conecte sua empresa a um ciclo de oportunidades sustentáveis.',
      description: 'Transformamos o resíduo industrial em insumo valioso para outras fábricas. Reduza custos de aterro e gere nova receita.',
      badge: 'Economia Circular B2B',
      icon: Factory,
    },
    {
      title: 'Venda, Troque ou Doe seus Insumos.',
      subtitle: 'Flexibilidade total para descarte responsável e compliance.',
      description: 'Cadastre aparas plásticas, sucatas metálicas, papelão, lodos ou solventes com indicação de grau de perigo (NBR 10004) e emissão de MTR.',
      badge: 'Segurança & Compliance',
      icon: ShieldCheck,
    },
    {
      title: 'Painel ESG e Métricas em Tempo Real.',
      subtitle: 'Comprove seu impacto sustentável aos investidores e clientes.',
      description: 'Acompanhe toneladas desviadas do aterro, redução na pegada de carbono (CO2) e economia financeira gerada em cada transação.',
      badge: 'Métricas Comprovadas',
      icon: Sparkles,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0d1713] border border-[#203629] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden text-center text-zinc-100 min-h-[580px]">
        {/* Glow de fundo */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Topo: Logo & Identidade */}
        <div className="flex flex-col items-center pt-2">
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-green-600 to-lime-500 flex items-center justify-center shadow-xl shadow-emerald-950/80 mb-4">
            <Recycle className="w-10 h-10 text-white" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-lime-400 rounded-full border-4 border-[#0d1713]" />
          </div>

          <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-300 via-green-200 to-lime-300 bg-clip-text text-transparent">
            RE-INDUSTRIAL
          </h1>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mt-0.5">
            Marketplace de Economia Circular B2B
          </p>
        </div>

        {/* Centro: Slides de Conteúdo */}
        <div className="my-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-[11px] font-semibold text-emerald-300 mb-3">
            <Sparkles className="w-3 h-3 text-lime-400" />
            <span>{slides[currentSlide].badge}</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-2 leading-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xs font-medium text-emerald-200/90 mb-2">
            {slides[currentSlide].subtitle}
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed px-2">
            {slides[currentSlide].description}
          </p>

          {/* Dots do Carrossel */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-6 bg-emerald-400' 
                    : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3 Pilares no Rodapé (Exatamente como na imagem) */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#1e3327] my-3">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 mb-1">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-300">Sustentável</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 mb-1">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-300">Inteligente</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-amber-400 mb-1">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-300">Rentável</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={() => {
              onClose();
              onStartRegistration();
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span>Criar minha conta</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onStartLogin();
              }}
              className="py-2.5 px-3 rounded-xl font-medium text-xs bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-[#203629] transition-colors"
            >
              Já tenho uma conta
            </button>
            <button
              onClick={() => {
                onClose();
                onExploreDirectly();
              }}
              className="py-2.5 px-3 rounded-xl font-medium text-xs bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-800/40 transition-colors"
            >
              Explorar Itens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
