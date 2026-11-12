import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { OccurrenceCard } from '../components/OccurrenceCard';
import { OccurrenceDetailModal } from '../components/OccurrenceDetailModal';
import {
  CATEGORIES,
  PRESET_LOCATIONS,
  STATUS_META,
} from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useIoT } from '../contexts/IoTContext';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII } from '../theme/theme';
import { Occurrence, OccurrenceCategory } from '../types';

interface CitizenHomeScreenProps {
  onNavigateNewOccurrence: () => void;
  onNavigateIoTSimulator: () => void;
}

type FilterType = 'ALL' | 'OPEN' | 'IOT' | 'RESOLVED';

const CATEGORY_LIST = Object.values(CATEGORIES);

const QUICK_TEMPLATES: Record<
  OccurrenceCategory,
  { title: string; description: string }
> = {
  BURACO_VIA: {
    title: 'Afundamento asfáltico na faixa de rolamento',
    description:
      'Cratera aberta após chuva intensa, oferecendo risco a veículos e ciclistas que trafegam pela via.',
  },
  ILUMINACAO: {
    title: 'Luminária pública apagada durante toda a noite',
    description:
      'Poste não acende ao anoitecer, deixando a calçada e a travessia de pedestres completamente no escuro.',
  },
  ACUMULO_LIXO: {
    title: 'Descarte irregular de entulho e sacos na calçada',
    description:
      'Acúmulo de resíduos sólidos obstruindo a passagem de pedestres próximo à esquina.',
  },
  ARVORE_PODA: {
    title: 'Galhos baixos sobre fiação e iluminação pública',
    description:
      'Necessidade de poda técnica preventiva para liberar a projeção luminosa do poste e a calçada.',
  },
  DRENAGEM: {
    title: 'Boca de lobo obstruída causando retenção de água',
    description:
      'Grelha pluvial bloqueada por folhas e sedimentos, acumulando água junto ao meio-fio.',
  },
};

// Pin positions (%) on the schematic neighborhood map
const MAP_PIN_COORDS: Record<string, { top: string; left: string }> = {
  'Rua das Figueiras': { top: '28%', left: '24%' },
  'Av. das Araucárias': { top: '52%', left: '54%' },
  'Travessa Ipê Amarelo': { top: '34%', left: '74%' },
  'Alameda dos Jatobás': { top: '74%', left: '32%' },
};

