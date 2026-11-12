# Zeladoria Urbana & Iluminação Inteligente IoT

Aplicativo multiplataforma (**React Native + Expo + TypeScript**) desenvolvido para conectar moradores do bairro e equipes públicas de manutenção urbana, integrando um módulo de **simulação IoT de Poste Inteligente** capaz de abrir ocorrências de manutenção de iluminação de forma totalmente autônoma.

---

## Integrantes do Grupo

| Nome Completo | RM |
| :--- | :--- |
| **Augusto Rocha Silva** | RM556316 |
| **Guilherme Vieira Augusto** | RM557264 |
| **Erik Yuuta Goto** | RM558076 |
| **Wendell dos Santos Silva** | RM558859 |

---

## 1. Contexto e Problema Central

Os moradores de um bairro frequentemente não possuem um canal simples, transparente e georreferenciado para reportar problemas de conservação no espaço público — como **buracos na via, acúmulo de lixo/entulho, necessidade de poda de árvores, bueiros obstruídos ou postes apagados** — e tampouco conseguem acompanhar se o chamado foi analisado ou resolvido pela prefeitura.

### A Solução
Um sistema integrado com duas visões operacionais principais (**Cidadão** e **Agente Público**) somadas a um **Laboratório de Telemetria IoT**:

1. **Visão do Cidadão (`Clara Vasconcelos • Moradora`)**:
   - Visualização da **Planta Setorial Georreferenciada** do bairro com os pinos de cada ocorrência ativa e o status em tempo real do Poste Inteligente.
   - Abertura rápida de ocorrências contendo **Categoria**, **Foto** (via câmera/galeria com `expo-image-picker` ou banco visual de simulação), **Endereço + Coordenadas GPS** e **Descrição**.
   - Acompanhamento transparente do andamento em 4 estágios (`01 Aberta` → `02 Em análise` → `03 Em andamento` → `04 Resolvida`) e leitura dos pareceres técnicos emitidos pelo Agente.

2. **Mesa Operacional do Agente (`Eng. Marcos Silveira • Regional 04`)**:
   - Console de engenharia em **Split-View (Mestre-Detalhe)** com matriz de SLA e filtros por status ou origem (`IoT Autônomo` vs `Morador`).
   - Destaque prioritário para falhas críticas geradas automaticamente pelos sensores urbanos.
   - Atualização de status em 1 clique (**Aberta**, **Em análise**, **Em andamento**, **Resolvida**) e registro de parecer técnico auditável no histórico do protocolo.

3. **Integração IoT — Simulador do Poste Inteligente (`Nó #PZ-042`)**:
   - Simula um poste de iluminação pública equipado com sensor fotocélula de luminosidade ambiente (`lux`) e medidor de potência/corrente do driver LED (`Watts` / `Volts`).
   - **Regra de Negócio Determinística**: Quando o sensor detecta que **está escuro (`ambientLux < 25 lx`)** e a **luminária está apagada/queimada (`!isLampHardwareOk` / `0.4W`)**, o próprio sistema gera e persiste automaticamente uma ocorrência de manutenção de iluminação (`origem: 'IOT_AUTO'`) no `AsyncStorage`, enviando-a imediatamente para a fila do Agente.

---

## 2. Arquitetura Técnica e Escopo da Entrega

Toda a persistência de dados, troca de perfis e geração automática de alertas IoT são simuladas localmente utilizando **`AsyncStorage`**, **dados mockados**, **navegação estruturada** e **`Context API`**, organizados em camadas:

