import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Trees, 
  CloudFog, 
  Recycle, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Calendar,
  CheckCircle2,
  X,
  Share2
} from 'lucide-react';
import { ESGImpactMetrics, Company } from '../types';

interface ESGPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ESGImpactMetrics;
  company: Company;
}

export const ESGPanelModal: React.FC<ESGPanelModalProps> = ({
  isOpen,
  onClose,
  metrics,
  company,
}) => {
  const [period, setPeriod] = useState('12_meses');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  // Pontos do gráfico de evolução (Jan a Dez como na imagem)
  const chartData = [
    { month: 'Jan', val: 12 },
    { month: 'Fev', val: 18 },
    { month: 'Mar', val: 25 },
    { month: 'Abr', val: 32 },
    { month: 'Mai', val: 45 },
    { month: 'Jun', val: 58 },
    { month: 'Jul', val: 68 },
    { month: 'Ago', val: 82 },
    { month: 'Set', val: 95 },
    { month: 'Out', val: 110 },
    { month: 'Nov', val: 120 },
    { month: 'Dez', val: 128.6 },
  ];

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Relatório ESG Certificado gerado com sucesso! Salvo na sua pasta de Downloads.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0c1612] border border-[#1f3326] sm:rounded-3xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col justify-between text-zinc-100 shadow-2xl overflow-hidden">
        
        {/* CABEÇALHO (Screen 10) */}
        <div className="px-4 py-3.5 bg-[#101b16] border-b border-[#1d3125] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-black text-white">
                Meu Impacto ESG
              </h2>
              <p className="text-[10px] text-emerald-400">
                {company.nomeFantasia} • Indicadores Verificados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-[#15231c] border border-[#23382c] text-zinc-300 rounded-xl px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="12_meses">Últimos 12 meses</option>
              <option value="ano_atual">Ano Atual (2026)</option>
              <option value="total">Histórico Completo</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CORPO DO PAINEL COM SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-left text-xs">
          
          {/* 4 CARDS DE INDICADORES (Exatos da imagem Screen 10) */}
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* Card 1: Resíduos desviados */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#12241b] to-[#0e1a14] border border-[#203a2a] shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  Resíduos desviados do aterro
                </span>
                <Recycle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {metrics.residuosDesviadosTon.toLocaleString('pt-BR')}
                </span>
                <span className="text-xs text-emerald-400 font-bold">toneladas</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                +14.2% em relação ao trimestre anterior
              </p>
            </div>

            {/* Card 2: CO2 evitado */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#12241b] to-[#0e1a14] border border-[#203a2a] shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  CO₂ evitado
                </span>
                <CloudFog className="w-4 h-4 text-lime-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {metrics.co2EvitadoTon.toLocaleString('pt-BR')}
                </span>
                <span className="text-xs text-lime-400 font-bold">toneladas</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Pegada de carbono neutralizada
              </p>
            </div>

            {/* Card 3: Árvores preservadas */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#12241b] to-[#0e1a14] border border-[#203a2a] shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  Árvores preservadas
                </span>
                <Trees className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {metrics.arvoresPreservadas.toLocaleString('pt-BR')}
                </span>
                <span className="text-xs text-emerald-400 font-bold">unidades</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Equivalente em biomassa florestal
              </p>
            </div>

            {/* Card 4: Economia gerada */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#12241b] to-[#0e1a14] border border-[#203a2a] shadow-lg">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  Economia gerada
                </span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  R$ 842 mil
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Receita de resíduo + corte de taxas
              </p>
            </div>

          </div>

          {/* GRÁFICO: EVOLUÇÃO DO IMPACTO (Exato do mockup Screen 10) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#111c17] border border-[#1e3427] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-xs sm:text-sm">
                  Evolução do impacto (toneladas)
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Histórico acumulado de destinação sustentável
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-800/40">
                Meta: 150 ton
              </span>
            </div>

            {/* Curva SVG Suave Interativa */}
            <div className="relative pt-4 pb-1">
              <svg viewBox="0 0 500 160" className="w-full h-36 overflow-visible">
                <defs>
                  <linearGradient id="impactGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Linhas de Grade */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#1c2d24" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#1c2d24" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#1c2d24" strokeDasharray="3 3" />

                {/* Área sob a curva */}
                <path
                  d="M 10 135 C 50 130, 90 120, 130 110 C 170 100, 210 90, 250 75 C 290 60, 330 50, 370 38 C 410 28, 450 20, 490 15 L 490 150 L 10 150 Z"
                  fill="url(#impactGradient)"
                />

                {/* Linha principal */}
                <path
                  d="M 10 135 C 50 130, 90 120, 130 110 C 170 100, 210 90, 250 75 C 290 60, 330 50, 370 38 C 410 28, 450 20, 490 15"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Pontos nos meses */}
                {[
                  { cx: 10, cy: 135 },
                  { cx: 50, cy: 130 },
                  { cx: 90, cy: 120 },
                  { cx: 130, cy: 110 },
                  { cx: 170, cy: 100 },
                  { cx: 210, cy: 90 },
                  { cx: 250, cy: 75 },
                  { cx: 290, cy: 60 },
                  { cx: 330, cy: 50 },
                  { cx: 370, cy: 38 },
                  { cx: 410, cy: 28 },
                  { cx: 490, cy: 15 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={i === 11 ? 5 : 3}
                    fill={i === 11 ? '#4ade80' : '#22c55e'}
                    className="hover:scale-150 transition-all cursor-pointer"
                  />
                ))}
              </svg>

              {/* Legenda dos meses */}
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono pt-1">
                {chartData.map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SELO DE CONFORMIDADE E CERTIFICADO AMBIENTAL */}
          <div className="p-4 rounded-3xl bg-emerald-950/40 border border-emerald-700/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Certificado ESG de Economia Circular</p>
                <p className="text-[10px] text-zinc-400">Rastreabilidade completa com MTR e CADRI homologados</p>
              </div>
            </div>

            <button
              onClick={handleDownloadReport}
              disabled={downloading}
              className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Gerando...' : 'Baixar PDF'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
