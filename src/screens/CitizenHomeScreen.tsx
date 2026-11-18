import React, { useMemo, useState } from 'react';
import {
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
import { CATEGORIES, PRESET_LOCATIONS } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';
import { useResponsive } from '../theme/useResponsive';
import { Occurrence, OccurrenceCategory } from '../types';

interface CitizenHomeScreenProps {
  onNavigateNewOccurrence: () => void;
}

type FilterType = 'ALL' | 'OPEN' | 'RESOLVED';

const CATEGORY_LIST = Object.values(CATEGORIES);

const QUICK_TEMPLATES: Record<
  OccurrenceCategory,
  { title: string; description: string }
> = {
  ILUMINACAO: {
    title: 'Poste apagado deixando a rua escura à noite',
    description:
      'A lâmpada do poste não está acendendo quando escurece, deixando a calçada sem iluminação.',
  },
  BURACO_VIA: {
    title: 'Buraco grande no asfalto atrapalhando carros e motos',
    description:
      'Asfalto cedeu na pista e abriu um buraco fundo que obriga os motoristas a desviarem.',
  },
  ACUMULO_LIXO: {
    title: 'Acúmulo de lixo e entulho descartado na calçada',
    description:
      'Sacos de lixo e restos de entulho bloqueando a passagem dos moradores na calçada.',
  },
  ARVORE_PODA: {
    title: 'Galhos de árvore baixos precisando de poda',
    description:
      'Galhos grandes estão encostando nos fios e cobrindo a luz do poste da rua.',
  },
  DRENAGEM: {
    title: 'Bueiro entupido acumulando água na esquina',
    description:
      'A grade do bueiro está tampada com folhas e terra, formando alagamento quando chove.',
  },
};

export const CitizenHomeScreen: React.FC<CitizenHomeScreenProps> = () => {
  const { user } = useAuth();
  const { occurrences, addCitizenOccurrence, updateOccurrenceStatus } =
    useOccurrences();
  const { isMobile, isSmallPhone, pagePadding } = useResponsive();

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    string | null
  >(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedOccurrence, setLastCreatedOccurrence] =
    useState<Occurrence | null>(null);

  const filteredOccurrences = useMemo(() => {
    switch (activeFilter) {
      case 'OPEN':
        return occurrences.filter((o) => o.status !== 'RESOLVIDA');
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

  const counts = useMemo(() => {
    const resolved = occurrences.filter((o) => o.status === 'RESOLVIDA').length;
    return {
      all: occurrences.length,
      open: occurrences.length - resolved,
      resolved,
    };
  }, [occurrences]);

  const handleOpenCategoryQuickReport = (cat: OccurrenceCategory) => {
    setSelectedCategory(cat);
    setPhotoUri(CATEGORIES[cat].defaultPhotoUri);
    setTitle(QUICK_TEMPLATES[cat].title);
    setDescription(QUICK_TEMPLATES[cat].description);
    setIsFormOpen(true);
    setLastCreatedOccurrence(null);
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
        quality: 0.7,
      });
      if (!res.canceled && res.assets[0]?.uri) {
        setPhotoUri(res.assets[0].uri);
      }
    } catch {
      setPhotoUri(CATEGORIES[selectedCategory].defaultPhotoUri);
    }
  };

  const handleSubmitOccurrence = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalTitle =
        title.trim() || QUICK_TEMPLATES[selectedCategory].title;
      const finalDescription =
        description.trim() || QUICK_TEMPLATES[selectedCategory].description;
      const finalAddress =
        address.trim() || PRESET_LOCATIONS[selectedLocIdx].address;
      const finalReference =
        reference.trim() || PRESET_LOCATIONS[selectedLocIdx].reference;

      const created = await addCitizenOccurrence({
        title: finalTitle,
        description: finalDescription,
        category: selectedCategory,
        address: finalAddress,
        reference: finalReference,
        coordinates,
        photoUri,
      });

      setActiveFilter('ALL');
      setIsFormOpen(false);
      setLastCreatedOccurrence(created);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: pagePadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centerColumn}>
          {/* 1. Welcome & Primary Action Card */}
          <View
            style={[
              styles.welcomeCard,
              isSmallPhone && { padding: 14 },
            ]}
          >
            <View
              style={[
                styles.welcomeTopRow,
                isMobile && styles.welcomeTopRowMobile,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.welcomeGreeting,
                    isSmallPhone && { fontSize: 19 },
                  ]}
                >
                  Olá, {user?.name || 'Morador'}
                </Text>
                <Text style={styles.welcomeNeighborhood}>
                  {user?.neighborhood || 'Jardim Botânico • Setor Norte'}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.mainActionBtn,
                  isMobile && { width: '100%', justifyContent: 'center' },
                  isFormOpen && styles.mainActionBtnCancel,
                ]}
                onPress={() => setIsFormOpen((prev) => !prev)}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={isFormOpen ? 'chevron-up' : 'add-circle-outline'}
                  size={18}
                  color={COLORS.cream}
                />
                <Text style={styles.mainActionBtnText}>
                  {isFormOpen ? 'Ocultar Formulário' : '+ Novo Chamado'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.quickPromptTitle}>
              Qual problema você encontrou no bairro hoje? Escolha o tipo:
            </Text>

            {/* 5 Quick Category Shortcuts */}
            <View style={styles.quickCategoriesRow}>
              {CATEGORY_LIST.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.quickCatBtn,
                      isMobile
                        ? { width: isSmallPhone ? '100%' : '48%', flexGrow: 1 }
                        : { flex: 1, minWidth: 135 },
                      isSelected && styles.quickCatBtnActive,
                    ]}
                    onPress={() => handleOpenCategoryQuickReport(cat.id)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={cat.iconName as any}
                      size={20}
                      color={isSelected ? COLORS.cream : COLORS.moss}
                    />
                    <Text
                      style={[
                        styles.quickCatLabel,
                        isSelected && { color: COLORS.cream },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.shortLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Success Toast Feedback when a new occurrence is created */}
          {lastCreatedOccurrence && (
            <View style={styles.successBanner}>
              <View style={styles.successBannerLeft}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={COLORS.cream}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.successBannerTitle}>
                    Chamado #{lastCreatedOccurrence.protocol} registrado com
                    sucesso!
                  </Text>
                  <Text style={styles.successBannerSub}>
                    “{lastCreatedOccurrence.title}” já está na lista abaixo e na
                    fila do Agente.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.successBannerBtn}
                onPress={() =>
                  setSelectedOccurrenceId(lastCreatedOccurrence.id)
                }
              >
                <Text style={styles.successBannerBtnText}>Ver Chamado</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 2. Simple 3-Step Report Form */}
          {isFormOpen && (
            <View
              style={[
                styles.formCard,
                isSmallPhone && { padding: 14 },
              ]}
            >
              <View style={styles.formHeaderRow}>
                <Text style={styles.formTitle}>
                  Registrar Novo Chamado:{' '}
                  {CATEGORIES[selectedCategory].shortLabel}
                </Text>
                <Text style={styles.formStepBadge}>Rápido • 3 Passos</Text>
              </View>

              {/* Step 1: Where is it? */}
              <Text style={styles.stepTitle}>1. Onde está o problema?</Text>
              <Text style={styles.stepHint}>
                Escolha uma rua do bairro abaixo ou digite o endereço:
              </Text>
              <View style={styles.streetChipsRow}>
                {PRESET_LOCATIONS.map((loc, idx) => {
                  const active = selectedLocIdx === idx;
                  return (
                    <TouchableOpacity
                      key={loc.address}
                      style={[
                        styles.streetChip,
                        isSmallPhone && { width: '100%' },
                        active && styles.streetChipActive,
                      ]}
                      onPress={() => handleSelectLocation(idx)}
                    >
                      <Ionicons
                        name="location-outline"
                        size={13}
                        color={active ? COLORS.cream : COLORS.moss}
                      />
                      <Text
                        style={[
                          styles.streetChipText,
                          active && { color: COLORS.cream },
                        ]}
                        numberOfLines={1}
                      >
                        {loc.address.split('—')[0].trim()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Digite a rua e número"
                placeholderTextColor={COLORS.charcoalMuted}
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                value={reference}
                onChangeText={setReference}
                placeholder="Ponto de referência (ex: perto da padaria)"
                placeholderTextColor={COLORS.charcoalMuted}
              />

              {/* Step 2: What happened? */}
              <Text style={styles.stepTitle}>2. O que está acontecendo?</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Resumo curto do problema"
                placeholderTextColor={COLORS.charcoalMuted}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="Explique rapidamente para ajudar a equipe de manutenção..."
                placeholderTextColor={COLORS.charcoalMuted}
              />

              {/* Step 3: Photo */}
              <Text style={styles.stepTitle}>3. Foto do local</Text>
              <View
                style={[
                  styles.photoRow,
                  isMobile && styles.photoRowStacked,
                ]}
              >
                <Image
                  source={{ uri: photoUri }}
                  style={[
                    styles.photoPreview,
                    isMobile && { width: '100%', height: 150 },
                  ]}
                />
                <View style={styles.photoButtonsCol}>
                  <TouchableOpacity
                    style={[
                      styles.photoActionBtn,
                      isMobile && { width: '100%', justifyContent: 'center' },
                    ]}
                    onPress={handlePickImage}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={16}
                      color={COLORS.moss}
                    />
                    <Text style={styles.photoActionText}>
                      Escolher da Galeria / Câmera
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.photoHintText}>
                    Uma foto do local ajuda o agente a priorizar o conserto.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmitOccurrence}
                disabled={isSubmitting}
                activeOpacity={0.86}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.cream}
                />
                <Text style={styles.submitBtnText}>
                  {isSubmitting
                    ? 'Registrando Chamado...'
                    : 'Registrar Novo Chamado'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 3. Occurrences List with Simple Filters */}
          <View
            style={[
              styles.listHeader,
              isMobile && styles.listHeaderStacked,
            ]}
          >
            <Text style={styles.listTitle}>
              Chamados do Bairro ({filteredOccurrences.length})
            </Text>

            <View
              style={[
                styles.filterRow,
                isMobile && { width: '100%' },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isMobile && { flex: 1, alignItems: 'center' },
                  activeFilter === 'ALL' && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter('ALL')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === 'ALL' && styles.filterChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  Todos ({counts.all})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isMobile && { flex: 1, alignItems: 'center' },
                  activeFilter === 'OPEN' && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter('OPEN')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === 'OPEN' && styles.filterChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  Abertos ({counts.open})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isMobile && { flex: 1, alignItems: 'center' },
                  activeFilter === 'RESOLVED' && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter('RESOLVED')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === 'RESOLVED' && styles.filterChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  Resolvidos ({counts.resolved})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {filteredOccurrences.map((occ) => (
            <OccurrenceCard
              key={occ.id}
              occurrence={occ}
              isAgentView={false}
              onPressDetail={(o) => setSelectedOccurrenceId(o.id)}
            />
          ))}
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
    paddingVertical: 16,
    paddingBottom: 60,
  },
  centerColumn: {
    width: '100%',
    maxWidth: 880,
    alignSelf: 'center',
  },
  welcomeCard: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.lg,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  welcomeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamSubtle,
  },
  welcomeTopRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  welcomeGreeting: {
    fontFamily: FONTS.sansBold,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.charcoal,
  },
  welcomeNeighborhood: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoalMuted,
    marginTop: 2,
  },
  mainActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.moss,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: RADII.md,
    gap: 7,
  },
  mainActionBtnCancel: {
    backgroundColor: COLORS.charcoal,
  },
  mainActionBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cream,
  },
  quickPromptTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 10,
  },
  quickCategoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickCatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    paddingVertical: 11,
    paddingHorizontal: 12,
    gap: 8,
  },
  quickCatBtnActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  quickCatLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.charcoal,
    flexShrink: 1,
  },
  successBanner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.statusResolved,
    padding: 14,
    borderRadius: RADII.md,
    marginBottom: 16,
    gap: 12,
  },
  successBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 220,
  },
  successBannerTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.cream,
  },
  successBannerSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: 'rgba(242, 240, 233, 0.9)',
    marginTop: 2,
  },
  successBannerBtn: {
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.sm,
  },
  successBannerBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.cream,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.moss,
    borderRadius: RADII.lg,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  formHeaderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamSubtle,
  },
  formTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.moss,
  },
  formStepBadge: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.clay,
    backgroundColor: COLORS.clayMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.sm,
  },
  stepTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.charcoal,
    marginTop: 12,
    marginBottom: 4,
  },
  stepHint: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoalMuted,
    marginBottom: 8,
  },
  streetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  streetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 5,
  },
  streetChipActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  streetChipText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  input: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontFamily: FONTS.sansRegular,
    fontSize: 14,
    color: COLORS.charcoal,
  },
  textArea: {
    minHeight: 74,
    marginTop: 8,
    textAlignVertical: 'top',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
    backgroundColor: COLORS.cream,
    padding: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
  },
  photoRowStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  photoPreview: {
    width: 104,
    height: 74,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.creamSubtle,
  },
  photoButtonsCol: {
    flex: 1,
    gap: 6,
  },
  photoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 6,
  },
  photoActionText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.moss,
  },
  photoHintText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: COLORS.charcoalMuted,
  },
  submitBtn: {
    marginTop: 18,
    backgroundColor: COLORS.clay,
    borderRadius: RADII.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.cream,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  listHeaderStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  listTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.charcoal,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  filterChipText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoalMuted,
  },
  filterChipTextActive: {
    color: COLORS.cream,
  },
});
