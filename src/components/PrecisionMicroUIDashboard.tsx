import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../contexts/IoTContext';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';

const WEEK_DAYS = [
  { id: 0, short: 'S', label: 'Dom', task: 'Auditoria Fotocélula' },
  { id: 1, short: 'M', label: 'Seg', task: 'Varrição & Resíduos' },
  { id: 2, short: 'T', label: 'Ter', task: 'Inspeção Asfáltica' },
  { id: 3, short: 'W', label: 'Qua', task: 'Calibração IoT #PZ-042' },
  { id: 4, short: 'T', label: 'Qui', task: 'Manejo Arbóreo' },
  { id: 5, short: 'F', label: 'Sex', task: 'Drenagem Pluvial' },
  { id: 6, short: 'S', label: 'Sáb', task: 'Balancete AsyncStorage' },
];

interface ShufflerItem {
  id: string;
  code: string;
  label: string;
  metric: string;
  sub: string;
  accent: string;
}

/**
 * Prompt.Md Section 2.C: FEATURES (The Precision Micro-UI Dashboard)
 * Replaces standard cards with 3 Interactive Functional Artifacts:
 * - Card 1: Diagnostic Shuffler (3 overlapping white cards cycling vertically via unshift(pop()) every 3s)
 * - Card 2: Telemetry Typewriter (Live character-by-character neural/IoT stream with blinking clay cursor)
 * - Card 3: Mock Cursor Protocol Scheduler (Weekly grid S M T W T F S with automated cursor click & Save)
 */
