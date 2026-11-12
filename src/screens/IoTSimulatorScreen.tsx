import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_META } from '../data/mockData';
import { useIoT } from '../contexts/IoTContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';

const LUX_PRESETS = [
  { label: 'Sol Pleno', lux: 680, icon: 'sunny' },
  { label: 'Nublado', lux: 140, icon: 'cloud' },
  { label: 'Crepúsculo', lux: 35, icon: 'partly-sunny' },
  { label: 'Noite Escura', lux: 8, icon: 'moon' },
  { label: 'Madrugada', lux: 2, icon: 'cloudy-night' },
];

export const IoTSimulatorScreen: React.FC = () => {
  const {
    pole,
    isDark,
    isAnomalyActive,
    activeIoTOccurrence,
    telemetryLogs,
    setAmbientLux,
    setLampHardwareStatus,
    triggerNightFailureSimulation,
    restoreNormalPoleOperation,
  } = useIoT();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Visual Smart Streetlight Instrument Header */}
      <View
        style={[
          styles.poleStageCard,
          isDark ? styles.poleStageNight : styles.poleStageDay,
        ]}
      >
        {/* Top Status Bar */}
        <View style={styles.stageTopBar}>
          <View style={styles.nodePill}>
            <Ionicons name="hardware-chip" size={13} color={COLORS.cream} />
            <Text style={styles.nodePillText}>NODE #{pole.poleId}</Text>
          </View>

          <View
            style={[
              styles.conditionPill,
              isAnomalyActive
                ? { backgroundColor: COLORS.clay }
                : pole.isLightEmitting
                ? { backgroundColor: COLORS.telemetryGreen }
                : { backgroundColor: 'rgba(242, 240, 233, 0.2)' },
            ]}
          >
            <Text
              style={[
                styles.conditionPillText,
                pole.isLightEmitting &&
                  !isAnomalyActive && { color: COLORS.charcoal },
              ]}
            >
              {isAnomalyActive
                ? 'FALHA CRÍTICA: ESCURO + APAGADO'
                : pole.isLightEmitting
                ? 'NOITE: LUMINÁRIA ACESA (NOMINAL)'
                : 'DIA: FOTOCÉLULA EM STANDBY'}
            </Text>
          </View>
        </View>

        {/* Visual Pole & Light Cone Illustration */}
        <View style={styles.visualArena}>
          <View style={styles.poleGraphicsBox}>
            <View
              style={[
                styles.lampHead,
                pole.isLightEmitting && styles.lampHeadLit,
                !pole.isLampHardwareOk && styles.lampHeadFault,
              ]}
            >
              <Ionicons
                name={
                  pole.isLightEmitting
                    ? 'bulb'
                    : !pole.isLampHardwareOk
                    ? 'flash-off'
                    : 'bulb-outline'
                }
                size={28}
                color={
                  pole.isLightEmitting
                    ? '#FFF3B0'
                    : !pole.isLampHardwareOk
                    ? COLORS.clayLight
                    : COLORS.cream
                }
              />
            </View>
            {pole.isLightEmitting && <View style={styles.lightCone} />}
            <View style={styles.poleMast} />
          </View>

          {/* Real-time Sensor Readout Panel */}
          <View style={styles.sensorReadoutBox}>
            <Text style={styles.sensorReadoutTitle}>
              TELEMETRIA EM TEMPO REAL
            </Text>
            <View style={styles.readoutItem}>
              <Text style={styles.readoutLabel}>FOTOCÉLULA (LUX)</Text>
              <Text style={styles.readoutValue}>
                {pole.ambientLux} lx{' '}
                <Text style={styles.readoutHint}>
                  ({isDark ? '< 25 lx ESCURO' : '≥ 25 lx CLARO'})
                </Text>
              </Text>
            </View>

            <View style={styles.readoutItem}>
              <Text style={styles.readoutLabel}>CIRCUITO LED</Text>
              <Text
                style={[
                  styles.readoutValue,
                  !pole.isLampHardwareOk && { color: COLORS.clayLight },
                ]}
              >
                {pole.isLampHardwareOk
                  ? 'OPERANTE (OK)'
                  : 'QUEIMADO / APAGADO'}
              </Text>
            </View>

            <View style={styles.readoutItem}>
              <Text style={styles.readoutLabel}>POTÊNCIA ATIVA</Text>
              <Text style={styles.readoutValue}>
                {pole.powerDrawWatts} W @ {pole.voltageV} V
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.poleAddressText}>
          <Ionicons name="location" size={12} color={COLORS.clayLight} />{' '}
          {pole.address} ({pole.coordinates})
        </Text>
      </View>

      {/* 1-CLICK DEMO SCENARIO BUTTONS */}
      <View style={styles.quickScenarioCard}>
        <Text style={styles.sectionKicker}>
          SIMULAÇÃO RÁPIDA DE ENGENHARIA (1 CLIQUE)
        </Text>
        <Text style={styles.sectionTitle}>Regra de Negócio IoT</Text>
        <Text style={styles.sectionDesc}>
          Quando o sensor detecta que está <Text style={{ fontWeight: '700' }}>escuro (&lt; 25 lx)</Text> e o{' '}
          <Text style={{ fontWeight: '700' }}>poste está apagado</Text>, o próprio sistema abre uma ocorrência
          automática no AsyncStorage.
        </Text>

        <View style={styles.scenarioBtnRow}>
          <TouchableOpacity
            style={styles.triggerFaultBtn}
            onPress={triggerNightFailureSimulation}
            activeOpacity={0.86}
          >
            <Ionicons name="thunderstorm" size={18} color={COLORS.cream} />
            <Text style={styles.triggerFaultBtnText}>
              Simular Noite + Poste Apagado (Gerar Alerta)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={restoreNormalPoleOperation}
            activeOpacity={0.86}
          >
            <Ionicons name="checkmark-circle" size={16} color={COLORS.moss} />
            <Text style={styles.restoreBtnText}>Restaurar Lâmpada OK</Text>
          </TouchableOpacity>
        </View>

        {activeIoTOccurrence && (
          <View style={styles.activeAutoTicketBox}>
            <View style={styles.activeAutoTicketHeader}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.telemetryGreen}
              />
              <Text style={styles.activeAutoTicketProtocol}>
                OCORRÊNCIA AUTOMÁTICA ATIVA: #{activeIoTOccurrence.protocol}
              </Text>
            </View>
            <Text style={styles.activeAutoTicketTitle}>
              {activeIoTOccurrence.title}
            </Text>
            <Text style={styles.activeAutoTicketStatus}>
              Status na Fila:{' '}
              <Text style={{ fontWeight: '700', color: COLORS.clayLight }}>
                {STATUS_META[activeIoTOccurrence.status].label.toUpperCase()}
              </Text>
            </Text>
          </View>
        )}
      </View>

      {/* MANUAL HARDWARE & SENSOR CONTROLS */}
      <View style={styles.manualControlsCard}>
        <Text style={styles.sectionKicker}>CONTROLES MANUAIS DO SENSOR</Text>
        <Text style={styles.controlLabel}>
          1. Luminosidade Ambiente (Fotocélula LDR): {pole.ambientLux} lx
        </Text>

        <View style={styles.presetsGrid}>
          {LUX_PRESETS.map((preset) => {
            const selected = Math.abs(pole.ambientLux - preset.lux) < 12;
            return (
              <TouchableOpacity
                key={preset.label}
                style={[
                  styles.presetChip,
                  selected && styles.presetChipSelected,
                ]}
                onPress={() => setAmbientLux(preset.lux)}
              >
                <Ionicons
                  name={preset.icon as any}
                  size={14}
                  color={selected ? COLORS.cream : COLORS.moss}
                />
                <Text
                  style={[
                    styles.presetChipLabel,
                    selected && { color: COLORS.cream },
                  ]}
                >
                  {preset.label} ({preset.lux} lx)
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fine Lux Stepper */}
        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setAmbientLux(pole.ambientLux - 15)}
          >
            <Text style={styles.stepBtnText}>- 15 lx (Mais Escuro)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setAmbientLux(pole.ambientLux + 15)}
          >
            <Text style={styles.stepBtnText}>+ 15 lx (Mais Claro)</Text>
          </TouchableOpacity>
        </View>

        {/* Hardware Lamp Toggle */}
        <Text style={[styles.controlLabel, { marginTop: 16 }]}>
          2. Estado Físico da Luminária LED
        </Text>
        <View style={styles.hardwareToggleRow}>
          <TouchableOpacity
            style={[
              styles.hwOption,
              pole.isLampHardwareOk && styles.hwOptionOkActive,
            ]}
            onPress={() => setLampHardwareStatus(true)}
          >
            <Ionicons
              name="bulb"
              size={18}
              color={pole.isLampHardwareOk ? COLORS.cream : COLORS.moss}
            />
            <Text
              style={[
                styles.hwOptionText,
                pole.isLampHardwareOk && { color: COLORS.cream },
              ]}
            >
              Lâmpada Funcionando
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.hwOption,
              !pole.isLampHardwareOk && styles.hwOptionFaultActive,
            ]}
            onPress={() => setLampHardwareStatus(false)}
          >
            <Ionicons
              name="warning"
              size={18}
              color={!pole.isLampHardwareOk ? COLORS.cream : COLORS.clay}
            />
            <Text
              style={[
                styles.hwOptionText,
                !pole.isLampHardwareOk && { color: COLORS.cream },
              ]}
            >
              Poste Apagado / Queimado
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* NEURAL / TELEMETRY STREAM (Prompt.Md Section 2.C Card 2) */}
      <View style={styles.telemetryConsoleCard}>
        <View style={styles.consoleHeader}>
          <View style={styles.consoleDotRow}>
            <View style={styles.liveClayDot} />
            <Text style={styles.consoleTitle}>
              LIVE TELEMETRY STREAM • SERIAL MONITOR
            </Text>
          </View>
          <Text style={styles.consoleBaud}>115200 BAUD</Text>
        </View>

        {telemetryLogs.map((log, index) => (
          <View key={log.id} style={styles.logLine}>
            <Text style={styles.logTimestamp}>[{log.timestamp}]</Text>
            <Text
              style={[
                styles.logMessage,
                log.level === 'CRITICAL' && {
                  color: COLORS.clayLight,
                  fontWeight: '700',
                },
                log.level === 'SUCCESS' && { color: COLORS.telemetryGreen },
                log.level === 'WARN' && { color: COLORS.telemetryWarning },
              ]}
            >
              {log.message}
              {index === 0 ? ' ▋' : ''}
            </Text>
          </View>
        ))}
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
    padding: 16,
    paddingBottom: 120,
  },
  poleStageCard: {
    borderRadius: RADII.xxxl,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.floatingIsland,
  },
  poleStageDay: {
    backgroundColor: COLORS.moss,
  },
  poleStageNight: {
    backgroundColor: '#121915',
    borderWidth: 1.5,
    borderColor: COLORS.mossLight,
  },
  stageTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  nodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 240, 233, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    gap: 5,
  },
  nodePillText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  conditionPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
  },
  conditionPillText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  visualArena: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 14,
  },
  poleGraphicsBox: {
    width: 105,
    height: 155,
    backgroundColor: 'rgba(26, 26, 26, 0.45)',
    borderRadius: RADII.xl,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.14)',
  },
  lampHead: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(242, 240, 233, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  lampHeadLit: {
    backgroundColor: 'rgba(255, 243, 176, 0.28)',
    borderWidth: 1.5,
    borderColor: '#FFF3B0',
  },
  lampHeadFault: {
    backgroundColor: 'rgba(204, 88, 51, 0.28)',
    borderWidth: 1.5,
    borderColor: COLORS.clay,
  },
  lightCone: {
    position: 'absolute',
    top: 52,
    width: 88,
    height: 100,
    backgroundColor: 'rgba(255, 243, 176, 0.16)',
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    zIndex: 1,
  },
  poleMast: {
    width: 6,
    flex: 1,
    backgroundColor: 'rgba(242, 240, 233, 0.4)',
    zIndex: 2,
  },
  sensorReadoutBox: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.55)',
    borderRadius: RADII.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.12)',
  },
  sensorReadoutTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.clayLight,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.7,
  },
  readoutItem: {
    marginBottom: 8,
  },
  readoutLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: 'rgba(242, 240, 233, 0.6)',
  },
  readoutValue: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
  },
  readoutHint: {
    fontSize: 10,
    color: 'rgba(242, 240, 233, 0.65)',
  },
  poleAddressText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: 'rgba(242, 240, 233, 0.75)',
  },
  quickScenarioCard: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.xxl,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  sectionKicker: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.clay,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.charcoal,
    marginTop: 2,
    marginBottom: 4,
  },
  sectionDesc: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoalMuted,
    lineHeight: 19,
    marginBottom: 14,
  },
  scenarioBtnRow: {
    gap: 10,
  },
  triggerFaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.clay,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: RADII.pill,
    gap: 8,
    ...SHADOWS.clayGlow,
  },
  triggerFaultBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cream,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.mossMuted,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: RADII.pill,
    gap: 6,
  },
  restoreBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.moss,
  },
  activeAutoTicketBox: {
    marginTop: 14,
    backgroundColor: COLORS.charcoal,
    borderRadius: RADII.lg,
    padding: 14,
  },
  activeAutoTicketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  activeAutoTicketProtocol: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.telemetryGreen,
  },
  activeAutoTicketTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  activeAutoTicketStatus: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: 'rgba(242, 240, 233, 0.75)',
  },
  manualControlsCard: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.xxl,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  controlLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginTop: 8,
    marginBottom: 10,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creamSubtle,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: RADII.pill,
    gap: 5,
  },
  presetChipSelected: {
    backgroundColor: COLORS.moss,
  },
  presetChipLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepBtn: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingVertical: 9,
    borderRadius: RADII.md,
    alignItems: 'center',
  },
  stepBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.moss,
  },
  hardwareToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hwOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.creamSubtle,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: RADII.lg,
    gap: 6,
  },
  hwOptionOkActive: {
    backgroundColor: COLORS.moss,
  },
  hwOptionFaultActive: {
    backgroundColor: COLORS.clay,
  },
  hwOptionText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  telemetryConsoleCard: {
    backgroundColor: COLORS.charcoal,
    borderRadius: RADII.xxl,
    padding: 18,
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.charcoalBorder,
  },
  consoleDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveClayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.clay,
  },
  consoleTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.6,
  },
  consoleBaud: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.telemetryGreen,
  },
  logLine: {
    marginBottom: 8,
  },
  logTimestamp: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: 'rgba(242, 240, 233, 0.45)',
    marginBottom: 1,
  },
  logMessage: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.cream,
    lineHeight: 16,
  },
});