export const CitizenHomeScreen: React.FC<CitizenHomeScreenProps> = ({
  onNavigateIoTSimulator,
}) => {
  const { user } = useAuth();
  const { occurrences, addCitizenOccurrence, updateOccurrenceStatus } =
    useOccurrences();
  const { pole, isAnomalyActive, triggerNightFailureSimulation } = useIoT();

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    string | null
  >(null);

  // Integrated Quick Report Form State
  const [selectedCategory, setSelectedCategory] =
    useState<OccurrenceCategory>('BURACO_VIA');
  const [title, setTitle] = useState(QUICK_TEMPLATES.BURACO_VIA.title);
  const [description, setDescription] = useState(
    QUICK_TEMPLATES.BURACO_VIA.description
  );
  const [selectedLocIdx, setSelectedLocIdx] = useState(0);
  const [address, setAddress] = useState(PRESET_LOCATIONS[0].address);
  const [reference, setReference] = useState(PRESET_LOCATIONS[0].reference);
  const [coordinates, setCoordinates] = useState(
    PRESET_LOCATIONS[0].coordinates
  );
  const [photoUri, setPhotoUri] = useState(
    CATEGORIES.BURACO_VIA.defaultPhotoUri
  );
  const [justSubmittedProtocol, setJustSubmittedProtocol] = useState<
    string | null
  >(null);

  const filteredOccurrences = useMemo(() => {
    switch (activeFilter) {
      case 'OPEN':
        return occurrences.filter((o) => o.status !== 'RESOLVIDA');
      case 'IOT':
        return occurrences.filter((o) => o.origin === 'IOT_AUTO');
      case 'RESOLVED':
        return occurrences.filter((o) => o.status === 'RESOLVIDA');
      default:
        return occurrences;
    }
  }, [occurrences, activeFilter]);

  const selectedOccurrence: Occurrence | null = useMemo(
    () => occurrences.find((o) => o.id === selectedOccurrenceId) || null,
    [occurrences, selectedOccurrenceId]
  );

  const stats = useMemo(() => {
    return {
      total: occurrences.length,
      open: occurrences.filter((o) => o.status === 'ABERTA').length,
      inProgress: occurrences.filter(
        (o) => o.status === 'EM_ANALISE' || o.status === 'EM_ANDAMENTO'
      ).length,
      resolved: occurrences.filter((o) => o.status === 'RESOLVIDA').length,
    };
  }, [occurrences]);

  const handleSelectCategory = (cat: OccurrenceCategory) => {
    setSelectedCategory(cat);
    setPhotoUri(CATEGORIES[cat].defaultPhotoUri);
    setTitle(QUICK_TEMPLATES[cat].title);
    setDescription(QUICK_TEMPLATES[cat].description);
  };

  const handleSelectLocation = (idx: number) => {
    setSelectedLocIdx(idx);
    setAddress(PRESET_LOCATIONS[idx].address);
    setReference(PRESET_LOCATIONS[idx].reference);
    setCoordinates(PRESET_LOCATIONS[idx].coordinates);
  };

  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });
      if (!res.canceled && res.assets[0]?.uri) {
        setPhotoUri(res.assets[0].uri);
      }
    } catch {
      Alert.alert('Modo Simulador', 'Mantendo foto técnica da categoria.');
    }
  };

  const handleCreateReport = async () => {
    if (!title.trim() || !address.trim()) return;
    const created = await addCitizenOccurrence({
      title,
      description,
      category: selectedCategory,
      address,
      reference,
      coordinates,
      photoUri,
    });
    setJustSubmittedProtocol(created.protocol);
    setTimeout(() => setJustSubmittedProtocol(null), 5000);
  };

  const getPinPosition = (addr: string, index: number) => {
    for (const key of Object.keys(MAP_PIN_COORDS)) {
      if (addr.includes(key)) {
        return MAP_PIN_COORDS[key];
      }
    }
    return {
      top: `${25 + ((index * 19) % 55)}%`,
      left: `${20 + ((index * 23) % 65)}%`,
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Citizen Identity & Neighborhood Metrics Strip */}
        <View style={styles.topCitizenBar}>
          <View style={styles.citizenProfileBlock}>
            <View style={styles.citizenTagRow}>
              <Text style={styles.citizenKickerMono}>
                TERMINAL DO MORADOR // CREDENCIAL ATIVA
              </Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>CADASTRO VERIFICADO</Text>
              </View>
            </View>
            <Text style={styles.citizenTitle}>
              {user?.name || 'Clara Vasconcelos'}{' '}
              <Text style={styles.citizenNeighborhoodItalic}>
                — {user?.neighborhood || 'Jardim Botânico • Setor Norte'}
              </Text>
            </Text>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiCell}>
              <Text style={styles.kpiLabelMono}>PROTOCOLOS</Text>
              <Text style={styles.kpiValMono}>{stats.total}</Text>
            </View>
            <View style={styles.kpiCell}>
              <Text style={styles.kpiLabelMono}>AGUARDANDO</Text>
              <Text style={[styles.kpiValMono, { color: COLORS.clay }]}>
                {stats.open}
              </Text>
            </View>
            <View style={styles.kpiCell}>
              <Text style={styles.kpiLabelMono}>EM EXECUÇÃO</Text>
              <Text
                style={[styles.kpiValMono, { color: COLORS.statusProgress }]}
              >
                {stats.inProgress}
              </Text>
            </View>
            <View style={styles.kpiCell}>
              <Text style={styles.kpiLabelMono}>CONCLUÍDOS</Text>
              <Text
                style={[styles.kpiValMono, { color: COLORS.statusResolved }]}
              >
                {stats.resolved}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Two-Column Architectural Layout */}
        <View style={styles.mainSplitGrid}>
          {/* =============================================================== */}
          {/* LEFT COLUMN: SECTOR MAP + CITIZEN OCCURRENCE TRACKING           */}
          {/* =============================================================== */}
          <View style={styles.leftMainCol}>
            {/* Interactive Neighborhood GIS/CAD Sector Map */}
            <View style={styles.mapPanel}>
              <View style={styles.mapPanelHeader}>
                <View>
                  <Text style={styles.panelKickerMono}>
                    PLANTA SETORIAL GEORREFERENCIADA // SETOR NORTE
                  </Text>
                  <Text style={styles.panelTitle}>
                    Mapa de Ocorrências & Iluminação Inteligente
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.iotMapShortcut}
                  onPress={onNavigateIoTSimulator}
                >
                  <View
                    style={[
                      styles.iotSmallLed,
                      {
                        backgroundColor: isAnomalyActive
                          ? COLORS.clay
                          : COLORS.telemetryGreen,
                      },
                    ]}
                  />
                  <Text style={styles.iotMapShortcutText}>
                    POSTE #{pole.poleId}: {pole.ambientLux} LX
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Schematic Map Canvas */}
              <View style={styles.mapCanvas}>
                {/* Grid & Street Lines */}
                <View style={[styles.streetHorizontal, { top: '30%' }]}>
                  <Text style={styles.streetNameMono}>RUA DAS FIGUEIRAS</Text>
                </View>
                <View style={[styles.streetHorizontal, { top: '54%' }]}>
                  <Text style={styles.streetNameMono}>
                    AV. DAS ARAUCÁRIAS (EIXO CENTRAL)
                  </Text>
                </View>
                <View style={[styles.streetHorizontal, { top: '78%' }]}>
                  <Text style={styles.streetNameMono}>ALAMEDA DOS JATOBÁS</Text>
                </View>
                <View style={[styles.streetVertical, { left: '32%' }]} />
                <View style={[styles.streetVertical, { left: '72%' }]}>
                  <Text style={styles.streetNameVertMono}>
                    TRAV. IPÊ AMARELO
                  </Text>
                </View>

                {/* Smart Streetlight Node Pin (#PZ-042) */}
                <TouchableOpacity
                  style={[
                    styles.smartPoleMapNode,
                    { top: '46%', left: '52%' },
                    isAnomalyActive && styles.smartPoleMapNodeFault,
                  ]}
                  onPress={onNavigateIoTSimulator}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={isAnomalyActive ? 'warning' : 'bulb'}
                    size={13}
                    color={COLORS.cream}
                  />
                  <Text style={styles.smartPoleNodeText}>
                    IoT #{pole.poleId} ({pole.ambientLux} lx)
                  </Text>
                </TouchableOpacity>

                {/* Occurrence Pins on the Map */}
                {occurrences.slice(0, 6).map((occ, idx) => {
                  const pos = getPinPosition(occ.location.address, idx);
                  const stMeta = STATUS_META[occ.status];
                  return (
                    <TouchableOpacity
                      key={occ.id}
                      style={[
                        styles.mapOccurrencePin,
                        {
                          top: pos.top as any,
                          left: pos.left as any,
                          borderColor: stMeta.color,
                        },
                      ]}
                      onPress={() => setSelectedOccurrenceId(occ.id)}
                    >
                      <View
                        style={[
                          styles.mapPinDot,
                          { backgroundColor: stMeta.color },
                        ]}
                      />
                      <Text style={styles.mapPinLabel}>
                        {occ.protocol.split('-').pop()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Map Legend & Quick IoT Test Bar */}
              <View style={styles.mapFooterBar}>
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendBox,
                        { backgroundColor: COLORS.statusOpen },
                      ]}
                    />
                    <Text style={styles.legendText}>Aberta</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendBox,
                        { backgroundColor: COLORS.statusAnalysis },
                      ]}
                    />
                    <Text style={styles.legendText}>Em análise</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendBox,
                        { backgroundColor: COLORS.statusProgress },
                      ]}
                    />
                    <Text style={styles.legendText}>Em andamento</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendBox,
                        { backgroundColor: COLORS.statusResolved },
                      ]}
                    />
                    <Text style={styles.legendText}>Resolvida</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.mapTestIoTBtn}
                  onPress={triggerNightFailureSimulation}
                >
                  <Ionicons name="flash" size={12} color={COLORS.clay} />
                  <Text style={styles.mapTestIoTText}>
                    Testar Disparo Automático do Poste #{pole.poleId}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Occurrences List Header & Filters */}
            <View style={styles.listHeaderBlock}>
              <View style={styles.listTitleRow}>
                <Text style={styles.listSectionTitle}>
                  ACOMPANHAMENTO DE CHAMADOS DO BAIRRO
                </Text>
                <Text style={styles.listCountMono}>
                  EXIBINDO {filteredOccurrences.length} DE {occurrences.length}
                </Text>
              </View>

              <View style={styles.filterTabsRow}>
                {[
                  { id: 'ALL', label: 'TODOS' },
                  { id: 'OPEN', label: 'EM ABERTO / EXECUÇÃO' },
                  { id: 'IOT', label: 'DISPAROS IoT AUTÔNOMOS' },
                  { id: 'RESOLVED', label: 'RESOLVIDOS' },
                ].map((tab) => {
                  const active = activeFilter === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      style={[
                        styles.filterTabBtn,
                        active && styles.filterTabBtnActive,
                      ]}
                      onPress={() => setActiveFilter(tab.id as FilterType)}
                    >
                      <Text
                        style={[
                          styles.filterTabText,
                          active && styles.filterTabTextActive,
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Occurrences Cards */}
            {filteredOccurrences.map((occ) => (
              <OccurrenceCard
                key={occ.id}
                occurrence={occ}
                isAgentView={false}
                onPressDetail={(o) => setSelectedOccurrenceId(o.id)}
              />
            ))}
          </View>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: REAL CITIZEN REPORT FORM ("ABRIR OCORRÊNCIA")     */}
          {/* =============================================================== */}
          <View style={styles.rightFormCol}>
            <View style={styles.reportFormPanel}>
              <View style={styles.formHeaderStrip}>
                <Text style={styles.formKickerMono}>
                  FORMULÁRIO OFICIAL // CANAL DO CIDADÃO
                </Text>
                <Text style={styles.formTitle}>Registrar Nova Ocorrência</Text>
                <Text style={styles.formSub}>
                  Preencha os dados abaixo para protocolar um problema na rua e
                  enviar diretamente à fila técnica do Agente.
                </Text>
              </View>

              {justSubmittedProtocol && (
                <View style={styles.successBanner}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.cream}
                  />
                  <Text style={styles.successBannerText}>
                    Protocolo #{justSubmittedProtocol} registrado com sucesso no
                    AsyncStorage!
                  </Text>
                </View>
              )}

              {/* 1. Category Selection */}
              <Text style={styles.fieldLabelMono}>
                01. CATEGORIA DO PROBLEMA
              </Text>
              <View style={styles.catSelectorList}>
                {CATEGORY_LIST.map((cat) => {
                  const selected = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catOptionRow,
                        selected && styles.catOptionRowActive,
                      ]}
                      onPress={() => handleSelectCategory(cat.id)}
                    >
                      <View style={styles.catOptionLeft}>
                        <Ionicons
                          name={cat.iconName as any}
                          size={15}
                          color={selected ? COLORS.cream : COLORS.moss}
                        />
                        <Text
                          style={[
                            styles.catOptionLabel,
                            selected && { color: COLORS.cream },
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.catOptionCode,
                          selected && { color: COLORS.clayLight },
                        ]}
                      >
                        {cat.code}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 2. Street / Location */}
              <Text style={styles.fieldLabelMono}>
                02. LOCALIZAÇÃO & ENDEREÇO
              </Text>
              <View style={styles.locButtonsWrap}>
                {PRESET_LOCATIONS.map((loc, idx) => {
                  const active = selectedLocIdx === idx;
                  return (
                    <TouchableOpacity
                      key={loc.address}
                      style={[
                        styles.locQuickBtn,
                        active && styles.locQuickBtnActive,
                      ]}
                      onPress={() => handleSelectLocation(idx)}
                    >
                      <Text
                        style={[
                          styles.locQuickBtnText,
                          active && { color: COLORS.cream },
                        ]}
                      >
                        {loc.address.split('—')[0].trim()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={styles.sharpInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Logradouro e número"
                placeholderTextColor={COLORS.charcoalMuted}
              />
              <TextInput
                style={[styles.sharpInput, { marginTop: 8 }]}
                value={reference}
                onChangeText={setReference}
                placeholder="Referência visual (ex: em frente ao nº 240)"
                placeholderTextColor={COLORS.charcoalMuted}
              />
              <View style={styles.gpsReadoutBar}>
                <Text style={styles.gpsReadoutText}>
                  COORDENADAS GPS CAPTURADAS: {coordinates}
                </Text>
              </View>

              {/* 3. Photo Evidence */}
              <Text style={styles.fieldLabelMono}>
                03. EVIDÊNCIA FOTOGRÁFICA DO LOCAL
              </Text>
              <View style={styles.photoBox}>
                <Image source={{ uri: photoUri }} style={styles.photoThumb} />
                <View style={styles.photoControlsCol}>
                  <TouchableOpacity
                    style={styles.photoSmallBtn}
                    onPress={handlePickImage}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={14}
                      color={COLORS.charcoal}
                    />
                    <Text style={styles.photoSmallBtnText}>
                      Anexar Foto / Câmera
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photoSmallBtn}
                    onPress={() =>
                      setPhotoUri(CATEGORIES[selectedCategory].defaultPhotoUri)
                    }
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={14}
                      color={COLORS.moss}
                    />
                    <Text style={styles.photoSmallBtnText}>
                      Usar Foto Padrão
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 4. Description */}
              <Text style={styles.fieldLabelMono}>
                04. TÍTULO & OBSERVAÇÕES DO MORADOR
              </Text>
              <TextInput
                style={styles.sharpInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Resumo do problema"
                placeholderTextColor={COLORS.charcoalMuted}
              />
              <TextInput
                style={[styles.sharpInput, styles.sharpTextarea]}
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="Detalhes adicionais..."
                placeholderTextColor={COLORS.charcoalMuted}
              />

              <TouchableOpacity
                style={styles.submitProtocolBtn}
                onPress={handleCreateReport}
                activeOpacity={0.86}
              >
                <Text style={styles.submitProtocolBtnText}>
                  PROTOCOLAR OCORRÊNCIA URBANA
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={COLORS.cream}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <OccurrenceDetailModal
        occurrence={selectedOccurrence}
        visible={!!selectedOccurrence}
        isAgent={false}
        onClose={() => setSelectedOccurrenceId(null)}
        onUpdateStatus={updateOccurrenceStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 1380,
    alignSelf: 'center',
    padding: 18,
    paddingBottom: 64,
  },
  topCitizenBar: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  citizenProfileBlock: {
    flex: 1,
    minWidth: 280,
  },
  citizenTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  citizenKickerMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
    letterSpacing: 0.7,
  },
  verifiedBadge: {
    backgroundColor: COLORS.mossMuted,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADII.sm,
  },
  verifiedBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.moss,
  },
  citizenTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.4,
  },
  citizenNeighborhoodItalic: {
    fontFamily: FONTS.serifItalic,
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 22,
    color: COLORS.moss,
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    backgroundColor: COLORS.creamBorder,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
  },
  kpiCell: {
    backgroundColor: COLORS.cream,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 95,
  },
  kpiLabelMono: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.charcoalMuted,
    marginBottom: 2,
  },
  kpiValMono: {
    fontFamily: FONTS.mono,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  mainSplitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 18,
  },
  leftMainCol: {
    flex: 1.45,
    minWidth: 340,
  },
  rightFormCol: {
    flex: 1,
    minWidth: 320,
  },
  mapPanel: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    overflow: 'hidden',
    marginBottom: 18,
  },
  mapPanelHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamBorder,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  panelKickerMono: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.clay,
    letterSpacing: 0.6,
  },
  panelTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.charcoal,
  },
  iotMapShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADII.sm,
    gap: 6,
  },
  iotSmallLed: {
    width: 7,
    height: 7,
    borderRadius: 1,
  },
  iotMapShortcutText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  mapCanvas: {
    height: 220,
    backgroundColor: '#16201B',
    position: 'relative',
    overflow: 'hidden',
  },
  streetHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: 'rgba(242, 240, 233, 0.07)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.12)',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  streetVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 18,
    backgroundColor: 'rgba(242, 240, 233, 0.06)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.12)',
  },
  streetNameMono: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: 'rgba(242, 240, 233, 0.42)',
    letterSpacing: 1,
  },
  streetNameVertMono: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: 'rgba(242, 240, 233, 0.35)',
    marginTop: 8,
    marginLeft: 2,
  },
  smartPoleMapNode: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.moss,
    borderWidth: 1.5,
    borderColor: COLORS.telemetryGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADII.sm,
    gap: 5,
    zIndex: 10,
  },
  smartPoleMapNodeFault: {
    backgroundColor: COLORS.clay,
    borderColor: '#FFE4DC',
  },
  smartPoleNodeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.cream,
  },
  mapOccurrencePin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.charcoal,
    borderWidth: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADII.sm,
    gap: 4,
    zIndex: 5,
  },
  mapPinDot: {
    width: 6,
    height: 6,
    borderRadius: 1,
  },
  mapPinLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.cream,
  },
  mapFooterBar: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.cream,
    borderTopWidth: 1,
    borderTopColor: COLORS.creamBorder,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendBox: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  legendText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
  },
  mapTestIoTBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mapTestIoTText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.clay,
    textDecorationLine: 'underline',
  },
  listHeaderBlock: {
    marginBottom: 12,
  },
  listTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listSectionTitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.charcoal,
    letterSpacing: 0.5,
  },
  listCountMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
  },
  filterTabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterTabBtn: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADII.sm,
  },
  filterTabBtnActive: {
    backgroundColor: COLORS.charcoal,
    borderColor: COLORS.charcoal,
  },
  filterTabText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.charcoalMuted,
  },
  filterTabTextActive: {
    color: COLORS.cream,
  },
  reportFormPanel: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    padding: 18,
  },
  formHeaderStrip: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamBorder,
    paddingBottom: 12,
    marginBottom: 14,
  },
  formKickerMono: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.clay,
    letterSpacing: 0.7,
  },
  formTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.charcoal,
    marginTop: 2,
  },
  formSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoalMuted,
    marginTop: 4,
    lineHeight: 17,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.statusResolved,
    padding: 10,
    borderRadius: RADII.sm,
    marginBottom: 12,
    gap: 8,
  },
  successBannerText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
    flex: 1,
  },
  fieldLabelMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  catSelectorList: {
    gap: 5,
    marginBottom: 6,
  },
  catOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: RADII.sm,
  },
  catOptionRowActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  catOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  catOptionLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  catOptionCode: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.charcoalMuted,
  },
  locButtonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 8,
  },
  locQuickBtn: {
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADII.sm,
  },
  locQuickBtnActive: {
    backgroundColor: COLORS.charcoal,
    borderColor: COLORS.charcoal,
  },
  locQuickBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  sharpInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
    paddingHorizontal: 11,
    paddingVertical: 9,
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoal,
  },
  sharpTextarea: {
    minHeight: 68,
    marginTop: 8,
    textAlignVertical: 'top',
  },
  gpsReadoutBar: {
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADII.sm,
    marginTop: 6,
  },
  gpsReadoutText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.telemetryGreen,
    fontWeight: '700',
  },
  photoBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
  },
  photoThumb: {
    width: 92,
    height: 64,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.creamSubtle,
  },
  photoControlsCol: {
    flex: 1,
    gap: 6,
  },
  photoSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: RADII.sm,
    gap: 6,
  },
  photoSmallBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  submitProtocolBtn: {
    marginTop: 14,
    backgroundColor: COLORS.clay,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: RADII.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submitProtocolBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.6,
  },
});