export const PrecisionMicroUIDashboard: React.FC<{
  onTriggerIoT: () => void;
}> = ({ onTriggerIoT }) => {
  const { occurrences } = useOccurrences();
  const { pole, isAnomalyActive, telemetryLogs } = useIoT();

  const resolvedCount = occurrences.filter(
    (o) => o.status === 'RESOLVIDA'
  ).length;
  const openCount = occurrences.length - resolvedCount;

  // =========================================================================
  // ARTIFACT 1: DIAGNOSTIC SHUFFLER (unshift(pop()) every 3 seconds)
  // =========================================================================
  const [shufflerStack, setShufflerStack] = useState<ShufflerItem[]>([
    {
      id: 'diag-1',
      code: 'BIO-AGE // 01',
      label: 'Epigenetic Urban Score',
      metric: '94.8% Vital',
      sub: `${resolvedCount} intervenções concluídas • Setor Jardim Botânico`,
      accent: COLORS.moss,
    },
    {
      id: 'diag-2',
      code: 'MESH-LUX // 02',
      label: 'Microbiome Photocell Score',
      metric: `${pole.ambientLux} lx`,
      sub: isAnomalyActive
        ? 'Anomalia Crítica: Escuro com Poste Apagado!'
        : `Nó #${pole.poleId} operando em ${pole.powerDrawWatts}W`,
      accent: COLORS.clay,
    },
    {
      id: 'diag-3',
      code: 'CORTISOL-OPS // 03',
      label: 'Cortisol Dispatch Optimization',
      metric: `${openCount} Ativos`,
      sub: 'Latência de persistência AsyncStorage < 12ms',
      accent: COLORS.statusProgress,
    },
  ]);

  // Keep dynamic values updated inside shuffler cards
  useEffect(() => {
    setShufflerStack((prev) =>
      prev.map((item) => {
        if (item.id === 'diag-1') {
          return {
            ...item,
            sub: `${resolvedCount} intervenções concluídas • Setor Jardim Botânico`,
          };
        }
        if (item.id === 'diag-2') {
          return {
            ...item,
            metric: `${pole.ambientLux} lx`,
            sub: isAnomalyActive
              ? 'Anomalia Crítica: Escuro com Poste Apagado!'
              : `Nó #${pole.poleId} operando em ${pole.powerDrawWatts}W`,
          };
        }
        if (item.id === 'diag-3') {
          return {
            ...item,
            metric: `${openCount} Ativos`,
          };
        }
        return item;
      })
    );
  }, [resolvedCount, openCount, pole.ambientLux, pole.powerDrawWatts, pole.poleId, isAnomalyActive]);

  // Rotate vertically using unshift(pop()) every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShufflerStack((prev) => {
        const next = [...prev];
        const popped = next.pop();
        if (popped) {
          next.unshift(popped);
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const manualShuffle = () => {
    setShufflerStack((prev) => {
      const next = [...prev];
      const popped = next.pop();
      if (popped) next.unshift(popped);
      return next;
    });
  };

  // =========================================================================
  // ARTIFACT 2: TELEMETRY TYPEWRITER (Character-by-character live feed)
  // =========================================================================
  const streamPhrases = [
    `Optimizing Circadian Photocell #${pole.poleId} (${pole.ambientLux} lx)...`,
    isAnomalyActive
      ? 'CRITICAL: Darkness detected + LED Open Circuit (0.4W) -> Auto-Ticket Dispatched!'
      : `Auditing Streetlight Telemetry (${pole.voltageV}V @ ${pole.powerDrawWatts}W)...`,
    `Synchronizing ${occurrences.length} Urban Protocols in AsyncStorage...`,
    'Calibrating Citizen-to-Agent Dispatch Queue Latency...',
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [cursorBlink, setCursorBlink] = useState(true);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setCursorBlink((b) => !b);
    }, 480);
    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    const fullText = streamPhrases[phraseIdx % streamPhrases.length];
    let charIndex = 0;
    setTypedText('');

    const typeTimer = setInterval(() => {
      charIndex += 1;
      setTypedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        clearInterval(typeTimer);
        setTimeout(() => {
          setPhraseIdx((p) => (p + 1) % streamPhrases.length);
        }, 1800);
      }
    }, 38);

    return () => clearInterval(typeTimer);
  }, [phraseIdx, pole.ambientLux, isAnomalyActive, occurrences.length]);

  // =========================================================================
  // ARTIFACT 3: MOCK CURSOR PROTOCOL SCHEDULER (S M T W T F S + SVG Cursor)
  // =========================================================================
  const [activeDays, setActiveDays] = useState<number[]>([1, 3, 5]);
  const [cursorStep, setCursorStep] = useState<
    'ENTERING' | 'MOVING_TO_DAY' | 'CLICKING_DAY' | 'MOVING_TO_SAVE' | 'CLICKING_SAVE' | 'SAVED_FADEOUT'
  >('ENTERING');
  const [targetDayIndex, setTargetDayIndex] = useState(3);
  const [protocolSavedBadge, setProtocolSavedBadge] = useState(false);

  useEffect(() => {
    const sequence = [
      { step: 'ENTERING' as const, delay: 700 },
      { step: 'MOVING_TO_DAY' as const, delay: 900 },
      { step: 'CLICKING_DAY' as const, delay: 500 },
      { step: 'MOVING_TO_SAVE' as const, delay: 950 },
      { step: 'CLICKING_SAVE' as const, delay: 500 },
      { step: 'SAVED_FADEOUT' as const, delay: 1400 },
    ];

    let stepIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const runStep = () => {
      const current = sequence[stepIdx];
      setCursorStep(current.step);

      if (current.step === 'CLICKING_DAY') {
        setActiveDays((prev) =>
          prev.includes(targetDayIndex)
            ? prev
            : [...prev, targetDayIndex]
        );
      } else if (current.step === 'CLICKING_SAVE') {
        setProtocolSavedBadge(true);
      } else if (current.step === 'ENTERING') {
        setProtocolSavedBadge(false);
      }

      timeoutId = setTimeout(() => {
        stepIdx = (stepIdx + 1) % sequence.length;
        if (stepIdx === 0) {
          setTargetDayIndex((prev) => (prev + 2) % 7);
        }
        runStep();
      }, current.delay);
    };

    runStep();
    return () => clearTimeout(timeoutId);
  }, [targetDayIndex]);

  // Compute simulated cursor coordinates (%) inside Card 3
  const getCursorPosition = () => {
    const dayLeftPercent = 8 + targetDayIndex * 12.5;
    switch (cursorStep) {
      case 'ENTERING':
        return { top: '12%', left: '84%', scale: 1, opacity: 0.9 };
      case 'MOVING_TO_DAY':
        return { top: '44%', left: `${dayLeftPercent}%`, scale: 1, opacity: 1 };
      case 'CLICKING_DAY':
        return {
          top: '44%',
          left: `${dayLeftPercent}%`,
          scale: 0.78,
          opacity: 1,
        };
      case 'MOVING_TO_SAVE':
        return { top: '80%', left: '72%', scale: 1, opacity: 1 };
      case 'CLICKING_SAVE':
        return { top: '80%', left: '72%', scale: 0.8, opacity: 1 };
      case 'SAVED_FADEOUT':
        return { top: '84%', left: '82%', scale: 0.95, opacity: 0 };
    }
  };

  const cursorPos = getCursorPosition();

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.kickerMono}>
          01 // THE PRECISION MICRO-UI DASHBOARD
        </Text>
        <View style={styles.titleRow}>
          <Text style={styles.titleSans}>Instrumentos de </Text>
          <Text style={styles.titleSerifItalic}>Telemetria Viva.</Text>
        </View>
        <Text style={styles.subtitle}>
          Três artefatos funcionais monitorando a conservação do bairro, a
          fotocélula do Poste Inteligente e o protocolo semanal de manutenção.
        </Text>
      </View>

      <View style={styles.cardsGrid}>
        {/* =============================================================== */}
        {/* CARD 1: AUDIT INTELLIGENCE (DIAGNOSTIC SHUFFLER)                */}
        {/* =============================================================== */}
        <View style={styles.artifactCard}>
          <View style={styles.cardTopMeta}>
            <Text style={styles.cardCodeMono}>ARTIFACT 01 // AUDIT</Text>
            <TouchableOpacity
              style={styles.shuffleTriggerPill}
              onPress={manualShuffle}
            >
              <Ionicons name="sync" size={12} color={COLORS.moss} />
              <Text style={styles.shuffleTriggerText}>Ciclar (3s)</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.artifactTitle}>Audit Intelligence</Text>
          <Text style={styles.artifactDesc}>
            Diagnostic Shuffler rotacionando verticalmente via{' '}
            <Text style={{ fontFamily: FONTS.mono }}>unshift(pop())</Text>.
          </Text>

          {/* 3 Overlapping White Cards Stack */}
          <View style={styles.shufflerStage}>
            {shufflerStack.map((card, index) => {
              const offsetTop = index * 18;
              const scale = 1 - index * 0.055;
              const opacity = 1 - index * 0.25;
              const zIndex = 10 - index;

              return (
                <TouchableOpacity
                  key={card.id}
                  activeOpacity={0.92}
                  onPress={manualShuffle}
                  style={[
                    styles.shufflerLayerCard,
                    {
                      top: offsetTop,
                      zIndex,
                      opacity,
                      transform: [{ scale }],
                    },
                    Platform.OS === 'web'
                      ? ({
                          transition:
                            'all 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        } as any)
                      : {},
                  ]}
                >
                  <View style={styles.shufflerCardHeader}>
                    <Text
                      style={[
                        styles.shufflerCardCode,
                        { color: card.accent },
                      ]}
                    >
                      [{card.code}]
                    </Text>
                    <View
                      style={[
                        styles.shufflerMetricPill,
                        { backgroundColor: card.accent },
                      ]}
                    >
                      <Text style={styles.shufflerMetricText}>
                        {card.metric}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.shufflerCardLabel}>{card.label}</Text>
                  <Text style={styles.shufflerCardSub} numberOfLines={2}>
                    {card.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* =============================================================== */}
        {/* CARD 2: NEURAL STREAM (TELEMETRY TYPEWRITER)                    */}
        {/* =============================================================== */}
        <View style={[styles.artifactCard, styles.artifactCardDark]}>
          <View style={styles.cardTopMeta}>
            <Text style={[styles.cardCodeMono, { color: COLORS.clayLight }]}>
              ARTIFACT 02 // NEURAL STREAM
            </Text>
            <View style={styles.liveFeedBadge}>
              <View style={styles.pulsingLiveDot} />
              <Text style={styles.liveFeedText}>LIVE FEED</Text>
            </View>
          </View>

          <Text style={[styles.artifactTitle, { color: COLORS.cream }]}>
            Telemetry Typewriter
          </Text>
          <Text
            style={[
              styles.artifactDesc,
              { color: 'rgba(242, 240, 233, 0.68)' },
            ]}
          >
            Stream contínuo da fotocélula IoT #{pole.poleId} e estado do
            AsyncStorage.
          </Text>

          {/* Typewriter Terminal Screen */}
          <View style={styles.typewriterScreen}>
            <Text style={styles.typewriterPrompt}>
              root@nura-node-pz042:~#
            </Text>
            <Text style={styles.typewriterLiveLine}>
              {typedText}
              <Text
                style={[
                  styles.clayCursor,
                  { opacity: cursorBlink ? 1 : 0.1 },
                ]}
              >
                {' '}
                ▋
              </Text>
            </Text>

            <View style={styles.miniLogDivider} />
            {telemetryLogs.slice(0, 2).map((log) => (
              <Text
                key={log.id}
                style={styles.miniLogItem}
                numberOfLines={1}
              >
                [{log.timestamp}] {log.message}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            style={styles.streamActionBtn}
            onPress={onTriggerIoT}
            activeOpacity={0.86}
          >
            <Ionicons name="flash" size={14} color={COLORS.cream} />
            <Text style={styles.streamActionBtnText}>
              Injetar Falha Noturna no Poste #{pole.poleId}
            </Text>
          </TouchableOpacity>
        </View>

        {/* =============================================================== */}
        {/* CARD 3: ADAPTIVE REGIMEN (MOCK CURSOR PROTOCOL SCHEDULER)       */}
        {/* =============================================================== */}
        <View style={styles.artifactCard}>
          <View style={styles.cardTopMeta}>
            <Text style={styles.cardCodeMono}>ARTIFACT 03 // REGIMEN</Text>
            <View style={styles.regimenStatusPill}>
              <Text style={styles.regimenStatusText}>
                {protocolSavedBadge ? 'SAVED ✓' : 'AUTO-SCHEDULER'}
              </Text>
            </View>
          </View>

          <Text style={styles.artifactTitle}>Adaptive Regimen</Text>
          <Text style={styles.artifactDesc}>
            Cursor automatizado agendando rondas preventivas de iluminação e
            zeladoria.
          </Text>

          {/* Interactive Weekly Grid with Automated Floating SVG Cursor */}
          <View style={styles.schedulerStage}>
            <View style={styles.weekGridRow}>
              {WEEK_DAYS.map((day, idx) => {
                const isSelected = activeDays.includes(idx);
                const isBeingClicked =
                  cursorStep === 'CLICKING_DAY' && targetDayIndex === idx;

                return (
                  <TouchableOpacity
                    key={day.id}
                    onPress={() =>
                      setActiveDays((prev) =>
                        prev.includes(idx)
                          ? prev.filter((d) => d !== idx)
                          : [...prev, idx]
                      )
                    }
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellActive,
                      isBeingClicked && {
                        transform: [{ scale: 0.88 }],
                        backgroundColor: COLORS.clay,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayShortText,
                        isSelected && { color: COLORS.cream },
                      ]}
                    >
                      {day.short}
                    </Text>
                    <View
                      style={[
                        styles.dayDot,
                        isSelected && { backgroundColor: COLORS.clayLight },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.schedulerFooterRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.schedulerSelectedLabel}>
                  RONDA ATIVA: {WEEK_DAYS[targetDayIndex].label.toUpperCase()}
                </Text>
                <Text style={styles.schedulerTaskName}>
                  {WEEK_DAYS[targetDayIndex].task}
                </Text>
              </View>

              <View
                style={[
                  styles.saveProtocolBtn,
                  cursorStep === 'CLICKING_SAVE' && {
                    transform: [{ scale: 0.91 }],
                    backgroundColor: COLORS.clay,
                  },
                  protocolSavedBadge && { backgroundColor: COLORS.moss },
                ]}
              >
                <Text style={styles.saveProtocolBtnText}>
                  {protocolSavedBadge ? 'Protocol Saved' : 'Save Protocol'}
                </Text>
              </View>
            </View>

            {/* Automated Custom Cursor Overlay */}
            <View
              pointerEvents="none"
              style={[
                styles.mockCursorWrapper,
                {
                  top: cursorPos.top as any,
                  left: cursorPos.left as any,
                  opacity: cursorPos.opacity,
                  transform: [{ scale: cursorPos.scale }],
                },
                Platform.OS === 'web'
                  ? ({
                      transition:
                        'all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    } as any)
                  : {},
              ]}
            >
              <View style={styles.cursorArrowBadge}>
                <Ionicons name="navigate" size={16} color={COLORS.cream} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    width: '100%',
    maxWidth: 1160,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 56,
  },
  sectionHeader: {
    marginBottom: 32,
  },
  kickerMono: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.clay,
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  titleSans: {
    fontFamily: FONTS.sansBold,
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.8,
  },
  titleSerifItalic: {
    fontFamily: FONTS.serifItalic,
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: '600',
    color: COLORS.moss,
  },
  subtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 15,
    color: COLORS.charcoalMuted,
    maxWidth: 680,
    lineHeight: 22,
    marginTop: 6,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  artifactCard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.xxxl,
    padding: 26,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    ...SHADOWS.card,
  },
  artifactCardDark: {
    backgroundColor: COLORS.charcoal,
    borderColor: COLORS.charcoalBorder,
  },
  cardTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardCodeMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
    letterSpacing: 0.9,
  },
  shuffleTriggerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.mossMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    gap: 5,
  },
  shuffleTriggerText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
  },
  artifactTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  artifactDesc: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoalMuted,
    lineHeight: 19,
    marginBottom: 18,
  },
  shufflerStage: {
    height: 165,
    position: 'relative',
    marginTop: 4,
  },
  shufflerLayerCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    ...SHADOWS.card,
  },
  shufflerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shufflerCardCode: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
  },
  shufflerMetricPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  shufflerMetricText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cream,
  },
  shufflerCardLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.charcoal,
    marginBottom: 4,
  },
  shufflerCardSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoalMuted,
    lineHeight: 17,
  },
  liveFeedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(53, 208, 127, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
    gap: 6,
  },
  pulsingLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.telemetryGreen,
  },
  liveFeedText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.telemetryGreen,
  },
  typewriterScreen: {
    backgroundColor: '#121413',
    borderRadius: RADII.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.charcoalBorder,
    minHeight: 125,
    marginBottom: 14,
  },
  typewriterPrompt: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.telemetryGreen,
    marginBottom: 6,
  },
  typewriterLiveLine: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.cream,
    lineHeight: 19,
    minHeight: 38,
  },
  clayCursor: {
    color: COLORS.clay,
    fontWeight: '900',
  },
  miniLogDivider: {
    height: 1,
    backgroundColor: COLORS.charcoalBorder,
    marginVertical: 10,
  },
  miniLogItem: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: 'rgba(242, 240, 233, 0.55)',
    marginBottom: 3,
  },
  streamActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.clay,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: RADII.pill,
    gap: 6,
  },
  streamActionBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.cream,
  },
  regimenStatusPill: {
    backgroundColor: COLORS.mossMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  regimenStatusText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.moss,
  },
  schedulerStage: {
    backgroundColor: COLORS.cream,
    borderRadius: RADII.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    position: 'relative',
    minHeight: 165,
    justifyContent: 'space-between',
  },
  weekGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 8,
  },
  dayCell: {
    flex: 1,
    height: 54,
    borderRadius: RADII.md,
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dayCellActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.moss,
  },
  dayShortText: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.creamBorder,
  },
  schedulerFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.creamBorder,
  },
  schedulerSelectedLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.clay,
    fontWeight: '700',
  },
  schedulerTaskName: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  saveProtocolBtn: {
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADII.pill,
  },
  saveProtocolBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  mockCursorWrapper: {
    position: 'absolute',
    zIndex: 30,
  },
  cursorArrowBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.clay,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    ...SHADOWS.clayGlow,
  },
});