```text
ZELADORIA/
├── App.tsx                                # Entrypoint com Providers (Auth, Occurrences, IoT) e ErrorBoundary
├── index.ts                               # Registro raiz do Expo + Polyfills ES2022+
├── directives/
│   └── zeladoria_arquitetura.md           # Documentação SOP da arquitetura e regras de negócio
├── execution/
│   └── verify_project.mjs                 # Script determinístico de validação arquitetural
└── src/
    ├── types/
    │   └── index.ts                       # Contratos TypeScript (Occurrence, SmartPoleState, UserProfile)
    ├── theme/
    │   └── theme.ts                       # Tokens do Design System (#2E4036, #CC5833, #F2F0E9, #1A1A1A)
    ├── data/
    │   └── mockData.ts                    # Dados iniciais de ocorrências, categorias, usuários e Poste #PZ-042
    ├── storage/
    │   └── storageService.ts              # Camada de persistência local (@react-native-async-storage/async-storage)
    ├── services/
    │   ├── occurrenceService.ts           # Regras de criação de chamados, protocolos e histórico de status
    │   └── iotPoleService.ts              # Motor determinístico de avaliação óptica/elétrica do Poste IoT
    ├── contexts/
    │   ├── AuthContext.tsx                # Sessão e alternância rápida entre Cidadão e Agente
    │   ├── OccurrencesContext.tsx         # Estado global e sincronização das ocorrências com AsyncStorage
    │   └── IoTContext.tsx                 # Telemetria ao vivo do Poste #PZ-042 e disparo autônomo de chamados
    ├── components/
    │   ├── FloatingIslandNavbar.tsx       # Barra de comando superior com telemetria e troca de visão
    │   ├── OccurrenceCard.tsx             # Card técnico de ocorrência com pipeline de 4 etapas
    │   ├── OccurrenceDetailModal.tsx      # Prontuário detalhado e linha do tempo de auditoria
    │   ├── PrecisionMicroUIDashboard.tsx  # Artefatos de telemetria (Shuffler, Typewriter, Scheduler)
    │   ├── ManifestoAndProtocolSection.tsx# Seção conceitual e pilha de protocolos do sistema
    │   ├── OperationalTriadAndFooter.tsx  # Matriz de acesso aos terminais e rodapé de status
    │   └── GlobalStylesAndNoise.tsx       # Fontes tipográficas e textura visual
    ├── screens/
    │   ├── CitizenHomeScreen.tsx          # Visão final do Cidadão (Mapa Setorial + Lista + Formulário)
    │   ├── NewOccurrenceScreen.tsx        # Tela dedicada para abertura passo a passo de chamado
    │   ├── AgentDashboardScreen.tsx       # Mesa de Despacho do Agente (Split-View Fila + Prontuário)
    │   ├── IoTSimulatorScreen.tsx         # Laboratório interativo do Poste Inteligente #PZ-042
    │   └── LoginScreen.tsx                # Apresentação arquitetural e acesso aos módulos
    └── navigation/
        └── AppNavigator.tsx               # Roteamento entre os ambientes operacionais
```

---

## 3. Tecnologias Utilizadas

- **React Native (`0.76`) & Expo (`SDK 52`)** — Suporte para Android, iOS (Expo Go) e Web (`react-native-web`).
- **TypeScript (`5.3`)** — Tipagem estática em todas as camadas de domínio, serviços e componentes.
- **Context API (`React.createContext`)** — Gerenciamento de estado distribuído em 3 contextos (`AuthContext`, `OccurrencesContext`, `IoTContext`).
- **AsyncStorage (`@react-native-async-storage/async-storage`)** — Persistência local de chamados, sessão de usuário e estado do sensor IoT.
- **Expo Image Picker (`expo-image-picker`)** — Captura de fotos via câmera ou galeria no fluxo de abertura de ocorrências.

---

## 4. Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/augustorocha27/ZeladoriaDoBairro.git
cd ZeladoriaDoBairro

# 2. Instalar as dependências
npm install

# 3. Executar no navegador Web
npm run web

# Ou iniciar o servidor para abrir no aplicativo Expo Go (Android / iOS)
npm start
```

### Validação de Tipagem e Arquitetura
```bash
npm run typecheck
node execution/verify_project.mjs
```

---

## 5. Roteiro de Demonstração (Avaliação)

1. **Abertura de Chamado pelo Cidadão (`01 VISÃO DO CIDADÃO`)**:
   - No painel direito (*Registrar Nova Ocorrência*), escolha uma categoria (ex.: `Buraco na Via` ou `Acúmulo de Lixo`), selecione ou digite o endereço, anexe uma foto e clique em **Protocolar Ocorrência Urbana**.
   - O novo protocolo aparece imediatamente na lista e na Planta Setorial do bairro, já salvo no `AsyncStorage`.
2. **Disparo Automático do Poste Inteligente (`03 POSTE INTELIGENTE IoT` ou Barra Superior)**:
   - Clique no botão **Simular Queda de Luz IoT** na barra superior (ou acesse a aba `03 POSTE INTELIGENTE IoT` e ajuste a luminosidade para `< 25 lx` com a lâmpada em estado `Poste Apagado / Queimado`).
   - O sistema detectará a anomalia (Escuro + Lâmpada Apagada) e abrirá automaticamente uma ocorrência `#IOT-2026-XXXX` sem intervenção humana.
3. **Atendimento e Resolução pelo Agente (`02 MESA DO AGENTE`)**:
   - Alterne para a aba **02 MESA DO AGENTE**.
   - Selecione a ocorrência na fila à esquerda e utilize o painel de despacho à direita para avançar o status entre **Aberta → Em análise → Em andamento → Resolvida**, registrando o parecer técnico da engenharia.
   - Ao marcar uma ocorrência IoT como **Resolvida**, o circuito do Poste Inteligente `#PZ-042` é automaticamente restabelecido.
