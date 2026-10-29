import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Phone, 
  Mail, 
  MapPin,
  Recycle,
  Sparkles
} from 'lucide-react';
import { Company } from '../types';
import { formatCNPJ, formatCEP } from '../utils/formatters';

interface AuthB2BModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated: (newCompany: Company) => void;
  initialMode?: 'login' | 'register';
  availableCompanies: Company[];
  onSelectCompany: (company: Company) => void;
}

export const AuthB2BModal: React.FC<AuthB2BModalProps> = ({
  isOpen,
  onClose,
  onCompanyCreated,
  initialMode = 'login',
  availableCompanies,
  onSelectCompany,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login State
  const [loginCnpj, setLoginCnpj] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    ramo: 'Transformação Plástica & Injeção',
    email: '',
    telefone: '',
    whatsapp: '',
    cep: '',
    endereco: '',
    cidade: 'São Paulo',
    estado: 'SP',
    licencaAmbiental: '',
    certificacoes: ['ISO 14001'],
  });

  if (!isOpen) return null;

  const handleCnpjChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 14);
    setLoginCnpj(formatCNPJ(raw));
    setLoginError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = loginCnpj.replace(/\D/g, '');
    if (clean.length < 14) {
      setLoginError('Por favor, informe um CNPJ válido com 14 dígitos.');
      return;
    }

    const found = availableCompanies.find(c => c.cnpj.replace(/\D/g, '') === clean);
    if (found) {
      onSelectCompany(found);
      onClose();
    } else {
      // Cria uma empresa temporária ou sugere cadastrar
      setLoginError('CNPJ não localizado na base. Deseja realizar o cadastro B2B?');
      setTimeout(() => {
        setFormData(prev => ({ ...prev, cnpj: loginCnpj }));
        setMode('register');
      }, 1500);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.razaoSocial || !formData.cnpj) {
      alert('Preencha os campos obrigatórios (Razão Social e CNPJ).');
      return;
    }

    const newComp: Company = {
      id: `comp-${Date.now()}`,
      cnpj: formData.cnpj || '00.000.000/0001-00',
      razaoSocial: formData.razaoSocial,
      nomeFantasia: formData.nomeFantasia || formData.razaoSocial.split(' ')[0],
      ramo: formData.ramo,
      email: formData.email || 'contato@empresa.com.br',
      telefone: formData.telefone || '(11) 3000-0000',
      whatsapp: formData.whatsapp || '(11) 99999-9999',
      cep: formData.cep || '01000-000',
      endereco: formData.endereco || 'Distrito Industrial',
      cidade: formData.cidade,
      estado: formData.estado,
      licencaAmbiental: formData.licencaAmbiental || 'LO-CETESB-2026',
      certificacoes: formData.certificacoes,
      avatarUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=150&auto=format&fit=crop&q=80',
      residuosDesviadosTotal: 15.0,
    };

    onCompanyCreated(newComp);
    onClose();
  };

  const toggleCertificacao = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certificacoes: prev.certificacoes.includes(cert)
        ? prev.certificacoes.filter(c => c !== cert)
        : [...prev.certificacoes, cert]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e1714] border border-[#23382c] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-zinc-100">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shadow-md">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
              RE-INDUSTRIAL
            </span>
            <h2 className="text-xl font-black text-white">
              {mode === 'login' ? 'Acesse sua conta B2B' : 'Cadastro de Empresa B2B'}
            </h2>
          </div>
        </div>

        {/* Alternador de Modo */}
        <div className="flex bg-[#14221b] p-1 rounded-xl mb-5 border border-[#23382c]">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Acessar com CNPJ
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Nova Empresa (Cadastro)
          </button>
        </div>

        {/* Formulário de Login (Screen 2) */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 my-auto">
            <div className="text-left">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Informe o CNPJ da sua empresa:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={loginCnpj}
                  onChange={(e) => handleCnpjChange(e.target.value)}
                  className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-4 py-3 text-base text-zinc-100 font-mono tracking-wider focus:outline-none transition-colors"
                  maxLength={18}
                  autoFocus
                />
                <Building2 className="w-5 h-5 text-zinc-500 absolute right-3.5 top-3.5" />
              </div>
              {loginError && (
                <p className="text-xs text-rose-400 mt-2 font-medium">
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Empresas de Demonstração Rápidas */}
            <div className="pt-3 border-t border-[#1e3327]">
              <p className="text-[11px] font-semibold text-zinc-400 text-left mb-2">
                Ou selecione uma empresa de exemplo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {availableCompanies.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCompany(c);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-[#14221b] hover:bg-[#1a2d24] border border-[#22382c] text-left transition-colors flex items-center gap-2"
                  >
                    <img 
                      src={c.avatarUrl} 
                      alt="" 
                      className="w-6 h-6 rounded-md object-cover border border-emerald-500/40"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-zinc-200 truncate">{c.nomeFantasia}</p>
                      <p className="text-[10px] text-emerald-400">{c.ramo}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 text-center pt-2">
              Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade B2B.
            </p>
          </form>
        ) : (
          /* Formulário de Cadastro B2B Completo */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 overflow-y-auto pr-1 text-left text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 14);
                    setFormData({ ...formData, cnpj: formatCNPJ(raw) });
                  }}
                  className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                  Nome Fantasia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alfa Plásticos"
                  value={formData.nomeFantasia}
                  onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                  className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                Razão Social Completa *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Polímeros e Insumos Industriais Ltda"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                  Ramo de Atuação
                </label>
                <select
                  value={formData.ramo}
                  onChange={(e) => setFormData({ ...formData, ramo: e.target.value })}
                  className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none"
                >
                  <option value="Transformação Plástica & Injeção">Transformação Plástica & Injeção</option>
                  <option value="Metalurgia & Siderurgia">Metalurgia & Siderurgia</option>
                  <option value="Papel, Celulose & Embalagens">Papel, Celulose & Embalagens</option>
                  <option value="Indústria Química & Petroquímica">Indústria Química & Petroquímica</option>
                  <option value="Construção Civil & Demolição">Construção Civil & Demolição</option>
                  <option value="Saneamento & Tratamento Efluentes">Saneamento & Tratamento Efluentes</option>
                  <option value="Agronegócio & Alimentos">Agronegócio & Alimentos</option>
                  <option value="Têxtil & Confecção">Têxtil & Confecção</option>
                  <option value="Eletrônica & Tecnologia">Eletrônica & Tecnologia</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                  E-mail Corporativo *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="compras@empresa.com.br"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-100 focus:outline-none"
                  />
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                  WhatsApp do Responsável
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-100 focus:outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                  CEP & Localização
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setFormData({ ...formData, cep: formatCEP(raw) });
                    }}
                    className="w-full bg-[#121c17] border border-[#274032] focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                  UF
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-zinc-100"
                >
                  {['SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'BA', 'ES', 'GO', 'PE'].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                Licença Ambiental / CADRI / IBAMA (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: LO-CETESB-2026 ou CADRI Ativo"
                value={formData.licencaAmbiental}
                onChange={(e) => setFormData({ ...formData, licencaAmbiental: e.target.value })}
                className="w-full bg-[#121c17] border border-[#274032] rounded-xl px-3 py-2 text-xs text-zinc-100"
              />
            </div>

            {/* Certificações */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1.5">
                Certificações da Empresa:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['ISO 14001', 'ISO 9001', 'CADRI Ativo', 'MTR Sinir', 'FSC Recycled', 'IBAMA CTF'].map((cert) => {
                  const selected = formData.certificacoes.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCertificacao(cert)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                        selected
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-sm'
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}{cert}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-[0.98] transition-all mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Cadastro & Entrar</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
