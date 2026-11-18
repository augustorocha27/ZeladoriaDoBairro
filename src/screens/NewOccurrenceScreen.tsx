import React, { useState } from 'react';
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
import { CATEGORIES, PRESET_LOCATIONS } from '../data/mockData';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';
import { useResponsive } from '../theme/useResponsive';
import { OccurrenceCategory } from '../types';

interface NewOccurrenceScreenProps {
  onSuccessNavigateBack: () => void;
}

const CATEGORY_LIST = Object.values(CATEGORIES);

const QUICK_TEMPLATES: Record<
  OccurrenceCategory,
  { title: string; description: string }
> = {
  BURACO_VIA: {
    title: 'Cratera no asfalto prejudicando trânsito local',
    description:
      'Buraco de aproximadamente 60cm na faixa direita da via, causando risco de danos a pneus e acidentes com ciclistas.',
  },
  ILUMINACAO: {
    title: 'Poste apagado deixando trecho da calçada no escuro',
    description:
      'Luminária pública não acende durante o período noturno há 2 dias, comprometendo a segurança dos pedestres.',
  },
  ACUMULO_LIXO: {
    title: 'Acúmulo de lixo e entulho descartado na calçada',
    description:
      'Sacos rasgados e restos de móveis obstruindo a passagem de pedestres e atraindo vetores.',
  },
  ARVORE_PODA: {
    title: 'Galhos baixos bloqueando placa e passeio público',
    description:
      'Árvore necessita de poda preventiva pois os galhos estão encostando na rede aérea e bloqueando a visibilidade.',
  },
  DRENAGEM: {
    title: 'Boca de lobo obstruída acumulando água na esquina',
    description:
      'Grelha de drenagem pluvial entupida com folhas e detritos, formando poça extensa mesmo após chuvas leves.',
  },
};

