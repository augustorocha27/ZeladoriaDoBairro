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
    if (!title.trim() || !customAddress.trim()) {
      Alert.alert(
        'Campos obrigatórios',
        'Informe pelo menos o título do problema e a localização.'
      );
      return;
    }

    setIsSubmitting(true);
    await addCitizenOccurrence({
      title,
      description,
      category: selectedCategory,
      address: customAddress,
      reference: customReference,
      coordinates,
      photoUri,
    });
    setIsSubmitting(false);
    onSuccessNavigateBack();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.kicker}>PROTOCOLO DE CAMPO • CIDADÃO</Text>
        <Text style={styles.headerTitle}>
          Reportar{' '}
          <Text style={styles.headerTitleItalic}>Ocorrência Urbana</Text>
        </Text>
        <Text style={styles.headerSub}>
          Selecione a categoria, anexe uma foto e confirme o local. O chamado é
          persistido no AsyncStorage e enviado imediatamente ao painel do Agente.
        </Text>
      </View>

      {/* Step 1: Category Selector */}
      <View style={styles.stepSection}>
        <Text style={styles.stepLabel}>1. TIPO DE PROBLEMA URBANO</Text>
        <View style={styles.categoryGrid}>
          {CATEGORY_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardActive,
                ]}
                onPress={() => handleSelectCategory(cat.id)}
                activeOpacity={0.85}
              >
                <View style={styles.categoryCardTop}>
                  <Text
                    style={[
                      styles.categoryCode,
                      isSelected && { color: COLORS.clayLight },
                    ]}
                  >
                    [{cat.code}]
                  </Text>
                  <Ionicons
                    name={cat.iconName as any}
                    size={18}
                    color={isSelected ? COLORS.cream : COLORS.moss}
                  />
                </View>
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
        <Text style={styles.stepLabel}>2. EVIDÊNCIA FOTOGRÁFICA</Text>
        <View style={styles.photoCard}>
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          <View style={styles.photoActionsRow}>
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
              <Ionicons name="sparkles-outline" size={16} color={COLORS.clay} />
              <Text style={[styles.photoActionText, { color: COLORS.clay }]}>
                Foto Padrão
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Step 3: Location & GPS */}
      <View style={styles.stepSection}>
        <Text style={styles.stepLabel}>3. LOCALIZAÇÃO & GEORREFERÊNCIA</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationPresetsRow}
        >
          {PRESET_LOCATIONS.map((loc, idx) => {
            const active = selectedPresetIdx === idx;
            return (
              <TouchableOpacity
                key={loc.address}
                style={[
                  styles.locPresetChip,
                  active && styles.locPresetChipActive,
                ]}
                onPress={() => handleSelectLocationPreset(idx)}
              >
                <Ionicons
                  name="navigate-circle-outline"
                  size={14}
                  color={active ? COLORS.cream : COLORS.moss}
                />
                <Text
                  style={[
                    styles.locPresetText,
                    active && { color: COLORS.cream },
                  ]}
                >
                  {loc.address.split('—')[0].trim()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Endereço do Ocorrido</Text>
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

        <View style={styles.gpsStrip}>
          <Ionicons name="locate" size={15} color={COLORS.telemetryGreen} />
          <Text style={styles.gpsStripText}>
            TELEMETRIA GPS SIMULADA: {coordinates}
          </Text>
        </View>
      </View>

      {/* Step 4: Details */}
      <View style={styles.stepSection}>
        <Text style={styles.stepLabel}>4. DESCRIÇÃO DA OCORRÊNCIA</Text>
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
          <Text style={styles.inputLabel}>Observações para o Agente</Text>
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
        <Ionicons name="paper-plane" size={18} color={COLORS.cream} />
        <Text style={styles.submitButtonText}>
          {isSubmitting
            ? 'Registrando no AsyncStorage...'
            : 'Registrar Ocorrência Urbana'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  headerBox: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.xxl,
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
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.charcoal,
    marginTop: 2,
  },
  headerTitleItalic: {
    fontFamily: FONTS.serifItalic,
    fontStyle: 'italic',
    color: COLORS.moss,
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
    width: '48%',
    flexGrow: 1,
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
  },
  categoryCardActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.moss,
  },
  categoryCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryCode: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.clay,
    fontWeight: '700',
  },
  categoryName: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  photoCard: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
  },
  photoPreview: {
    width: '100%',
    height: 170,
    borderRadius: RADII.lg,
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
    backgroundColor: COLORS.creamSubtle,
    paddingVertical: 10,
    borderRadius: RADII.pill,
    gap: 6,
  },
  photoActionText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.moss,
  },
  locationPresetsRow: {
    gap: 8,
    paddingBottom: 12,
  },
  locPresetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creamElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    gap: 6,
  },
  locPresetChipActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.moss,
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
  gpsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: RADII.md,
    gap: 8,
  },
  gpsStripText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.cream,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.clay,
    paddingVertical: 16,
    borderRadius: RADII.pill,
    gap: 8,
    ...SHADOWS.clayGlow,
  },
  submitButtonText: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.cream,
  },
});
