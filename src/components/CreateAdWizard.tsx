import React, { useState } from 'react';
import { 
  ArrowLeft, 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Check, 
  ChevronRight, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  FileCheck2, 
  Image as ImageIcon,
  DollarSign,
  PackageCheck,
  CheckCircle2
} from 'lucide-react';
import { WasteItem, Company, ItemCategory, NegotiationType, HazardClass } from '../types';
import { CATEGORY_LABELS, HAZARD_INFO, formatCurrency, formatWeight } from '../utils/formatters';

interface CreateAdWizardProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: Company;
  onPublishAd: (newItem: WasteItem) => void;
}

export const CreateAdWizard: React.FC<CreateAdWizardProps> = ({
  isOpen,
  onClose,
  currentCompany,
  onPublishAd,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [fotos, setFotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80',
  ]);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<ItemCategory>('plasticos');
  const [tipoMaterial, setTipoMaterial] = useState('');
  
  // Passo 2
  const [descricaoTecnica, setDescricaoTecnica] = useState('');
  const [paraQueServe, setParaQueServe] = useState('');
  const [grauPerigo, setGrauPerigo] = useState<HazardClass>('classe-iib');
  const [detalhesPerigo, setDetalhesPerigo] = useState('');
  const [volumeDisponivel, setVolumeDisponivel] = useState<number>(1000);
  const [volumeUnidade, setVolumeUnidade] = useState('kg');
  const [recorrencia, setRecorrencia] = useState<'Mensal' | 'Pontual' | 'Semanal' | 'Trimestral'>('Mensal');
  const [tipoNegociacao, setTipoNegociacao] = useState<NegotiationType>('venda');
  const [precoUnitario, setPrecoUnitario] = useState<number>(3.50);
  const [trocaInteresse, setTrocaInteresse] = useState('');
  const [estadoConservacao, setEstadoConservacao] = useState('Limpo, ensacado e livre de contaminantes');

  // Passo 3
  const [cep, setCep] = useState(currentCompany.cep || '04571-010');
  const [endereco, setEndereco] = useState(currentCompany.endereco || 'Distrito Industrial');
  const [cidade, setCidade] = useState(currentCompany.cidade || 'São Paulo');
  const [estado, setEstado] = useState(currentCompany.estado || 'SP');
  const [raioColetaKm, setRaioColetaKm] = useState(100);
  const [certificacoes, setCertificacoes] = useState<string[]>(['ISO 14001', 'CADRI']);
  const [observacoesLogisticas, setObservacoesLogisticas] = useState('Carregamento por empilhadeira em doca coberta. Horário comercial.');

  if (!isOpen) return null;

  // Upload handler for user-selected images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const addPresetImage = (url: string) => {
    if (!fotos.includes(url)) {
      setFotos([...fotos, url]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!titulo) {
        setTitulo(`${tipoMaterial || 'Material Industrial'} - Lote Disponível`);
      }
      setStep(2);
    } else if (step === 2) {
      if (!paraQueServe) {
        setParaQueServe('Material secundário reciclável para reaproveitamento em ciclo fechado ou reprocessamento fabril.');
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePublish = () => {
    const newItem: WasteItem = {
      id: `item-${Date.now()}`,
      companyId: currentCompany.id,
      companyName: currentCompany.nomeFantasia,
      companyCity: cidade,
      companyState: estado,
      companyCnpj: currentCompany.cnpj,
      distanceKm: Math.floor(Math.random() * 50) + 10,
      titulo: titulo || `${tipoMaterial} - ${volumeDisponivel} ${volumeUnidade}`,
      categoria,
      tipoMaterial: tipoMaterial || 'Matéria-prima secundária',
      tipoNegociacao,
      precoUnitario: tipoNegociacao === 'venda' ? precoUnitario : 0,
      precoUnidade: tipoNegociacao === 'venda' ? `R$/${volumeUnidade}` : undefined,
      trocaInteresse: tipoNegociacao === 'troca' ? trocaInteresse : undefined,
      volumeDisponivel,
      volumeUnidade,
      recorrencia,
      estadoConservacao,
      paraQueServe: paraQueServe || 'Insumo para reaproveitamento industrial.',
      grauPerigo,
      detalhesPerigo: detalhesPerigo || HAZARD_INFO[grauPerigo].descricaoGeral,
      precaucoesManuseio: grauPerigo === 'classe-i' 
        ? ['Uso obrigatório de EPIs adequados', 'Transporte credenciado com MTR', 'Armazenamento em bacia de contenção']
        : ['Manter em local seco e ventilado', 'Uso de luvas de proteção mecânica'],
      fotos: fotos.length > 0 ? fotos : ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'],
      localizacao: {
        cep,
        endereco,
        cidade,
        estado,
        raioColetaKm,
      },
      certificacoes,
      descricaoTecnica: descricaoTecnica || 'Resíduo de processo fabril pronto para destinação.',
      observacoesLogisticas,
      criadoEm: new Date().toISOString(),
      visualizacoes: 1,
      destacado: true,
    };

    setIsSuccess(true);
    setTimeout(() => {
      onPublishAd(newItem);
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0c1612] border border-[#1f3326] sm:rounded-3xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col justify-between text-zinc-100 shadow-2xl overflow-hidden">
        
        {/* CABEÇALHO COM PROGRESSO (1 - 2 - 3 - 4) */}
        <div className="px-5 py-3.5 bg-[#101b16] border-b border-[#1d3125] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : null}
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Criar novo anúncio
            </h2>
          </div>

          {/* Stepper Visual (1 - 2 - 3 - 4 como na imagem) */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    step === s
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/50 scale-110'
                      : step > s
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/60'
                        : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-3.5 sm:w-5 h-0.5 mx-1 ${
                      step > s ? 'bg-emerald-600' : 'bg-zinc-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FEEDBACK DE SUCESSO */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-4 my-auto animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white">Anúncio Publicado com Sucesso!</h3>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto">
              Seu resíduo já está visível para indústrias e recicladores de todo o Brasil no marketplace RE-INDUSTRIAL.
            </p>
          </div>
        ) : (
          /* FORMULÁRIO COM AS 4 ETAPAS */
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-left text-xs">
            
            {/* ============================================================ */}
            {/* PASSO 1: FOTOS & CATEGORIAS */}
            {/* ============================================================ */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Fotos do Material (Adicione a foto do item) *
                  </label>
                  
                  {/* Grid de Fotos e Botão de Adicionar */}
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {fotos.map((f, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#22382c] group">
                        <img src={f} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Botão de Adicionar Imagem (Upload Real) */}
                    <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-emerald-600/50 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 flex flex-col items-center justify-center cursor-pointer transition-all text-emerald-400">
                      <Plus className="w-6 h-6 mb-0.5" />
                      <span className="text-[9px] font-bold uppercase">Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Sugestões rápidas de fotos industriais */}
                  <div className="mt-2 text-[10px] text-zinc-400">
                    <p className="mb-1 text-zinc-500">Presets rápidos de fotos industriais:</p>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => addPresetImage('https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80')}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-emerald-500"
                      >
                        + Plástico PP
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetImage('https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=800&auto=format&fit=crop&q=80')}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-emerald-500"
                      >
                        + Sucata de Alumínio
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetImage('https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80')}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-emerald-500"
                      >
                        + Fardos de Papelão
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80')}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-emerald-500"
                      >
                        + Tambores / Químicos
                      </button>
                    </div>
                  </div>
                </div>

                {/* Título do Anúncio */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Título Comercial do Anúncio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aparas de Plástico PP Pós-Industrial Limpas"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Categoria do Resíduo */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Categoria do Resíduo / Insumo *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as ItemCategory)}
                    className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label} - ({v.description.slice(0, 35)}...)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Material Específico */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Tipo Específico do Material *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: PP Homopolímero, Alumínio 6063, Kraft, Lodo de ETE..."
                    value={tipoMaterial}
                    onChange={(e) => setTipoMaterial(e.target.value)}
                    className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PASSO 2: DESCRIÇÃO, PARA QUE SERVE, GRAU DE PERIGO E NEGOCIAÇÃO */}
            {/* ============================================================ */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Exigência do usuário: Para que serve aquele item */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#122b1f] to-[#0c1813] border border-emerald-500/50">
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    <span>Para que serve este item? (Aplicações industriais recomendadas) *</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Explique como a outra empresa pode reutilizar ou reciclar este material (ex: moagem para injeção de baldes, fundição secundária, queima para energia, etc.)."
                    value={paraQueServe}
                    onChange={(e) => setParaQueServe(e.target.value)}
                    className="w-full bg-[#0b1410] border border-[#203a2b] focus:border-emerald-400 rounded-xl p-2.5 text-xs text-zinc-100"
                  />
                </div>

                {/* Exigência do usuário: Grau de perigo */}
                <div className="p-3.5 rounded-2xl bg-[#111c17] border border-[#23382c]">
                  <label className="block text-[11px] font-bold text-zinc-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Grau de Perigo do Material (ABNT NBR 10004) *</span>
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'classe-iib', label: 'Classe II B', sub: 'Inerte / Sem Risco', color: 'border-emerald-500 text-emerald-300' },
                      { id: 'classe-iia', label: 'Classe II A', sub: 'Não Inerte / Biodegr.', color: 'border-amber-500 text-amber-300' },
                      { id: 'classe-i', label: 'Classe I', sub: 'Perigoso / Químico', color: 'border-rose-500 text-rose-400' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGrauPerigo(g.id as HazardClass)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          grauPerigo === g.id
                            ? `bg-emerald-950/80 ${g.color} font-bold shadow-md`
                            : 'bg-[#15231c] text-zinc-400 border-[#22382c]'
                        }`}
                      >
                        <p className="text-xs font-bold">{g.label}</p>
                        <p className="text-[9px] mt-0.5">{g.sub}</p>
                      </button>
                    ))}
                  </div>

                  {grauPerigo === 'classe-i' && (
                    <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[11px] space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Atenção: Resíduo Classe I (Perigoso)
                      </p>
                      <p className="text-[10px] text-zinc-300">
                        O transporte exigirá Manifesto de Transporte de Resíduos (MTR) e veículo credenciado com placa de risco.
                      </p>
                    </div>
                  )}
                </div>

                {/* Tipo de Negociação (Venda, Doação, Troca) */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Modalidade da Negociação *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTipoNegociacao('venda')}
                      className={`py-2 rounded-xl text-center font-bold text-xs border ${
                        tipoNegociacao === 'venda'
                          ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                          : 'bg-[#121c17] text-zinc-400 border-[#22382c]'
                      }`}
                    >
                      Venda (R$)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoNegociacao('doacao')}
                      className={`py-2 rounded-xl text-center font-bold text-xs border ${
                        tipoNegociacao === 'doacao'
                          ? 'bg-lime-500 text-zinc-950 border-lime-400 font-black shadow-md'
                          : 'bg-[#121c17] text-zinc-400 border-[#22382c]'
                      }`}
                    >
                      Doação (R$ 0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoNegociacao('troca')}
                      className={`py-2 rounded-xl text-center font-bold text-xs border ${
                        tipoNegociacao === 'troca'
                          ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                          : 'bg-[#121c17] text-zinc-400 border-[#22382c]'
                      }`}
                    >
                      Troca / Permuta
                    </button>
                  </div>
                </div>

                {/* Preço ou Troca */}
                {tipoNegociacao === 'venda' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                        Preço Unitário (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={precoUnitario}
                        onChange={(e) => setPrecoUnitario(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                        Unidade de Cobrança
                      </label>
                      <select
                        value={volumeUnidade}
                        onChange={(e) => setVolumeUnidade(e.target.value)}
                        className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="kg">R$ por quilo (kg)</option>
                        <option value="ton">R$ por tonelada (ton)</option>
                        <option value="m³">R$ por metro cúbico (m³)</option>
                        <option value="peças">R$ por peça / unidade</option>
                        <option value="litros">R$ por litro (L)</option>
                      </select>
                    </div>
                  </div>
                )}

                {tipoNegociacao === 'troca' && (
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                      O que sua empresa busca em troca? *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Troco por tambores de 200L ou caixas plásticas"
                      value={trocaInteresse}
                      onChange={(e) => setTrocaInteresse(e.target.value)}
                      className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                )}

                {/* Volume e Recorrência */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                      Volume Disponível *
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={volumeDisponivel}
                        onChange={(e) => setVolumeDisponivel(parseFloat(e.target.value) || 1)}
                        className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                      <span className="p-2 bg-[#17261e] border border-[#274032] rounded-xl text-zinc-300 font-mono text-xs">
                        {volumeUnidade}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                      Frequência / Recorrência
                    </label>
                    <select
                      value={recorrencia}
                      onChange={(e) => setRecorrencia(e.target.value as any)}
                      className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Mensal">Geração Mensal</option>
                      <option value="Pontual">Lote Pontual / Único</option>
                      <option value="Semanal">Geração Semanal</option>
                      <option value="Trimestral">Geração Trimestral</option>
                    </select>
                  </div>
                </div>

                {/* Descrição Técnica */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                    Descrição Técnica (Origem, estado, impurezas)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Descreva a pureza, se há contaminação, se é pós-industrial ou pós-consumo..."
                    value={descricaoTecnica}
                    onChange={(e) => setDescricaoTecnica(e.target.value)}
                    className="w-full bg-[#121c17] border border-[#274032] rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PASSO 3: LOCALIZAÇÃO, RAIO & LOGÍSTICA */}
            {/* ============================================================ */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                      CEP da Planta / Galpão *
                    </label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                      Cidade / UF *
                    </label>
                    <input
                      type="text"
                      value={`${cidade} - ${estado}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('-');
                        setCidade(parts[0]?.trim() || cidade);
                        if (parts[1]) setEstado(parts[1].trim());
                      }}
                      className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                    Endereço Completo de Coleta
                  </label>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">
                      Raio de Coleta Desejado:
                    </label>
                    <span className="font-mono text-emerald-400 font-bold">{raioColetaKm} km</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={10}
                    value={raioColetaKm}
                    onChange={(e) => setRaioColetaKm(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-[#1b2f23] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1.5">
                    Certificações Ambientais Disponíveis:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['ISO 14001', 'CADRI Ativo', 'MTR Sinir', 'Laudo de Pureza', 'IBAMA CTF'].map((cert) => {
                      const selected = certificacoes.includes(cert);
                      return (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => {
                            setCertificacoes(selected ? certificacoes.filter(c => c !== cert) : [...certificacoes, cert]);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            selected
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          }`}
                        >
                          {selected ? '✓ ' : '+ '} {cert}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                    Observações de Logística e Carregamento
                  </label>
                  <textarea
                    rows={2}
                    value={observacoesLogisticas}
                    onChange={(e) => setObservacoesLogisticas(e.target.value)}
                    className="w-full bg-[#121c17] border border-[#274032] rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PASSO 4: RESUMO & PUBLICAÇÃO (Screen 8) */}
            {/* ============================================================ */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl text-emerald-300 text-xs">
                  <p className="font-bold">Confira as informações antes de publicar seu anúncio.</p>
                  <p className="text-[11px] text-zinc-300 mt-0.5">Ele ficará visível instantaneamente no Feed Inteligente.</p>
                </div>

                {/* Card de Pré-visualização */}
                <div className="p-4 rounded-3xl bg-[#121c17] border border-[#22382c] space-y-3">
                  <div className="flex gap-3">
                    <img
                      src={fotos[0] || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover border border-[#22382c]"
                    />
                    <div className="truncate flex-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                        {CATEGORY_LABELS[categoria]?.label}
                      </span>
                      <h4 className="font-bold text-sm text-white truncate">{titulo || tipoMaterial}</h4>
                      <p className="text-xs text-zinc-400">{cidade}, {estado} • Raio de {raioColetaKm} km</p>
                      <p className="text-xs font-mono font-bold text-emerald-300 mt-1">
                        {tipoNegociacao === 'venda' 
                          ? `${formatCurrency(precoUnitario)} / ${volumeUnidade}`
                          : tipoNegociacao === 'doacao' ? 'Gratuito (Doação)' : 'Permuta / Troca'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#1e3427]">
                    <div>
                      <span className="text-zinc-500 block uppercase">Volume</span>
                      <strong className="text-zinc-200">{formatWeight(volumeDisponivel, volumeUnidade)} ({recorrencia})</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase">Grau de Perigo</span>
                      <span className="text-amber-400 font-bold">{HAZARD_INFO[grauPerigo].label}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0b1410] border border-[#1e3427] text-[11px]">
                    <span className="text-emerald-400 font-semibold block mb-0.5">Para que serve:</span>
                    <p className="text-zinc-300">{paraQueServe}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* RODAPÉ DO WIZARD COM BOTÕES */}
        {!isSuccess && (
          <div className="p-4 bg-[#101b16] border-t border-[#1d3125] flex items-center justify-between gap-3 shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-300 hover:text-white"
              >
                Voltar
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-950/60"
              >
                <span>Continuar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Salvar Rascunho
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="py-2.5 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-zinc-950 flex items-center gap-1.5 shadow-lg shadow-emerald-950/80 font-black"
                >
                  <Check className="w-4 h-4" />
                  <span>Publicar anúncio</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
