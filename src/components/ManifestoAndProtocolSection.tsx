import React, { useState } from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../contexts/IoTContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';
import { ActiveSectionTab } from './FloatingIslandNavbar';

interface ManifestoAndProtocolSectionProps {
  onSelectTab: (tab: ActiveSectionTab) => void;
  onTriggerIoTFailure: () => void;
}

/**
 * Implements Prompt.Md Section 2.D (PHILOSOPHY - The Manifesto)
 * & Section 2.E (PROTOCOL - Sticky Stacking Archive with 3 unique animated artifacts)
 */
export const ManifestoAndProtocolSection: React.FC<
  ManifestoAndProtocolSectionProps
> = ({ onSelectTab, onTriggerIoTFailure }) => {
  const { pole, isAnomalyActive } = useIoT();
  const [focusedProtocol, setFocusedProtocol] = useState<number>(1);

  return (
    <View>
      {/* =================================================================== */}
      {/* D. PHILOSOPHY (THE MANIFESTO - High-Contrast Charcoal + Texture)    */}
      {/* =================================================================== */}
      <View style={styles.manifestoOuterWrapper}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
          }}
          style={styles.manifestoCard}
          imageStyle={styles.manifestoBgImage}
        >
          <View style={styles.manifestoOverlay}>
            <View style={styles.manifestoTopMeta}>
              <Text style={styles.manifestoKicker}>
                02 // THE CIVIC MANIFESTO
              </Text>
              <Text style={styles.manifestoCoords}>
                LAT -23.5618 • LON -46.6554 • ARCHITECTURE 3-LAYER
              </Text>
            </View>

            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonBlockMuted}>
                <Text style={styles.comparisonLabelMuted}>
                  PARADIGMA REATIVO LEGADO
                </Text>
                <Text style={styles.comparisonQuestionOld}>
                  “A gestão tradicional pergunta:{'\n'}
                  <Text style={styles.comparisonOldStrike}>
                    O que está quebrado?”
                  </Text>
                </Text>
              </View>

              <View style={styles.comparisonDivider} />

              <View style={styles.comparisonBlockActive}>
                <Text style={styles.comparisonLabelClay}>
                  PARADIGMA NURA • ZELADORIA AUTÔNOMA
                </Text>
                <Text style={styles.comparisonQuestionNewSans}>
                  Nós perguntamos:
                </Text>
                <Text style={styles.comparisonQuestionNewSerif}>
                  O que é vital agora?
                </Text>
                <Text style={styles.manifestoBodyText}>
                  Um bairro não deve esperar semanas no escuro até que um
                  formulário burocrático seja protocolado. Quando o cidadão
                  fotografa uma falha ou o sensor óptico do Poste Inteligente
                  detecta ausência de lúmens à noite, a ordem técnica nasce
                  instantaneamente.
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* =================================================================== */}
      {/* E. PROTOCOL (STICKY STACKING ARCHIVE - 3 Animated Artifacts)        */}
      {/* =================================================================== */}
      <View style={styles.protocolSectionWrapper}>
        <View style={styles.protocolHeader}>
          <Text style={styles.protocolKicker}>
            03 // STICKY STACKING ARCHIVE
          </Text>
          <View style={styles.protocolTitleRow}>
            <Text style={styles.protocolTitleSans}>Arquitetura em </Text>
            <Text style={styles.protocolTitleSerif}>Três Protocolos.</Text>
          </View>
          <Text style={styles.protocolSubtitle}>
            Toque em qualquer cartão da pilha para expandir o artefato técnico
            ou acionar diretamente o módulo correspondente.
          </Text>
        </View>

        <View style={styles.stackContainer}>
          {/* --------------------------------------------------------------- */}
          {/* PROTOCOL CARD 01: ROTATING DOUBLE-HELIX GEAR ARTIFACT           */}
          {/* --------------------------------------------------------------- */}
          <TouchableOpacity
            activeOpacity={0.94}
            onPress={() => setFocusedProtocol(0)}
            style={[
              styles.protocolCard,
              focusedProtocol > 0 && styles.protocolCardUnderneath,
            ]}
          >
            <View style={styles.protocolLeftCol}>
              <View style={styles.protocolBadgeRow}>
                <View style={styles.protocolStepPill}>
                  <Text style={styles.protocolStepText}>
                    PROTOCOL 01 // CITIZEN SENSOR
                  </Text>
                </View>
                <Text style={styles.protocolCodeMono}>ASYNCSTORAGE LAYER</Text>
              </View>

              <Text style={styles.protocolCardTitle}>
                Captura Cidadã{' '}
                <Text style={styles.protocolCardTitleItalic}>
                  Georreferenciada.
                </Text>
              </Text>
              <Text style={styles.protocolCardDesc}>
                O morador registra buracos na via, descarte irregular de lixo,
                manejo arbóreo ou falhas de iluminação anexando evidência
                fotográfica e coordenadas GPS. O chamado entra imediatamente no
                pipeline com protocolo rastreável.
              </Text>

              <TouchableOpacity
                style={styles.protocolActionBtnMoss}
                onPress={() => onSelectTab('NEW_OCCURRENCE')}
              >
                <Ionicons name="camera-outline" size={16} color={COLORS.cream} />
                <Text style={styles.protocolActionBtnText}>
                  Abrir Nova Ocorrência Cidadã
                </Text>
                <Ionicons name="arrow-forward" size={15} color={COLORS.cream} />
              </TouchableOpacity>
            </View>

            {/* ARTIFACT 1: Rotating Double-Helix / Botanical Gear */}
            <View style={styles.artifactArena}>
              <View
                style={[
                  styles.gearOuterRing,
                  Platform.OS === 'web'
                    ? ({ animation: 'nuraSpinSlow 18s linear infinite' } as any)
                    : {},
                ]}
              >
                <View style={styles.gearAxisHorizontal} />
                <View style={styles.gearAxisVertical} />
                <View style={styles.gearNodeTop} />
                <View style={styles.gearNodeBottom} />
              </View>
              <View
                style={[
                  styles.gearInnerRing,
                  Platform.OS === 'web'
                    ? ({
                        animation: 'nuraSpinReverse 11s linear infinite',
                      } as any)
                    : {},
                ]}
              >
                <Ionicons name="compass-outline" size={34} color={COLORS.clay} />
              </View>
              <Text style={styles.artifactCaptionMono}>
                OPTICAL HELIX GEAR // GPS LOCK
              </Text>
            </View>
          </TouchableOpacity>

          {/* --------------------------------------------------------------- */}
          {/* PROTOCOL CARD 02: SCANNING LASER-GRID OVER MEDICAL/IOT CELLS    */}
          {/* --------------------------------------------------------------- */}
          <TouchableOpacity
            activeOpacity={0.94}
            onPress={() => setFocusedProtocol(1)}
            style={[
              styles.protocolCard,
              styles.protocolCardMoss,
              focusedProtocol > 1 && styles.protocolCardUnderneath,
            ]}
          >
            <View style={styles.protocolLeftCol}>
              <View style={styles.protocolBadgeRow}>
                <View
                  style={[
                    styles.protocolStepPill,
                    { backgroundColor: COLORS.clay },
                  ]}
                >
                  <Text style={[styles.protocolStepText, { color: COLORS.cream }]}>
                    PROTOCOL 02 // SMART POLE IoT #{pole.poleId}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.protocolCodeMono,
                    { color: 'rgba(242, 240, 233, 0.7)' },
                  ]}
                >
                  LUX THRESHOLD: &lt; 25 LX
                </Text>
              </View>

              <Text style={[styles.protocolCardTitle, { color: COLORS.cream }]}>
                Autonomia Óptica do{' '}
                <Text
                  style={[
                    styles.protocolCardTitleItalic,
                    { color: COLORS.clayLight },
                  ]}
                >
                  Poste Inteligente.
                </Text>
              </Text>
              <Text
                style={[
                  styles.protocolCardDesc,
                  { color: 'rgba(242, 240, 233, 0.82)' },
                ]}
              >
                Quando o sensor fotocélula detecta que anoiteceu ({pole.ambientLux}{' '}
                lx) e o circuito da luminária LED está apagado (0.4W), o
                próprio sistema abre uma ocorrência automática de manutenção de
                iluminação sem depender de intervenção humana.
              </Text>

              <View style={styles.protocolBtnGroup}>
                <TouchableOpacity
                  style={styles.protocolActionBtnClay}
                  onPress={onTriggerIoTFailure}
                >
                  <Ionicons name="thunderstorm" size={16} color={COLORS.cream} />
                  <Text style={styles.protocolActionBtnText}>
                    Disparar Escuridão + Poste Apagado
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.protocolSecondaryBtn}
                  onPress={() => onSelectTab('IOT_LAB')}
                >
                  <Text style={styles.protocolSecondaryBtnText}>
                    Abrir Painel IoT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ARTIFACT 2: Scanning Laser-Grid over a Grid of Cells */}
            <View style={styles.artifactArenaDark}>
              <View style={styles.cellMatrixContainer}>
                {Array.from({ length: 16 }).map((_, idx) => {
                  const isFaultCell =
                    isAnomalyActive && (idx === 5 || idx === 6 || idx === 9);
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.matrixCell,
                        isFaultCell && styles.matrixCellFault,
                      ]}
                    >
                      <View
                        style={[
                          styles.matrixCellCore,
                          isFaultCell && { backgroundColor: COLORS.clay },
                        ]}
                      />
                    </View>
                  );
                })}

                {/* Scanning Laser Bar */}
                <View
                  style={[
                    styles.laserScanBar,
                    Platform.OS === 'web'
                      ? ({
                          animation: 'nuraLaserScan 3.2s ease-in-out infinite',
                        } as any)
                      : { top: '45%' },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.artifactCaptionMono,
                  { color: COLORS.clayLight },
                ]}
              >
                LASER MATRIX SCAN // {pole.ambientLux} LX
              </Text>
            </View>
          </TouchableOpacity>

          {/* --------------------------------------------------------------- */}
          {/* PROTOCOL CARD 03: PULSING EKG WAVEFORM PATH ARTIFACT            */}
          {/* --------------------------------------------------------------- */}
          <TouchableOpacity
            activeOpacity={0.94}
            onPress={() => setFocusedProtocol(2)}
            style={styles.protocolCard}
          >
            <View style={styles.protocolLeftCol}>
              <View style={styles.protocolBadgeRow}>
                <View style={styles.protocolStepPill}>
                  <Text style={styles.protocolStepText}>
                    PROTOCOL 03 // AGENT COMMAND QUEUE
                  </Text>
                </View>
                <Text style={styles.protocolCodeMono}>4-STAGE PIPELINE</Text>
              </View>

              <Text style={styles.protocolCardTitle}>
                Despacho Técnico &{' '}
                <Text style={styles.protocolCardTitleItalic}>
                  Ciclo de Resolução.
                </Text>
              </Text>
              <Text style={styles.protocolCardDesc}>
                O agente público acessa a fila unificada de problemas (relatos
                de moradores + alertas automáticos IoT) e atualiza o andamento
                em 4 estágios auditáveis: Aberta, Em análise, Em andamento e
                Resolvida.
              </Text>

              <TouchableOpacity
                style={styles.protocolActionBtnMoss}
                onPress={() => onSelectTab('AGENT_CONSOLE')}
              >
                <Ionicons
                  name="layers-outline"
                  size={16}
                  color={COLORS.cream}
                />
                <Text style={styles.protocolActionBtnText}>
                  Acessar Fila do Agente
                </Text>
                <Ionicons name="arrow-forward" size={15} color={COLORS.cream} />
              </TouchableOpacity>
            </View>

            {/* ARTIFACT 3: Pulsing EKG Waveform Path */}
            <View style={styles.artifactArena}>
              <View style={styles.ekgScreenBox}>
                {Platform.OS === 'web' ? (
                  React.createElement('div', {
                    style: { width: '100%', height: 80 },
                    dangerouslySetInnerHTML: {
                      __html: `<svg viewBox="0 0 260 80" width="100%" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 0 42 L 45 42 L 58 28 L 70 56 L 86 10 L 102 70 L 116 34 L 130 42 L 185 42 L 198 22 L 210 58 L 225 42 L 260 42" stroke="#CC5833" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="600" style="animation: nuraEkgDash 3.5s linear infinite;" />
                        <circle cx="86" cy="10" r="4" fill="#35D07F" />
                        <circle cx="198" cy="22" r="4" fill="#CC5833" />
                      </svg>`,
                    },
                  })
                ) : (
                  <View style={styles.ekgBarsFallback}>
                    {[20, 35, 18, 64, 14, 48, 28, 54, 24, 38].map((h, i) => (
                      <View
                        key={i}
                        style={[
                          styles.ekgBar,
                          {
                            height: h,
                            backgroundColor:
                              i === 3 || i === 7
                                ? COLORS.clay
                                : COLORS.telemetryGreen,
                          },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
              <Text style={styles.artifactCaptionMono}>
                EKG RESOLUTION WAVEFORM // 98.4 BPM
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  manifestoOuterWrapper: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  manifestoCard: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    borderRadius: RADII.xxxl,
    overflow: 'hidden',
    ...SHADOWS.floatingIsland,
  },
  manifestoBgImage: {
    borderRadius: RADII.xxxl,
    opacity: 0.22,
  },
  manifestoOverlay: {
    backgroundColor: 'rgba(26, 26, 26, 0.92)',
    paddingVertical: 56,
    paddingHorizontal: 32,
  },
  manifestoTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 36,
    gap: 8,
  },
  manifestoKicker: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.clayLight,
    letterSpacing: 1.4,
  },
  manifestoCoords: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: 'rgba(242, 240, 233, 0.5)',
  },
  comparisonContainer: {
    gap: 28,
  },
  comparisonBlockMuted: {
    maxWidth: 680,
  },
  comparisonLabelMuted: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: 'rgba(242, 240, 233, 0.45)',
    marginBottom: 8,
    letterSpacing: 1,
  },
  comparisonQuestionOld: {
    fontFamily: FONTS.sansBold,
    fontSize: 26,
    fontWeight: '700',
    color: 'rgba(242, 240, 233, 0.55)',
    lineHeight: 34,
  },
  comparisonOldStrike: {
    textDecorationLine: 'line-through',
    color: 'rgba(242, 240, 233, 0.4)',
  },
  comparisonDivider: {
    height: 1,
    backgroundColor: 'rgba(242, 240, 233, 0.14)',
    marginVertical: 4,
  },
  comparisonBlockActive: {
    maxWidth: 820,
  },
  comparisonLabelClay: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.telemetryGreen,
    marginBottom: 8,
    letterSpacing: 1,
  },
  comparisonQuestionNewSans: {
    fontFamily: FONTS.sansBold,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    letterSpacing: -0.9,
  },
  comparisonQuestionNewSerif: {
    fontFamily: FONTS.serifItalic,
    fontSize: 52,
    fontStyle: 'italic',
    fontWeight: '600',
    color: COLORS.clayLight,
    marginTop: -6,
    marginBottom: 16,
  },
  manifestoBodyText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 16,
    color: 'rgba(242, 240, 233, 0.82)',
    lineHeight: 25,
  },
  protocolSectionWrapper: {
    width: '100%',
    maxWidth: 1160,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 56,
  },
  protocolHeader: {
    marginBottom: 32,
  },
  protocolKicker: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.clay,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  protocolTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  protocolTitleSans: {
    fontFamily: FONTS.sansBold,
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.8,
  },
  protocolTitleSerif: {
    fontFamily: FONTS.serifItalic,
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: '600',
    color: COLORS.moss,
  },
  protocolSubtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 15,
    color: COLORS.charcoalMuted,
    marginTop: 6,
    maxWidth: 660,
    lineHeight: 22,
  },
  stackContainer: {
    gap: 22,
  },
  protocolCard: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.xxxl,
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    ...SHADOWS.card,
  },
  protocolCardMoss: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossLight,
    ...SHADOWS.floatingIsland,
  },
  protocolCardUnderneath: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  protocolLeftCol: {
    flex: 1,
    minWidth: 280,
  },
  protocolBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 14,
    gap: 8,
  },
  protocolStepPill: {
    backgroundColor: COLORS.mossMuted,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADII.pill,
  },
  protocolStepText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
    letterSpacing: 0.6,
  },
  protocolCodeMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
    fontWeight: '600',
  },
  protocolCardTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  protocolCardTitleItalic: {
    fontFamily: FONTS.serifItalic,
    fontStyle: 'italic',
    fontWeight: '600',
    color: COLORS.moss,
    fontSize: 30,
  },
  protocolCardDesc: {
    fontFamily: FONTS.sansRegular,
    fontSize: 14,
    color: COLORS.charcoalMuted,
    lineHeight: 22,
    marginBottom: 20,
  },
  protocolBtnGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  protocolActionBtnMoss: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.moss,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: RADII.pill,
    gap: 8,
  },
  protocolActionBtnClay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.clay,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: RADII.pill,
    gap: 8,
    ...SHADOWS.clayGlow,
  },
  protocolActionBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
  },
  protocolSecondaryBtn: {
    backgroundColor: 'rgba(242, 240, 233, 0.14)',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.25)',
  },
  protocolSecondaryBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
  },
  artifactArena: {
    width: 260,
    minHeight: 190,
    backgroundColor: COLORS.cream,
    borderRadius: RADII.xxl,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  artifactArenaDark: {
    width: 260,
    minHeight: 190,
    backgroundColor: '#141D18',
    borderRadius: RADII.xxl,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  gearOuterRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.moss,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gearAxisHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1.5,
    backgroundColor: 'rgba(46, 64, 54, 0.25)',
  },
  gearAxisVertical: {
    position: 'absolute',
    height: '100%',
    width: 1.5,
    backgroundColor: 'rgba(46, 64, 54, 0.25)',
  },
  gearNodeTop: {
    position: 'absolute',
    top: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.clay,
  },
  gearNodeBottom: {
    position: 'absolute',
    bottom: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.moss,
  },
  gearInnerRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1.5,
    borderColor: COLORS.clay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artifactCaptionMono: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.charcoalMuted,
    marginTop: 14,
    letterSpacing: 0.7,
  },
  cellMatrixContainer: {
    width: 170,
    height: 120,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    alignContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  matrixCell: {
    width: 34,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(242, 240, 233, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(53, 208, 127, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixCellFault: {
    backgroundColor: 'rgba(204, 88, 51, 0.28)',
    borderColor: COLORS.clay,
  },
  matrixCellCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.telemetryGreen,
  },
  laserScanBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.clayLight,
    shadowColor: COLORS.clay,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  ekgScreenBox: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.charcoal,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  ekgBarsFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ekgBar: {
    width: 8,
    borderRadius: 4,
  },
});
