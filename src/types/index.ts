export type NegotiationType = 'venda' | 'troca' | 'doacao';

export type HazardClass = 
  | 'classe-i'   // Perigoso (Inflamável, Tóxico, Corrosivo, Reativo)
  | 'classe-iia' // Não Inerte (Biodegradável, Solúvel, Combustível não perigoso)
  | 'classe-iib'; // Inerte (Não afeta potabilidade da água, inerte, limpo)

export type ItemCategory = 
  | 'plasticos'
  | 'metais'
  | 'papel_papelao'
  | 'quimicos_solventes'
  | 'lodos_efluentes'
  | 'madeira_biomassa'
  | 'vidro'
  | 'eletronicos_reee'
  | 'borracha_pneus'
  | 'texteis'
  | 'organicos_agro';

export interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  ramo: string;
  email: string;
  telefone: string;
  whatsapp: string;
  cep: string;
  cidade: string;
  estado: string;
  endereco: string;
  licencaAmbiental?: string;
  certificacoes: string[]; // ex: ['ISO 14001', 'CADRI', 'MTR', 'IBAMA']
  avatarUrl?: string;
  residuosDesviadosTotal?: number; // em toneladas
}

export interface WasteItem {
  id: string;
  companyId: string;
  companyName: string;
  companyCity: string;
  companyState: string;
  companyCnpj: string;
  distanceKm: number;
  
  titulo: string;
  categoria: ItemCategory;
  tipoMaterial: string; // Ex: 'PP - Polipropileno', 'Alumínio 6063', 'Papelão Ondulado Kraft'
  
  tipoNegociacao: NegotiationType;
  precoUnitario?: number; // Caso venda
  precoUnidade?: string; // Ex: 'R$/kg', 'R$/ton', 'R$/fardo'
  trocaInteresse?: string; // Se troca, o que busca
  
  volumeDisponivel: number;
  volumeUnidade: string; // 'kg', 'ton', 'm³', 'fardos', 'peças'
  recorrencia: 'Mensal' | 'Pontual' | 'Semanal' | 'Trimestral';
  
  estadoConservacao: string; // Ex: 'Limpo e moído', 'Aparas prensadas', 'Desidratado'
  
  // Exigência explícita do usuário:
  paraQueServe: string; // Explicação detalhada de para que serve / potenciais aplicações
  grauPerigo: HazardClass;
  detalhesPerigo?: string; // Explicação dos riscos e precauções de manuseio
  precaucoesManuseio?: string[];
  
  // Fotos:
  fotos: string[];
  
  // Localização & Logística:
  localizacao: {
    cep: string;
    endereco: string;
    cidade: string;
    estado: string;
    raioColetaKm: number;
  };
  
  certificacoes: string[]; // ['ISO 14001', 'CADRI', 'MTR']
  descricaoTecnica: string;
  observacoesLogisticas?: string;
  
  criadoEm: string;
  visualizacoes: number;
  destacado?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  wasteItemId: string;
  wasteItemTitle: string;
  timestamp: string;
  text: string;
  isSystem?: boolean;
  proposal?: {
    valor: number;
    quantidade: string;
    tipoFrete: 'CIF' | 'FOB';
    status: 'pendente' | 'aceita' | 'recusada';
    arquivoNome?: string;
  };
}

export interface B2BConversation {
  id: string;
  partnerCompany: Company;
  wasteItem: WasteItem;
  unreadCount: number;
  isFavorite: boolean;
  proposalStatus: 'pendente' | 'aceita' | 'recusada';
  messages: ChatMessage[];
  lastMessageTime: string;
}

export interface ESGImpactMetrics {
  residuosDesviadosTon: number;
  co2EvitadoTon: number;
  arvoresPreservadas: number;
  economiaGeradaReais: number;
  metaMensalTon: number;
}

export interface FilterState {
  searchTerm: string;
  modoIntencao: 'todos' | 'comprar' | 'descartar';
  tipoNegociacao: 'todos' | NegotiationType;
  categoria: 'todas' | ItemCategory;
  raioMaxKm: number;
  estado: string;
  cidade: string;
  grauPerigo: 'todos' | HazardClass;
  faixaPreco: {
    min?: number;
    max?: number;
  };
  faixaVolume: {
    min?: number;
    max?: number;
  };
  recorrencia: 'todas' | 'Mensal' | 'Pontual';
}