export const NewOccurrenceScreen: React.FC<NewOccurrenceScreenProps> = ({
  onSuccessNavigateBack,
}) => {
  const { addCitizenOccurrence } = useOccurrences();
  const { isMobile, isSmallPhone, pagePadding } = useResponsive();

  const [selectedCategory, setSelectedCategory] =
    useState<OccurrenceCategory>('BURACO_VIA');
  const [title, setTitle] = useState(QUICK_TEMPLATES.BURACO_VIA.title);
  const [description, setDescription] = useState(
    QUICK_TEMPLATES.BURACO_VIA.description
  );
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [customAddress, setCustomAddress] = useState(
    PRESET_LOCATIONS[0].address
  );
  const [customReference, setCustomReference] = useState(
    PRESET_LOCATIONS[0].reference
  );
  const [coordinates, setCoordinates] = useState(
    PRESET_LOCATIONS[0].coordinates
  );
  const [photoUri, setPhotoUri] = useState<string>(
    CATEGORIES.BURACO_VIA.defaultPhotoUri
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectCategory = (cat: OccurrenceCategory) => {
    setSelectedCategory(cat);
    setPhotoUri(CATEGORIES[cat].defaultPhotoUri);
    setTitle(QUICK_TEMPLATES[cat].title);
    setDescription(QUICK_TEMPLATES[cat].description);
  };

  const handleSelectLocationPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setCustomAddress(PRESET_LOCATIONS[idx].address);
    setCustomReference(PRESET_LOCATIONS[idx].reference);
    setCoordinates(PRESET_LOCATIONS[idx].coordinates);
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert(
        'Modo Simulador',
        'Não foi possível abrir a galeria neste ambiente. A foto de demonstração da categoria foi mantida.'
      );
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permissão de Câmera',
          'Permissão não concedida. Utilizando foto padrão de simulação.'
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert(
        'Câmera Simulada',
        'Câmera física indisponível no emulador/web. Utilizando registro fotográfico simulado.'
      );
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalTitle =
        title.trim() || QUICK_TEMPLATES[selectedCategory].title;
      const finalDescription =
        description.trim() || QUICK_TEMPLATES[selectedCategory].description;
      const finalAddress =
        customAddress.trim() || PRESET_LOCATIONS[selectedPresetIdx].address;
      const finalReference =
        customReference.trim() || PRESET_LOCATIONS[selectedPresetIdx].reference;

      await addCitizenOccurrence({
        title: finalTitle,
        description: finalDescription,
        category: selectedCategory,
        address: finalAddress,
        reference: finalReference,
        coordinates,
        photoUri,
      });
      onSuccessNavigateBack();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: pagePadding },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.centerColumn}>
        {/* Header */}
        <View
          style={[
            styles.headerBox,
            isSmallPhone && { padding: 16 },
          ]}
        >
          <Text style={styles.kicker}>CANAL DO MORADOR</Text>
          <Text
            style={[
              styles.headerTitle,
              isSmallPhone && { fontSize: 20 },
            ]}
          >
            Abrir Nova Ocorrência
          </Text>
          <Text style={styles.headerSub}>
            Escolha o tipo de problema, confirme o endereço da rua e anexe uma
            foto para enviar à prefeitura.
          </Text>
        </View>

        {/* Step 1: Category Selector */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>1. QUAL É O PROBLEMA?</Text>
          <View style={styles.categoryGrid}>
            {CATEGORY_LIST.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    isSmallPhone
                      ? { width: '100%' }
                      : isMobile
                      ? { width: '48%', flexGrow: 1 }
                      : { width: '31%', flexGrow: 1 },
                    isSelected && styles.categoryCardActive,
                  ]}
                  onPress={() => handleSelectCategory(cat.id)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={cat.iconName as any}
                    size={20}
                    color={isSelected ? COLORS.cream : COLORS.moss}
                  />
                  <Text
                    style={[
                      styles.categoryName,
                      isSelected && { color: COLORS.cream },
                    ]}
                  >
                    {cat.shortLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Photo Evidence */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>2. FOTO DO PROBLEMA</Text>
          <View style={styles.photoCard}>
            <Image
              source={{ uri: photoUri }}
              style={[
                styles.photoPreview,
                isSmallPhone && { height: 145 },
              ]}
            />
            <View
              style={[
                styles.photoActionsRow,
                isSmallPhone && { flexDirection: 'column' },
              ]}
            >
              <TouchableOpacity
                style={styles.photoActionBtn}
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera-outline" size={16} color={COLORS.moss} />
                <Text style={styles.photoActionText}>Câmera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoActionBtn}
                onPress={handlePickFromGallery}
              >
                <Ionicons name="images-outline" size={16} color={COLORS.moss} />
                <Text style={styles.photoActionText}>Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoActionBtn}
                onPress={() =>
                  setPhotoUri(CATEGORIES[selectedCategory].defaultPhotoUri)
                }
              >
                <Ionicons
                  name="refresh-outline"
                  size={16}
                  color={COLORS.clay}
                />
                <Text style={[styles.photoActionText, { color: COLORS.clay }]}>
                  Foto Exemplo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Step 3: Location */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>3. ENDEREÇO & REFERÊNCIA</Text>
          <View style={styles.locationPresetsGrid}>
            {PRESET_LOCATIONS.map((loc, idx) => {
              const active = selectedPresetIdx === idx;
              return (
                <TouchableOpacity
                  key={loc.address}
                  style={[
                    styles.locPresetChip,
                    isSmallPhone && { width: '100%' },
                    active && styles.locPresetChipActive,
                  ]}
                  onPress={() => handleSelectLocationPreset(idx)}
                >
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={active ? COLORS.cream : COLORS.moss}
                  />
                  <Text
                    style={[
                      styles.locPresetText,
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Rua e Número</Text>
            <TextInput
              style={styles.textInput}
              value={customAddress}
              onChangeText={setCustomAddress}
              placeholder="Ex: Rua das Figueiras, 240"
              placeholderTextColor={COLORS.charcoalMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ponto de Referência</Text>
            <TextInput
              style={styles.textInput}
              value={customReference}
              onChangeText={setCustomReference}
              placeholder="Ex: Próximo à praça ou esquina"
              placeholderTextColor={COLORS.charcoalMuted}
            />
          </View>
        </View>

        {/* Step 4: Details */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>4. O QUE ESTÁ ACONTECENDO?</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Título Resumido</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Descreva brevemente o problema"
              placeholderTextColor={COLORS.charcoalMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Observações</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Informe detalhes que ajudem a equipe de manutenção..."
              placeholderTextColor={COLORS.charcoalMuted}
            />
          </View>
        </View>

        {/* Submit CTA */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.86}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.cream} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Enviando...' : 'Enviar Chamado'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 64,
  },
  centerColumn: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  headerBox: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    marginBottom: 18,
    ...SHADOWS.card,
  },
  kicker: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.clay,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.charcoal,
    marginTop: 2,
  },
  headerSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoalMuted,
    marginTop: 6,
    lineHeight: 19,
  },
  stepSection: {
    marginBottom: 20,
  },
  stepLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.moss,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.md,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    gap: 10,
  },
  categoryCardActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  categoryName: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  photoCard: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: RADII.md,
    backgroundColor: COLORS.creamSubtle,
    marginBottom: 10,
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingVertical: 10,
    borderRadius: RADII.sm,
    gap: 6,
  },
  photoActionText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.moss,
  },
  locationPresetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  locPresetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creamElevated,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    gap: 6,
  },
  locPresetChipActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  locPresetText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.charcoal,
  },
  textArea: {
    minHeight: 86,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.moss,
    paddingVertical: 15,
    borderRadius: RADII.md,
    gap: 8,
  },
  submitButtonText: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.cream,
  },
});
