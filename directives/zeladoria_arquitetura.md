# Diretiva: Instrumento Digital de Zeladoria Urbana & IoT (AGENTS.md + Prompt.Md)

## 1. Visão Geral e Arquitetura de 3 Camadas
Este projeto une o escopo funcional da disciplina de Mobile (**Zeladoria Urbana + Simulação IoT de Poste Inteligente com AsyncStorage e Context API**) à direção estética cinematográfica **"High-End Organic Tech / Clinical Boutique"** definida em `Prompt.Md`.

### Camadas de Operação (`AGENTS.md`)
- **Camada 1 (`directives/`)**: Este SOP definindo o Design System estrito, a arquitetura de componentes, os fluxos funcionais e os critérios de verificação.
- **Camada 2 (Orquestração)**: Coordenação entre diretivas, validação de pacotes/polyfills e execução dos scripts determinísticos.
- **Camada 3 (`execution/`)**: Scripts determinísticos de verificação estrutural, validação de tokens visuais e integridade de compilação TypeScript (`execution/verify_project.mjs`).

---

## 2. Core Design System (Estrito — `Prompt.Md`)
- **Paleta**:
  - `Moss` (Primária): `#2E4036`
  - `Clay` (Destaque / Ação): `#CC5833`
  - `Cream` (Background): `#F2F0E9`
  - `Charcoal` (Texto / Seções Escuras): `#1A1A1A`
- **Tipografia Real (Carregada via Google Fonts / CSS Injection)**:
  - Headings: `"Plus Jakarta Sans"` & `"Outfit"` (`letterSpacing` negativo / tracking tight)
  - Drama / Ênfase Orgânica: `"Cormorant Garamond"` (Obrigatoriamente em *Itálico* para conceitos orgânicos/cívicos)
  - Dados & Telemetria: `"JetBrains Mono"` para telemetria clínica/urbana, protocolos, leitura em Lux (`lx`) e coordenadas GPS.
- **Textura Visual & Geometria**:
  - Overlay Global de Ruído (SVG `<feTurbulence>` com opacidade `0.05`) eliminando gradientes digitais chapados.
  - Sistema de bordas arredondadas de `32px` (`rounded-[2rem]`) a `48px` (`rounded-[3rem]`) e rodapé com `64px` (`rounded-t-[4rem]`).

---

## 3. Arquitetura de Componentes e Comportamento (`Prompt.Md` + Escopo Mobile)

### A. Navbar ("The Floating Island")
- Pílula fixa no topo da tela.
- **Morphing Logic**: Transparente com texto claro no topo do Hero; ao rolar a página (`scrollY > 60`), transforma-se em uma pílula glassmórfica (`rgba(255,255,255,0.72)` + `backdrop-filter: blur(16px)`) com texto em `Moss` (`#2E4036`), borda sutil e seletor instantâneo de modo (**Visão Geral**, **Canal do Cidadão**, **Central do Agente**, **Laboratório IoT**).

### B. Hero Section ("A Cidade é o *Algoritmo.*")
- Altura de `100dvh` (mínimo `640px`), imagem de fundo de floresta densa (`https://images.unsplash.com/photo-1470115636492-6d2b56f9146d`) com gradiente pesado `Moss-to-Black`.
- Conteúdo ancorado no terço inferior esquerdo com contraste tipográfico dramático (`Plus Jakarta Sans` Bold vs `Cormorant Garamond` Italic massivo) e animação de entrada escalonada (staggered fade-up).

### C. Features ("The Precision Micro-UI Dashboard")
Três artefatos funcionais interativos substituindo cards estáticos:
1. **Card 1 — Audit Intelligence ("Diagnostic Shuffler")**: 3 cartões brancos sobrepostos que ciclam verticalmente a cada 3 segundos usando lógica `unshift(pop())` com transição spring-bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`), exibindo telemetria real das ocorrências e da malha IoT.
2. **Card 2 — Neural IoT Stream ("Telemetry Typewriter")**: Feed ao vivo máquina de escrever (caractere por caractere) ciclando mensagens reais do Poste Inteligente `#PZ-042` e do `AsyncStorage`, com cursor piscante em `Clay` (`#CC5833`) e ponto pulsante `"Live Feed"`.
3. **Card 3 — Adaptive Regimen ("Mock Cursor Protocol Scheduler")**: Grade semanal (`D S T Q Q S S`) onde um cursor SVG automatizado entra, move-se até um dia de inspeção preventiva, clica (com `scale-down` visual), ativa o dia no cronograma e move-se até o botão `"Salvar Protocolo"` antes de desaparecer.

### D. Philosophy ("The Manifesto")
- Seção de alto contraste em `Charcoal` (`#1A1A1A`) com textura orgânica de fundo (`https://images.unsplash.com/photo-1542601906990-b4d3fb778b09`).
- Comparação tipográfica monumental: *"A zeladoria tradicional pergunta: O que quebrou?"* vs. *"Nós perguntamos: O que é vital?"*.

### E. Protocol ("Sticky Stacking Archive")
Pilha de 3 cartões de protocolo com animações geométricas exclusivas:
1. **Protocolo 01 (Sensoriamento Cidadão & Óptica)**: Engrenagem / dupla-hélice concêntrica em rotação contínua.
2. **Protocolo 02 (Autonomia Fotocélula IoT)**: Laser-grid escaneando continuamente uma matriz de células/nós urbanos.
3. **Protocolo 03 (Despacho & Resolução Auditada)**: Onda de pulso estilo EKG (`waveform path`) animada continuamente.

### F. Instrumento Operacional Completo (Cidadão + Agente + Poste Inteligente IoT + Footer)
- **Seletor de Operação em 3 Colunas/Abas** (com o card central em destaque `Moss` `#2E4036` e botão `Clay` `#CC5833`):
  1. **Modo Cidadão**: Abertura de ocorrências (Foto via Câmera/Galeria/Presets, Categoria, Localização GPS, Descrição) e acompanhamento em tempo real da fila e da linha do tempo de status.
  2. **Laboratório IoT — Poste Inteligente (`#PZ-042`)**: Destaque central em `Moss` com simulação em tempo real do sensor de luz (`ambientLux`) e da luminária LED. Quando `ambientLux < 25 lx` (escuro) e a lâmpada está apagada/queimada, dispara automaticamente uma ocorrência de manutenção no `AsyncStorage`.
  3. **Modo Agente Público**: Fila técnica priorizando alertas IoT, filtros por status (`Aberta`, `Em análise`, `Em andamento`, `Resolvida`), progressão em 1 clique e registro de parecer técnico.
- **Footer**: `Charcoal` profundo (`#1A1A1A`), `rounded-t-[4rem]`, links de utilidade e indicador `"System Operational"` com ponto verde pulsante.
