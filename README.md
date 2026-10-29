# RE-INDUSTRIAL — Marketplace de Economia Circular B2B

> **Transformamos o resíduo de uma empresa em matéria-prima para o futuro do planeta.**
> Plataforma completa de compra, venda, troca e doação de insumos e resíduos industriais com compliance ambiental e rastreabilidade ESG.

---

## 🚀 Funcionalidades Principais

- **Comprar, Venda e Doação**:
  - Três modos de navegação e filtros diretos no topo:
    - 🛒 **Comprar**: Oportunidades de aquisição de insumos secundários de baixo custo.
    - 🏷️ **Venda**: Anúncios comerciais com precificação em R$/kg, R$/ton, etc.
    - 🎁 **Doação**: Destinação gratuita (R$ 0,00) com foco em economia circular e mitigação de custos de aterro.
- **Pesquisa Avançada no Canto Superior Direito**:
  - Busca em tempo real por nome do material, resíduo, código NCM, cidade ou aplicação.
  - Filtros por **Preço**, **Distância / Raio (10 a 1.000 km)**, **Localização (UF e Cidade)**, **Tamanho / Volume** e **Recorrência**.
- **Categorização & Grau de Perigo (ABNT NBR 10004)**:
  - Categorias: Plásticos, Metais, Papelão, Químicos & Solventes, Lodos de ETE, Biomassa, Vidro, Eletrônicos (REEE), Borracha, etc.
  - Alertas e requisitos legais para **Classe I (Perigoso)**, **Classe II A (Não Inerte)** e **Classe II B (Inerte)**.
  - Seção com a explicação técnica: **"Para que serve este item"** (aplicações industriais e reciclagem).
- **Cadastro Completo B2B**:
  - Cadastro de empresas com CNPJ, Razão Social, Nome Fantasia, Ramo de Atuação, CEP, Licença Ambiental (CADRI, LO CETESB, IBAMA) e Certificações (ISO 14001).
- **Chat de Negociação B2B Estilo WhatsApp**:
  - Abas: `Todas as conversas`, `Não lidas` e `Favoritos`.
  - **Primeira mensagem do chat** exibe automaticamente o item postado (foto, nome, valor e descrição).
  - Dois botões de ação imediata: `Aceitar proposta` e `Não Aceitar Proposta`.
  - Balões com hora e confirmação de leitura (`✓✓`).
- **Criador de Anúncios Passo a Passo (Wizard de 4 Etapas)**:
  - Upload de fotos reais com drag & drop e preview.
  - Dados técnicos, para que serve, grau de perigo, volume, preço/doação/troca e logística.
- **Painel de Impacto ESG**:
  - Métricas em tempo real: toneladas desviadas do aterro, CO₂ evitado, árvores salvas e economia gerada em R$.
  - Gráfico interativo de evolução mensal.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS v4** + `@tailwindcss/vite`
- **Lucide React** (Ícones industriais modernos)
- **LocalStorage API** (Persistência no navegador)

---

## 📦 Como Executar o Projeto Localmente

1. Clone o repositório:
```bash
git clone https://github.com/wemersonnascimento/PROJETO-INSUMO.git
cd PROJETO-INSUMO
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173/
```

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
