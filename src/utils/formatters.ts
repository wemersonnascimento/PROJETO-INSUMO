export function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return cnpj;
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return cep;
  return clean.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

export function formatWeight(value: number, unit: string = 'kg'): string {
  const formatted = new Intl.NumberFormat('pt-BR').format(value);
  return `${formatted} ${unit}`;
}

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  plasticos: {
    label: 'Plásticos & Polímeros',
    icon: 'Package',
    description: 'PP, PEAD, PEBD, PET, PVC, ABS, PS moídos ou em fardos',
  },
  metais: {
    label: 'Metais & Sucata',
    icon: 'Hammer',
    description: 'Alumínio, cobre, aço/ferro, latão, cavacos e tarugos',
  },
  papel_papelao: {
    label: 'Papel & Papelão',
    icon: 'FileText',
    description: 'Ondulado Kraft, papel branco, jornais, tubetes e aparas',
  },
  quimicos_solventes: {
    label: 'Químicos & Solventes',
    icon: 'FlaskConical',
    description: 'Solventes recuperáveis, óleos usados, resinas e ácidos',
  },
  lodos_efluentes: {
    label: 'Lodos & Efluentes',
    icon: 'Droplets',
    description: 'Lodo biológico/químico de ETE desidratado, borras para coprocessamento',
  },
  madeira_biomassa: {
    label: 'Madeira & Biomassa',
    icon: 'Trees',
    description: 'Paletes PBR, serragem, cavacos de eucalipto, caixotaria',
  },
  vidro: {
    label: 'Vidro Industrial',
    icon: 'Sparkles',
    description: 'Cacos de vidro planos, garrafas e embalagens limpas',
  },
  eletronicos_reee: {
    label: 'Eletrônicos (REEE)',
    icon: 'Cpu',
    description: 'Placas de circuito impresso, fiações, gabinetes e baterias',
  },
  borracha_pneus: {
    label: 'Borracha & Pneus',
    icon: 'Disc',
    description: 'Raspas de recapagem, correias trituradas e grânulos',
  },
  texteis: {
    label: 'Resíduos Têxteis',
    icon: 'Scissors',
    description: 'Retalhos de algodão, sintéticos, estopa e desfiados',
  },
  organicos_agro: {
    label: 'Orgânicos & Agroindústria',
    icon: 'Apple',
    description: 'Bagaço, cascas, torta vegetal para compostagem ou biogás',
  },
};

export const HAZARD_INFO: Record<string, {
  label: string;
  sub: string;
  color: string;
  bgBadge: string;
  borderBadge: string;
  iconName: string;
  norma: string;
  descricaoGeral: string;
}> = {
  'classe-i': {
    label: 'Classe I - Perigoso',
    sub: 'Alto Risco / Regulamentado',
    color: 'text-rose-400',
    bgBadge: 'bg-rose-500/15',
    borderBadge: 'border-rose-500/40',
    iconName: 'AlertTriangle',
    norma: 'ABNT NBR 10004:2004',
    descricaoGeral: 'Apresenta periculosidade por inflamabilidade, corrosividade, reatividade, toxicidade ou patogenicidade. Exige CADRI/MTR e transporte credenciado.',
  },
  'classe-iia': {
    label: 'Classe II A - Não Inerte',
    sub: 'Risco Médio / Biodegradável',
    color: 'text-amber-400',
    bgBadge: 'bg-amber-500/15',
    borderBadge: 'border-amber-500/40',
    iconName: 'Info',
    norma: 'ABNT NBR 10004:2004',
    descricaoGeral: 'Possui propriedades de biodegradabilidade, combustibilidade ou solubilidade em água. Não é perigoso, mas requer destinação controlada.',
  },
  'classe-iib': {
    label: 'Classe II B - Inerte',
    sub: 'Baixo Risco / Não Perigoso',
    color: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/15',
    borderBadge: 'border-emerald-500/40',
    iconName: 'ShieldCheck',
    norma: 'ABNT NBR 10004:2004',
    descricaoGeral: 'Resíduo totalmente inerte. Não tem nenhum de seus constituintes solubilizados em concentrações superiores aos padrões de água potável.',
  },
};
